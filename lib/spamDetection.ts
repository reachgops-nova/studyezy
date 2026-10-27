import "server-only";

// Shared between the register action (reject at signup) and the admin
// bulk-cleanup action (find existing spam accounts). Deliberately
// conservative - matches only content a real kid's name would never
// contain, to keep the false-positive rate near zero for a destructive
// bulk-delete action.
export const SPAM_NAME_PATTERN = /https?:\/\/|www\.|\.(com|ru|net|xyz|top)\b|bit\.ly/i;

export function isSpamDisplayName(name: string): boolean {
  return SPAM_NAME_PATTERN.test(name);
}
