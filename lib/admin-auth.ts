// ── Admin auth helpers ────────────────────────────────────────────────────────
// Uses a simple env-variable password stored in sessionStorage.
// The /admin routes check this on mount and redirect to /admin if not set.

const SESSION_KEY = "alp_admin_v1"

export function adminLogin(password: string): boolean {
  const correct = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
  if (!correct || password !== correct) return false
  sessionStorage.setItem(SESSION_KEY, "1")
  return true
}

export function adminLogout(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return sessionStorage.getItem(SESSION_KEY) === "1"
}
