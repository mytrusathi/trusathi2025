import type { Profile } from '../../types/profile';

type ParsedProfileResult = {
  parsed: Partial<Profile>;
  matchedFields: Array<keyof Profile>;
};

const RELIGIONS = ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'Parsi', 'Jewish'];
const BULLET_PREFIX = /^[\s\-*]+/;

const FIELD_ALIASES: Record<keyof Partial<Profile>, string[]> = {
  id: [],
  name: ['name', 'full name', 'candidate name', 'boy name', 'girl name', 'bride name', 'groom name'],
  gender: ['gender', 'sex'],
  dob: ['dob', 'd.o.b', 'date of birth', 'birth date'],
  tob: ['tob', 'time of birth', 'birth time', 'time'],
  pob: ['pob', 'place of birth', 'birth place'],
  height: ['height', 'ht'],
  maritalStatus: ['marital status', 'married status'],
  city: ['city', 'current city', 'location', 'living in', 'residence', 'staying in', 'address', 'adress'],
  state: ['state'],
  country: ['country'],
  religion: ['religion', 'community', 'samaj'],
  caste: ['caste'],
  subCaste: ['sub caste', 'subcaste', 'sub-caste'],
  gotra: ['gotra'],
  manglik: ['manglik'],
  education: ['education', 'qualification', 'degree', 'study'],
  profession: ['profession', 'occupation', 'job', 'work', 'designation'],
  income: ['income', 'salary', 'ctc', 'package', 'annual income', 'lpa'],
  company: ['company', 'organisation', 'organization', 'working at', 'employer'],
  fatherName: ['father name', "father's name", 'father'],
  fatherOccupation: ['father occupation', "father's occupation", 'father profession', 'father business'],
  motherName: ['mother name', "mother's name", 'mother'],
  motherOccupation: ['mother occupation', "mother's occupation", 'mother profession'],
  siblings: ['siblings', 'brothers', 'sisters', 'family detail', 'family details'],
  familyType: ['family type', 'family'],
  imageUrl: [],
  about: ['about', 'about candidate', 'summary', 'description', 'note', 'requirements about partner', 'partner preference', 'partner requirement'],
  contact: ['contact', 'mobile', 'mob', 'phone', 'whatsapp', 'whatapp', 'contact no', 'contact number'],
  createdBy: [],
  createdAt: [],
  updatedAt: [],
  isPublic: [],
};

const normalizeText = (value: string) =>
  value
    .replace(/\u00a0/g, ' ')
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\t/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeKey = (value: string) =>
  normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z]/g, '');

const titleCase = (value: string) =>
  normalizeText(value)
    .toLowerCase()
    .split(' ')
    .map((part) => (part ? `${part[0].toUpperCase()}${part.slice(1)}` : part))
    .join(' ')
    .trim();

const cleanCandidateValue = (value: string) =>
  normalizeText(value)
    .replace(/^(is|=|:|-|\.)\s*/i, '')
    .replace(/\s*(,|\|)\s*$/g, '')
    .replace(/^\*+|\*+$/g, '')
    .trim();

const tokenizeLines = (rawText: string): string[] => {
  const lines: string[] = [];
  for (const rawLine of rawText.split(/\r?\n/)) {
    const stripped = rawLine
      .replace(/^\s*\*?\s*\d+\s*[.)-]?\s*/g, '')
      .replace(BULLET_PREFIX, '')
      .replace(/\*/g, '')
      .trim();
    if (!stripped) continue;

    const chunks = stripped
      .split(/[|]/)
      .flatMap((piece) => piece.split(/\s;\s|;\s|\s;/))
      .map((piece) => normalizeText(piece))
      .filter(Boolean);

    lines.push(...chunks);
  }
  return lines;
};

const buildAliasMap = () => {
  const map = new Map<string, keyof Profile>();
  (Object.entries(FIELD_ALIASES) as Array<[keyof Profile, string[]]>).forEach(([field, aliases]) => {
    aliases.forEach((alias) => map.set(normalizeKey(alias), field));
  });
  return map;
};

const ALIAS_MAP = buildAliasMap();

const extractLabelValuePairs = (lines: string[]) => {
  const pairs: Array<{ key: string; value: string }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const strict = line.match(/^(.{1,60}?)\s*[:=.-]\s*(.+)$/);
    if (strict) {
      pairs.push({ key: strict[1], value: strict[2] });
      continue;
    }

    const keyOnly = normalizeKey(line);
    if (ALIAS_MAP.has(keyOnly) && i + 1 < lines.length) {
      const next = lines[i + 1];
      if (!/^.{1,60}\s*[:=.-]\s*.+$/.test(next)) {
        pairs.push({ key: line, value: next });
      }
    }
  }

  return pairs;
};

const fieldValueFromPairs = (pairs: Array<{ key: string; value: string }>, field: keyof Profile): string => {
  for (const pair of pairs) {
    const key = normalizeKey(pair.key);
    const target = ALIAS_MAP.get(key);
    if (target === field) return cleanCandidateValue(pair.value);
  }

  for (const pair of pairs) {
    const key = normalizeKey(pair.key);
    const aliases = FIELD_ALIASES[field] || [];
    if (aliases.some((alias) => key.includes(normalizeKey(alias)))) return cleanCandidateValue(pair.value);
  }

  return '';
};

const fieldValueFromInline = (text: string, field: keyof Profile): string => {
  const aliases = FIELD_ALIASES[field];
  if (!aliases || aliases.length === 0) return '';

  const labelPattern = aliases
    .map((alias) => alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*'))
    .join('|');

  const regex = new RegExp(
    `(?:^|\\n|,|\\|)\\s*(?:\\*?\\s*\\d+\\s*[.)-]?\\s*)?(?:${labelPattern})\\s*(?:\\*|:|=|-|\\.|is\\s+)*\\s*([^\\n,|]{1,140})`,
    'i'
  );

  const match = text.match(regex);
  return cleanCandidateValue(match?.[1] || '');
};

const toIsoDate = (input: string): string => {
  const value = normalizeText(input);
  if (!value) return '';

  const ymd = value.match(/\b(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})\b/);
  if (ymd) {
    const year = Number(ymd[1]);
    const month = Number(ymd[2]);
    const day = Number(ymd[3]);
    if (year > 1900 && year < 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
  }

  const dmy = value.match(/\b(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})\b/);
  if (dmy) {
    const day = Number(dmy[1]);
    const month = Number(dmy[2]);
    let year = Number(dmy[3]);
    if (year < 100) year += year > 40 ? 1900 : 2000;
    if (year > 1900 && year < 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return `${parsed.getFullYear().toString().padStart(4, '0')}-${(parsed.getMonth() + 1).toString().padStart(2, '0')}-${parsed.getDate().toString().padStart(2, '0')}`;
  }

  return '';
};

const to24HourTime = (input: string): string => {
  const value = normalizeText(input).toLowerCase();
  if (!value) return '';

  const match = value.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/);
  if (!match) return '';

  let hour = Number(match[1]);
  const minute = Number(match[2] || '0');
  const meridiem = match[3];

  if (minute < 0 || minute > 59 || hour < 0 || hour > 23) return '';

  if (meridiem === 'pm' && hour < 12) hour += 12;
  if (meridiem === 'am' && hour === 12) hour = 0;

  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

const normalizePhone = (input: string): string => {
  const value = input.replace(/[^\d+]/g, '');
  const onlyDigits = value.replace(/\D/g, '');
  const local = onlyDigits.slice(-10);
  if (local.length === 10) return local;
  if (value.startsWith('+') && onlyDigits.length >= 10) return `+${onlyDigits}`;
  return input.trim();
};

const normalizeHeight = (input: string): string => {
  const value = normalizeText(input).toLowerCase();
  if (!value) return '';

  const ftIn = value.match(/(\d)\s*(?:ft|feet|')\s*(\d{1,2})?\s*(?:in|inch|inches|")?/);
  if (ftIn) {
    const feet = Number(ftIn[1]);
    const inches = Number(ftIn[2] || '0');
    if (feet >= 4 && feet <= 7 && inches >= 0 && inches < 12) return `${feet}ft ${inches}in`;
  }

  const compact = value.match(/\b(\d)\s*['’]\s*(\d{1,2})\b/);
  if (compact) {
    const feet = Number(compact[1]);
    const inches = Number(compact[2]);
    if (feet >= 4 && feet <= 7 && inches >= 0 && inches < 12) return `${feet}ft ${inches}in`;
  }

  const dotStyle = value.match(/\b([4-7])\s*[.]\s*(\d{1,2})\s*(?:"|in)?\b/);
  if (dotStyle) {
    const feet = Number(dotStyle[1]);
    const inches = Number(dotStyle[2]);
    if (feet >= 4 && feet <= 7 && inches >= 0 && inches < 12) return `${feet}ft ${inches}in`;
  }

  const cm = value.match(/\b(1[4-9]\d|20\d)\s*cm\b/);
  if (cm) {
    const totalInches = Math.round(Number(cm[1]) / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    if (feet >= 4 && feet <= 7) return `${feet}ft ${inches}in`;
  }

  return input.trim();
};

const normalizeGender = (input: string): Profile['gender'] | '' => {
  const value = normalizeText(input).toLowerCase();
  if (/\b(male|boy|groom|m)\b/.test(value)) return 'male';
  if (/\b(female|girl|bride|f)\b/.test(value)) return 'female';
  return '';
};

const normalizeManglik = (input: string): string => {
  const value = normalizeText(input).toLowerCase();
  if (!value) return '';
  if (/\b(non|no)\b.*manglik|non[-\s]?manglik/.test(value)) return 'No';
  if (/anshik|partial/.test(value)) return 'Anshik (Partial)';
  if (/manglik/.test(value)) return 'Yes';
  if (/don't know|dont know|unknown|na/.test(value)) return "Don't Know";
  return input.trim();
};

const normalizeMaritalStatus = (input: string): string => {
  const value = normalizeText(input).toLowerCase();
  if (!value) return '';
  if (/never|unmarried|single/.test(value)) return 'Never Married';
  if (/divorc/.test(value)) return 'Divorced';
  if (/widow|widower|widowed/.test(value)) return 'Widowed';
  if (/awaiting/.test(value)) return 'Awaiting Divorce';
  return titleCase(input);
};

const normalizeFamilyType = (input: string): string => {
  const value = normalizeText(input).toLowerCase();
  if (!value) return '';
  if (/nuclear/.test(value)) return 'Nuclear';
  if (/joint/.test(value)) return 'Joint';
  return titleCase(input);
};

const normalizeReligion = (input: string): string => {
  const value = normalizeText(input);
  if (!value) return '';
  const match = RELIGIONS.find((religion) => religion.toLowerCase() === value.toLowerCase());
  return match || titleCase(value);
};

const findBestRawValue = (pairs: Array<{ key: string; value: string }>, text: string, field: keyof Profile) =>
  fieldValueFromPairs(pairs, field) || fieldValueFromInline(text, field);

const addIfValue = (acc: Partial<Profile>, matched: Set<keyof Profile>, key: keyof Profile, value: unknown) => {
  if (typeof value === 'string' && value.trim()) {
    acc[key] = value.trim() as never;
    matched.add(key);
  }
};

const inferUnlabelledName = (lines: string[]): string => {
  for (const line of lines) {
    const value = normalizeText(line);
    if (value.length < 3 || value.length > 40) continue;
    if (/\d/.test(value)) continue;
    if (/\b(biodata|profile|dob|height|religion|caste|occupation|income|contact|mobile)\b/i.test(value)) continue;
    if (/^[a-z][a-z\s.']+$/i.test(value)) return value;
  }
  return '';
};

const inferCityState = (location: string): { city: string; state: string } => {
  const clean = normalizeText(location);
  if (!clean) return { city: '', state: '' };
  const parts = clean.split(',').map((part) => titleCase(part.trim())).filter(Boolean);
  if (parts.length >= 2) return { city: parts[0], state: parts[1] };
  return { city: parts[0] || '', state: '' };
};

export const parseWhatsAppBiodataToProfile = (rawText: string): ParsedProfileResult => {
  const text = rawText.replace(/\r/g, '\n');
  const lines = tokenizeLines(rawText);
  const pairs = extractLabelValuePairs(lines);
  const parsed: Partial<Profile> = {};
  const matched = new Set<keyof Profile>();

  const nameRaw = findBestRawValue(pairs, text, 'name') || inferUnlabelledName(lines);
  const cleanName = nameRaw.replace(/\b(mr|mrs|ms|dr)\.?\s+/gi, '').trim();
  addIfValue(parsed, matched, 'name', cleanName ? titleCase(cleanName) : '');

  addIfValue(parsed, matched, 'gender', normalizeGender(findBestRawValue(pairs, text, 'gender') || text));
  addIfValue(parsed, matched, 'dob', toIsoDate(findBestRawValue(pairs, text, 'dob')));
  addIfValue(parsed, matched, 'tob', to24HourTime(findBestRawValue(pairs, text, 'tob')));
  addIfValue(parsed, matched, 'pob', titleCase(findBestRawValue(pairs, text, 'pob')));
  addIfValue(parsed, matched, 'height', normalizeHeight(findBestRawValue(pairs, text, 'height')));
  addIfValue(parsed, matched, 'maritalStatus', normalizeMaritalStatus(findBestRawValue(pairs, text, 'maritalStatus')));

  const religionFromText =
    findBestRawValue(pairs, text, 'religion') ||
    RELIGIONS.find((item) => new RegExp(`\\b${item}\\b`, 'i').test(text)) ||
    '';
  addIfValue(parsed, matched, 'religion', normalizeReligion(religionFromText));
  addIfValue(parsed, matched, 'caste', titleCase(findBestRawValue(pairs, text, 'caste')));
  addIfValue(parsed, matched, 'subCaste', titleCase(findBestRawValue(pairs, text, 'subCaste')));
  addIfValue(parsed, matched, 'gotra', titleCase(findBestRawValue(pairs, text, 'gotra')));
  addIfValue(parsed, matched, 'manglik', normalizeManglik(findBestRawValue(pairs, text, 'manglik') || text));

  addIfValue(parsed, matched, 'education', findBestRawValue(pairs, text, 'education'));
  addIfValue(parsed, matched, 'profession', findBestRawValue(pairs, text, 'profession'));
  addIfValue(parsed, matched, 'company', findBestRawValue(pairs, text, 'company'));

  const incomeRaw =
    findBestRawValue(pairs, text, 'income') ||
    (text.match(/\b(\d+(?:\.\d+)?\s*(?:lpa|lac|lakh|lakhs|per annum|pa|discuss on call))\b/i)?.[1] ?? '');
  addIfValue(parsed, matched, 'income', incomeRaw ? incomeRaw.toUpperCase().replace(/\s+/g, ' ') : '');

  const cityRaw = findBestRawValue(pairs, text, 'city');
  const stateRaw = findBestRawValue(pairs, text, 'state');
  const locationSplit = inferCityState(cityRaw);
  addIfValue(parsed, matched, 'city', titleCase(cityRaw || locationSplit.city));
  addIfValue(parsed, matched, 'state', titleCase(stateRaw || locationSplit.state));

  addIfValue(parsed, matched, 'fatherName', titleCase(findBestRawValue(pairs, text, 'fatherName')));
  addIfValue(parsed, matched, 'fatherOccupation', findBestRawValue(pairs, text, 'fatherOccupation'));
  addIfValue(parsed, matched, 'motherName', titleCase(findBestRawValue(pairs, text, 'motherName')));
  addIfValue(parsed, matched, 'motherOccupation', findBestRawValue(pairs, text, 'motherOccupation'));

  const siblingsRaw =
    findBestRawValue(pairs, text, 'siblings') ||
    (text.match(/\b(\d+\s*brother[s]?(?:\s*(?:and|,)\s*\d+\s*sister[s]?)?)\b/i)?.[1] ?? '');
  addIfValue(parsed, matched, 'siblings', siblingsRaw);
  addIfValue(parsed, matched, 'familyType', normalizeFamilyType(findBestRawValue(pairs, text, 'familyType')));

  const contactRaw =
    findBestRawValue(pairs, text, 'contact') ||
    (text.match(/\b((?:\+?91[\s-]?)?[6-9]\d{9})\b/)?.[1] ?? '');
  addIfValue(parsed, matched, 'contact', contactRaw ? normalizePhone(contactRaw) : '');

  addIfValue(parsed, matched, 'about', findBestRawValue(pairs, text, 'about'));

  return { parsed, matchedFields: Array.from(matched) };
};

export type { ParsedProfileResult };

