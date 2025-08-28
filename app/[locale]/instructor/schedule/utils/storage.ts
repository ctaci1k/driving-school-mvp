// LocalStorage wrapper z wersjonowaniem i bezpiecznym parse/stringify

const STORAGE_VERSION = 1

type StoredEnvelope<T> = {
  v: number
  data: T
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback

    const parsed = JSON.parse(raw) as StoredEnvelope<T> | T
    // Obsługa starych zapisów (bez koperty)
    if (parsed && typeof parsed === 'object' && 'v' in (parsed as any) && 'data' in (parsed as any)) {
      const env = parsed as StoredEnvelope<T>
      // Tu można dodać migracje po numerze wersji
      return env.data
    }
    // Backward-compat
    return parsed as T
  } catch {
    return fallback
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return
  try {
    const envelope: StoredEnvelope<T> = { v: STORAGE_VERSION, data }
    window.localStorage.setItem(key, JSON.stringify(envelope))
  } catch {
    // ciche odrzucenie — np. quota exceeded lub tryb prywatny
  }
}
