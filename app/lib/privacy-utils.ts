/**
 * Privacy utilities for identity masking and data protection.
 */
import { Profile, PrivacyLevel } from '@/types/profile';

/**
 * Masks a full name into initials with ellipsis.
 * e.g. "Prince Kumar" -> "P...K.."
 * e.g. "Rahul" -> "R..."
 */
export const maskName = (name: string): string => {
  if (!name) return 'Anonymous';
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return `${parts[0].charAt(0).toUpperCase()}...`;
  }
  
  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].charAt(0).toUpperCase();
  
  return `${first}...${last}..`;
};

/**
 * Extracts initials from a name for avatar placeholders.
 * e.g. "Prince Kumar" -> "PK"
 */
export const getInitials = (name: string): string => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Determines if a specific field of a profile should be visible to a viewer.
 * @param fieldKey The key of the field to check (e.g., 'fatherName', 'caste')
 * @param profile The profile being viewed
 * @param isRevealed Whether the viewer has an accepted connection with this profile
 */
export const isFieldVisible = (fieldKey: string, profile: Profile, isRevealed: boolean): boolean => {
  // 1. Get user-defined setting or default
  // Default: NAMES are connection-only, everything else is PUBLIC (to allow matching)
  const defaultLevel: PrivacyLevel = fieldKey === 'name' || fieldKey === 'imageUrl' ? 'connection' : 'public';
  const setting: PrivacyLevel = profile.privacySettings?.[fieldKey] || defaultLevel;

  // 2. Resolve Visibility
  if (setting === 'public') return true;
  if (setting === 'connection') return isRevealed;
  return false; // 'private' (Only Me)
};
