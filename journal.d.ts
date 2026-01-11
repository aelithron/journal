export type APIError = { error: string, message: string }
export type APISuccess = { success: boolean } // generic success thing so i don't have to repeat myself :3

// /api/journal
export type JournalEditReq = { title?: string, body?: string, createdAt?: string }
export type JournalCreateReq = JournalEditReq;
export type JournalCreateRes = { id: number }