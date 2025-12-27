export interface Profile {
  id?: string;
  // Basic Details
  name: string;
  gender: 'male' | 'female';
  dob: string; // Date of Birth (Important for age calc)
  tob?: string; // Time of Birth
  pob?: string; // Place of Birth
  height?: string;
  maritalStatus?: string;
  
  // Location
  city: string;
  state?: string;
  country?: string;

  // Religion & Astro
  religion: string;
  caste: string;
  subCaste?: string;
  gotra?: string;
  manglik?: 'Yes' | 'No' | 'Anshik' | 'Don\'t Know';

  // Professional
  education: string;
  profession: string;
  income: string; // e.g., "12 LPA"
  company?: string;

  // Family Details
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  siblings?: string; // e.g. "1 Brother, 2 Sisters"
  familyType?: 'Nuclear' | 'Joint';

  // Media & Contact
  imageUrl?: string;
  about?: string; // Biodata summary
  contact: string; // Parent's or Candidate's number
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}