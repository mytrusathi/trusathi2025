// src/utils/parseBiodata.ts

// --- AGE CALCULATOR ---
const calculateAge = (dobString: string): string => {
  if (!dobString) return ''

  const cleanStr = dobString
    .replace(/(\d+)(st|nd|rd|th)/i, '$1')
    .replace(/['"]/g, '')
    .replace(/[-.]/g, '/')

  let birthDate = new Date(cleanStr)

  // try dd/mm/yyyy
  if (isNaN(birthDate.getTime())) {
    const parts = cleanStr.split('/')
    if (parts.length === 3) {
      birthDate = new Date(
        Number(parts[2]),
        Number(parts[1]) - 1,
        Number(parts[0])
      )
    }
  }

  if (isNaN(birthDate.getTime())) return ''

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--

  return age.toString()
}

// --- MAIN PARSER ---
export const parseBiodataHybrid = (text: string) => {
  const data: Record<string, string> = {
    name: '',
    gender: '',
    age: '',
    height: '',
    dob: '',
    tob: '',
    pob: '',
    city: '',
    address: '',
    caste: '',
    gotra: '',
    complexion: '',
    diet: '',
    education: '',
    profession: '',
    income: '',
    company: '',
    father: '',
    fatherOcc: '',
    mother: '',
    motherOcc: '',
    siblings: '',
    contact: '',
    manglik: '',
    groupName: '',
  }

  // normalize text
  let cleanText = text
    .replace(/([a-z])(Name[:\-])/gi, '$1\n$2')
    .replace(/([a-z])(DOB[:\-])/gi, '$1\n$2')
    .replace(/([a-z])(Contact[:\-])/gi, '$1\n$2')

  const lines = cleanText
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  // helper matcher
  const getValue = (patterns: string[], exclude: string[] = []) => {
    for (let line of lines) {
      const lower = line.toLowerCase()
      if (exclude.some((k) => lower.includes(k.toLowerCase()))) continue

      for (let pattern of patterns) {
        const regex = new RegExp(`${pattern}[^a-z0-9\\n]*\\s*(.+)`, 'i')
        const match = line.match(regex)
        if (match && match[1]) return match[1].trim()
      }
    }
    return ''
  }

  // BASIC FIELDS
  data.name = getValue(
    [
      'Name',
      'FULL\\s*NAME',
      'Candidate Name',
      'Boy Name',
      'Girl Name',
      'Bride Name',
      'Groom Name',
    ],
    ['Father', 'Mother']
  )

  data.gender = getValue(['Gender', 'Sex'])
  data.height = getValue(['Height', 'Ht', 'HEIGHT'])
  data.complexion = getValue(['Color', 'Complexion', 'Skin Tone'])
  data.diet = getValue(['Diet', 'Food'])
  data.dob = getValue(['Date of Birth', 'DOB', 'D\\.O\\.B', 'D.O.B'])
  data.tob = getValue(['Birth Time', 'Time of Birth', 'TOB', 'Time'])
  data.pob = getValue(['Birth Place', 'Place of Birth', 'POB'])
  data.city = getValue(['City', 'Location', 'Living in']) || data.pob

  data.caste = getValue(['Caste', 'Sub Caste'])
  data.gotra = getValue(['Gotra'])
  data.education = getValue(['Qualification', 'Education', 'Degree'])
  data.profession = getValue(
    ['Profession', 'Occupation', 'Job', 'Work'],
    ['Father', 'Mother']
  )
  data.company = getValue(['Company', 'Working at', 'Office'])
  data.income = getValue(['Package', 'Income', 'Salary', 'CTC', 'LPA'])
  data.address = getValue(['Address', 'Residence'])
  data.contact = getValue(['Mob', 'Mobile', 'Contact', 'Phone', 'WhatsApp'])

  // parents & siblings
  lines.forEach((line) => {
    const l = line.toLowerCase()

    if (l.includes('father') && !data.father) {
      data.father = line.replace(/father/i, '').replace(/[:\-]/, '').trim()
    }

    if (l.includes('mother') && !data.mother) {
      data.mother = line.replace(/mother/i, '').replace(/[:\-]/, '').trim()
    }

    if (l.includes('sibling') || l.includes('brother') || l.includes('sister')) {
      data.siblings = (data.siblings + ' ' + line).trim()
    }
  })

  // gender fallback
  if (!data.gender) {
    if (/\b(boy|male|groom|he)\b/i.test(text)) data.gender = 'Male'
    if (/\b(girl|female|bride|she)\b/i.test(text)) data.gender = 'Female'
  }

  // manglik
  if (/non[\s-]?manglik/i.test(text)) data.manglik = 'Non-Manglik'
  else if (/anshik/i.test(text)) data.manglik = 'Anshik'
  else if (/manglik/i.test(text)) data.manglik = 'Manglik'

  // height fallback
  if (!data.height) {
    const ht = text.match(/(\d)['’.\s-]*(\d{1,2})/)
    if (ht) data.height = `${ht[1]}'${ht[2]}`
  }

  // income fallback
  if (!data.income) {
    const inc = text.match(/(\d+\.?\d*)\s*(LPA|Lac|Lakhs|CTC)/i)
    if (inc) data.income = inc[0]
  }

  // phone fallback
  if (!data.contact) {
    const phone = text.match(/(\+91|0)?\s?\d{10}/)
    if (phone) data.contact = phone[0]
  }

  // clean name
  if (data.name) {
    data.name = data.name
      .replace(/^(Mr|Ms|Mrs|Dr|Er)\.?\s+/i, '')
      .replace(/\(.*\)/, '')
      .trim()
  }

  // age from dob
  if (data.dob) {
    const age = calculateAge(data.dob)
    if (age) data.age = age
  }

  console.log('Parsed biodata:', data)

  return data
}

// default export (important for easy imports)
export default parseBiodataHybrid
