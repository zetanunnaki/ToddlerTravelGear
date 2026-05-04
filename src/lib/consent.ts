const COOKIE_NAME = "cookie_consent";
const MAX_AGE = 365 * 24 * 60 * 60;

export type ConsentStatus = "accepted" | "declined" | null;

export function getConsent(): ConsentStatus {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`)
  );
  if (!match) return null;
  const value = match[1];
  if (value === "accepted" || value === "declined") return value;
  return null;
}

export function setConsent(status: "accepted" | "declined") {
  document.cookie = `${COOKIE_NAME}=${status}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}
