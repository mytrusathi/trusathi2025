import { Metadata } from 'next';
import { AppUser } from '@/types/appUser';
import { Profile } from '@/types/profile';
import CommunityClientPage from './CommunityClientPage';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  booleanValue?: boolean;
  timestampValue?: string;
  nullValue?: null;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
}

interface FirestoreDocument {
  name: string;
  fields?: Record<string, FirestoreValue>;
}

interface FirestoreRunQueryRow {
  document?: FirestoreDocument;
}

type ParsedFirestoreValue =
  | string
  | number
  | boolean
  | null
  | ParsedFirestoreValue[]
  | { [key: string]: ParsedFirestoreValue };

// Helper to parse Firestore REST API response fields
function parseFirestoreValue(value?: FirestoreValue): ParsedFirestoreValue {
  if (!value) return null;
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return parseInt(value.integerValue, 10);
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.timestampValue !== undefined) return value.timestampValue;
  if (value.nullValue !== undefined) return null;
  if (value.arrayValue !== undefined) return (value.arrayValue.values || []).map(parseFirestoreValue);
  if (value.mapValue !== undefined) {
    const obj: Record<string, ParsedFirestoreValue> = {};
    for (const [k, v] of Object.entries(value.mapValue.fields || {})) {
      obj[k] = parseFirestoreValue(v);
    }
    return obj;
  }
  return null;
}

function parseFirestoreDoc(doc?: FirestoreDocument) {
  if (!doc || !doc.fields) return null;
  const parsed: Record<string, ParsedFirestoreValue> = { id: doc.name.split('/').pop() || '' };
  for (const [key, val] of Object.entries(doc.fields)) {
    parsed[key] = parseFirestoreValue(val);
  }
  return parsed;
}

// 1. Safe SEO Metadata via REST API
export async function generateMetadata({ params }: { params: Promise<{ adminId: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { adminId } = resolvedParams;
  let groupName = "Community";
  
  if (PROJECT_ID) {
    try {
      // Try fetching by ID first
      let res = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${adminId}`, { next: { revalidate: 3600 } });
      const data = await res.json() as FirestoreDocument;
      
      if (data.fields) {
        groupName = data.fields.groupName?.stringValue || "Community";
      } else {
        // Query by slug
        const qBody = {
          structuredQuery: {
            from: [{ collectionId: "users" }],
            where: { fieldFilter: { field: { fieldPath: "slug" }, op: "EQUAL", value: { stringValue: adminId }}},
            limit: 1
          }
        };
        res = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`, {
          method: 'POST', body: JSON.stringify(qBody),
          headers: { 'Content-Type': 'application/json' },
          next: { revalidate: 3600 }
        });
        const queryData = await res.json() as FirestoreRunQueryRow[];
        if (queryData[0] && queryData[0].document) {
          groupName = queryData[0].document.fields?.groupName?.stringValue || "Community";
        }
      }
    } catch (e) { console.error('REST Metadata Error', e); }
  }
  
  return { title: `${groupName} Matrimony | TruSathi` };
}

// 2. Main Page using Light REST API
export default async function CommunityPage({ params }: { params: Promise<{ adminId: string }> }) {
  const resolvedParams = await params;
  const { adminId } = resolvedParams;
  
  let adminData: AppUser | null = null;
  let profiles: Profile[] = [];
  let resolvedUid: string | null = null;

  try {
    if (PROJECT_ID) {
      // 1. Resolve slug in URL
      const qBody = {
        structuredQuery: {
          from: [{ collectionId: "users" }],
          where: { fieldFilter: { field: { fieldPath: "slug" }, op: "EQUAL", value: { stringValue: adminId }}},
          limit: 1
        }
      };
      let res = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`, {
        method: 'POST', body: JSON.stringify(qBody), headers: { 'Content-Type': 'application/json' }, cache: 'no-store'
      });
      const qData = await res.json() as FirestoreRunQueryRow[];
      
      if (qData[0] && qData[0].document) {
        adminData = { ...parseFirestoreDoc(qData[0].document), uid: qData[0].document.name.split('/').pop() } as AppUser;
        resolvedUid = adminData.uid;
      } else {
        res = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${adminId}`, { cache: 'no-store' });
        const docData = await res.json() as FirestoreDocument;
        if (docData.fields) {
          adminData = { ...parseFirestoreDoc(docData), uid: adminId } as AppUser;
          resolvedUid = adminId;
        }
      }

      // 2. Fetch profiles safely mapped
      if (resolvedUid) {
        const perfBody = {
          structuredQuery: {
            from: [{ collectionId: "profiles" }],
            where: { fieldFilter: { field: { fieldPath: "createdBy" }, op: "EQUAL", value: { stringValue: resolvedUid }}},
            limit: 500
          }
        };
        const pRes = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`, {
          method: 'POST', body: JSON.stringify(perfBody), headers: { 'Content-Type': 'application/json' }, cache: 'no-store'
        });
        const pData = await pRes.json() as FirestoreRunQueryRow[];
        
        // Firestore runQuery returns [{readTime: ...}] for empty results. 
        // Valid docs have {document: ...}
        if (Array.isArray(pData)) {
            profiles = pData
              .filter((item): item is FirestoreRunQueryRow & { document: FirestoreDocument } => Boolean(item.document))
              .map((item) => parseFirestoreDoc(item.document) as unknown as Profile)
              // Ensure we show public profiles (default to public if isPublic is not explicitly false)
              .filter((p: Profile) => p.isPublic !== false);
        }
      }
    }
  } catch (error) {
    console.error("Fetch REST error:", error);
  }

  return <CommunityClientPage initialAdmin={adminData} initialProfiles={profiles} />;
}
