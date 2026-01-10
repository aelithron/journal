export type APIError = { error: string, message: string }

// /api/journal
export type JournalCreateReq = { title?: string, body?: string, createdAt?: string }
export type JournalCreateRes = { id: number }
export type JournalEditReq = { title?: string, body?: string, createdAt?: string }
export type JournalEditRes = { success: boolean }
export type JournalDeleteRes = { success: boolean }