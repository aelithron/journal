import { auth } from "@/utils/auth";
import { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";

export type JournalCreateReq = { body: string }
export const POST = auth(async function POST(req: NextAuthRequest): Promise<NextResponse> {
  if (!req.auth) return NextResponse.json({ error: "unauthorized", message: "Not logged in, please log in to continue." }, { status: 401 });
  if (!req.auth.user?.email) return NextResponse.json({ error: "invalid_profile", message: "You don't have an email in your profile, try logging back in." }, { status: 400 });
  let body;
  try {
    body = await req.json() as JournalCreateReq;
  } catch {
    return NextResponse.json({ error: "invalid_body", message: "Body was invalid or malformed. Please send valid JSON!" }, { status: 400 });
  }
  if (!body.body || body.body.trim().length < 1) return NextResponse.json({ error: "missing_body", message: "Your request" }, { status: 400 });
});