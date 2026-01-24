import { User as FirebaseUser } from 'firebase/auth'

export interface AppUser extends FirebaseUser {
  role?: 'super-admin' | 'group-admin' | 'member'
  groupName?: string
  groupId?: string
  slug?: string;
  isApproved?: boolean
}
