"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PublicHome from "@/components/PublicHome";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const q = query(
        collection(db, "profiles"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setProfiles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    load();
  }, []);

  return (
    <PublicHome
      profiles={profiles}
      loading={loading}
      onAdminLoginClick={() => router.push("/admin")}
      onMemberLoginClick={() => router.push("/member")}
    />
  );
}
