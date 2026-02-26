import type { Profile } from '../../types/profile';

type ParsedProfileResult = {
  parsed: Partial<Profile>;
  matchedFields: Array<keyof Profile>;
};

const RELIGIONS = ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'Parsi', 'Jewish'];
const KEY_NORMALIZER = /[^a-z]/gi;

const normalizeText = (value: string) =>
  value
    .replace(/\u00a0/g, ' ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\t/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeLineKey = (value: string) =>
  value
    .toLowerCase()
    .replace(KEY_NORMALIZER, '')
    .trim();

const titleCase = (value: string) =>
  value
    .toLowerCase()
    .split(/\s+/)
    .map((part) => (part ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : part))
    .join(' ')
    .trim();

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

  if (!meridiem && hour > 23) return '';
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

const byLabels = (lines: string[], labels: string[]): string => {
  const normalizedLabels = labels.map(normalizeLineKey);
  for (const line of lines) {
    const pair = line.match(/^(.{1,40}?)\s*[:|\-]\s*(.+)$/);
    if (!pair) continue;
    const key = normalizeLineKey(pair[1]);
    if (normalizedLabels.some((label) => key.includes(label))) return pair[2].trim();
  }
  return '';
};

const byPattern = (text: string, pattern: RegExp): string => {
  const match = text.match(pattern);
  return match?.[1]?.trim() || '';
};

const addIfValue = (acc: Partial<Profile>, matched: Set<keyof Profile>, key: keyof Profile, value: unknown) => {
  if (typeof value === 'string' && value.trim()) {
    acc[key] = value.trim() as never;
    matched.add(key);
  }
};

export const parseWhatsAppBiodataToProfile = (rawText: string): ParsedProfileResult => {
  const text = normalizeText(rawText);
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => normalizeText(line))
    .filter(Boolean);

  const parsed: Partial<Profile> = {};
  const matched = new Set<keyof Profile>();

  const name =
    byLabels(lines, ['full name', 'name', 'candidate name', 'boy name', 'girl name', 'bride name', 'groom name']) ||
    byPattern(text, /\b(?:biodata|profile)\s*(?:of|for)?\s*([a-z][a-z\s.']{2,})/i);
  addIfValue(parsed, matched, 'name', name ? titleCase(name.replace(/\b(mr|mrs|ms|dr)\.?\s+/gi, '').trim()) : '');

  const gender = normalizeGender(byLabels(lines, ['gender', 'sex']) || text);
  addIfValue(parsed, matched, 'gender', gender);

  const dobSource =
    byLabels(lines, ['dob', 'd.o.b', 'date of birth', 'birth date']) ||
    byPattern(text, /\b(?:dob|date of birth)\s*[:\-]?\s*([^\n,;]+)/i) ||
    byPattern(text, /\b(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}|\d{4}[\/.-]\d{1,2}[\/.-]\d{1,2})\b/);
  addIfValue(parsed, matched, 'dob', toIsoDate(dobSource));

  const tobSource = byLabels(lines, ['tob', 'time of birth', 'birth time']);
  addIfValue(parsed, matched, 'tob', to24HourTime(tobSource));

  const pob = byLabels(lines, ['pob', 'birth place', 'place of birth']);
  addIfValue(parsed, matched, 'pob', titleCase(pob));

  const heightSource = byLabels(lines, ['height', 'ht']) || byPattern(text, /\b(\d\s*(?:ft|feet|')\s*\d{0,2}\s*(?:in|inch|")?)\b/i);
  addIfValue(parsed, matched, 'height', normalizeHeight(heightSource));

  const maritalStatus = byLabels(lines, ['marital status', 'married status']);
  addIfValue(parsed, matched, 'maritalStatus', normalizeMaritalStatus(maritalStatus));

  const religion =
    byLabels(lines, ['religion', 'community']) ||
    RELIGIONS.find((item) => new RegExp(`\\b${item}\\b`, 'i').test(text)) ||
    '';
  addIfValue(parsed, matched, 'religion', normalizeReligion(religion));

  addIfValue(parsed, matched, 'caste', titleCase(byLabels(lines, ['caste'])));
  addIfValue(parsed, matched, 'subCaste', titleCase(byLabels(lines, ['sub caste', 'subcaste'])));
  addIfValue(parsed, matched, 'gotra', titleCase(byLabels(lines, ['gotra'])));
  addIfValue(parsed, matched, 'manglik', normalizeManglik(byLabels(lines, ['manglik'])));

  addIfValue(parsed, matched, 'education', byLabels(lines, ['education', 'qualification', 'degree']));

  const profession =
    byLabels(lines, ['profession', 'occupation', 'job', 'work']) ||
    byPattern(text, /\bworking\s+as\s+([^\n,.;]+)/i);
  addIfValue(parsed, matched, 'profession', profession);

  addIfValue(parsed, matched, 'company', byLabels(lines, ['company', 'organisation', 'organization', 'working at']));

  const income =
    byLabels(lines, ['income', 'salary', 'ctc', 'package', 'lpa']) ||
    byPattern(text, /\b(\d+(?:\.\d+)?\s*(?:lpa|lac|lakh|lakhs|per annum|pa))\b/i);
  addIfValue(parsed, matched, 'income', income ? income.toUpperCase().replace(/\s+/g, ' ') : '');

  const city =
    byLabels(lines, ['city', 'current city', 'location', 'living in']) ||
    byPattern(text, /\b(?:living in|from)\s+([a-z][a-z\s]+)\b/i);
  addIfValue(parsed, matched, 'city', titleCase(city));

  addIfValue(parsed, matched, 'state', titleCase(byLabels(lines, ['state'])));

  addIfValue(parsed, matched, 'fatherName', titleCase(byLabels(lines, ['father name', "father's name", 'father'])));
  addIfValue(parsed, matched, 'fatherOccupation', byLabels(lines, ['father occupation', "father's occupation", 'father profession']));
  addIfValue(parsed, matched, 'motherName', titleCase(byLabels(lines, ['mother name', "mother's name", 'mother'])));
  addIfValue(parsed, matched, 'motherOccupation', byLabels(lines, ['mother occupation', "mother's occupation", 'mother profession']));

  const siblings =
    byLabels(lines, ['siblings', 'brothers', 'sisters']) ||
    byPattern(text, /\b(\d+\s*brother[s]?(?:\s*and\s*\d+\s*sister[s]?)?)\b/i);
  addIfValue(parsed, matched, 'siblings', siblings);

  addIfValue(parsed, matched, 'familyType', normalizeFamilyType(byLabels(lines, ['family type', 'family'])));

  const contact =
    byLabels(lines, ['contact', 'mobile', 'phone', 'whatsapp', 'mob']) ||
    byPattern(text, /\b((?:\+?91[\s-]?)?[6-9]\d{9})\b/);
  addIfValue(parsed, matched, 'contact', contact ? normalizePhone(contact) : '');

  const about = byLabels(lines, ['about', 'about candidate', 'note', 'description']) || '';
  addIfValue(parsed, matched, 'about', about);

  return { parsed, matchedFields: Array.from(matched) };
};

export type { ParsedProfileResult };

