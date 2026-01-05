import { auth } from "@/utils/auth";
import db from "@/utils/db";
import { journalTable } from "@/utils/schema";
import { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";

export type JournalCreateReq = { title: string, body: string, createdAt?: string }
export const POST = auth(async function POST(req: NextAuthRequest): Promise<NextResponse> {
  if (!req.auth) return NextResponse.json({ error: "unauthorized", message: "Not logged in, please log in to continue." }, { status: 401 });
  if (!req.auth.user?.email) return NextResponse.json({ error: "invalid_profile", message: "You don't have an email in your profile, try logging back in." }, { status: 400 });
  let body;
  try {
    body = await req.json() as JournalCreateReq;
  } catch {
    return NextResponse.json({ error: "invalid_body", message: "Request body was invalid or malformed. Please send valid JSON!" }, { status: 400 });
  }
  if (!body.title || body.title.trim().length < 1) return NextResponse.json({ error: "missing_title", message: "Your request's 'title' attribute was missing or invalid." }, { status: 400 });
  if (!body.body || body.body.trim().length < 1) body.body = "";
  if (!body.createdAt || body.createdAt.trim().length < 1) body.createdAt = new Date().toISOString();
  if (isNaN(new Date(body.createdAt).getTime())) return NextResponse.json({ error: "invalid_createdat", message: "Your request's 'createdAt' attribute was invalid. Please send a valid date string!" }, { status: 400 });
  try {
    await db.insert(journalTable).values({ user: req.auth.user.email, title: body.title, body: body.body, createdAt: new Date(body.createdAt!) })
  } catch {

  }
  return NextResponse.json({ success: true });
});