import { APIError, APISuccess, JournalEditReq } from "@/journal";
import { auth } from "@/utils/auth";
import db from "@/utils/db";
import { journalTable } from "@/utils/schema";
import { and, eq } from "drizzle-orm";
import { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";

export const PATCH = auth(async function PATCH(req: NextAuthRequest, { params }: RouteContext<'/api/journal/[id]'>): Promise<NextResponse<APISuccess | APIError>> {
  if (!req.auth) return NextResponse.json({ error: "unauthorized", message: "Not logged in, please log in to continue." }, { status: 401 });
  if (!req.auth.user?.email) return NextResponse.json({ error: "invalid_profile", message: "You don't have an email in your profile, try logging back in." }, { status: 400 });
  let body;
  try {
    body = await req.json() as JournalEditReq;
  } catch {
    return NextResponse.json({ error: "invalid_body", message: "Request body was invalid or malformed. Please send valid JSON!" }, { status: 400 });
  }
  if (!(await params).id || isNaN(Number.parseInt((await params).id))) return NextResponse.json({ error: "missing_id", message: "Your request's post ID was missing or invalid. Please check your request's URL!" }, { status: 400 });
  const updatedData: { title?: string, body?: string, createdAt?: Date } = {};
  if (body.title && body.title.trim().length >= 1) updatedData.title = body.title;
  if (body.body && body.body.trim().length >= 1) updatedData.body = body.body;
  if (body.createdAt && body.createdAt.trim().length >= 1) updatedData.createdAt = new Date(body.createdAt);
  if (body.createdAt && isNaN(new Date(body.createdAt).getTime())) return NextResponse.json({ error: "invalid_createdat", message: "Your request's 'createdAt' attribute was invalid. Please send a valid date string!" }, { status: 400 });
  try {
    const existCheck = await db.select().from(journalTable).where(and(eq(journalTable.id, Number.parseInt((await params).id)), eq(journalTable.user, req.auth.user.email)));
    if (existCheck.length < 1) return NextResponse.json({ error: "not_found", message: "The post you are looking for doesn't exist!" }, { status: 404 });
    await db.update(journalTable).set(updatedData).where(and(eq(journalTable.id, Number.parseInt((await params).id)), eq(journalTable.user, req.auth.user.email)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "database_error", message: "Error connecting to the database! Please check your request structure and try again." }, { status: 500 })
  }
});
export const DELETE = auth(async function DELETE(req: NextAuthRequest, { params }: RouteContext<'/api/journal/[id]'>): Promise<NextResponse<APISuccess | APIError>> {
  if (!req.auth) return NextResponse.json({ error: "unauthorized", message: "Not logged in, please log in to continue." }, { status: 401 });
  if (!req.auth.user?.email) return NextResponse.json({ error: "invalid_profile", message: "You don't have an email in your profile, try logging back in." }, { status: 400 });
  if (!(await params).id || isNaN(Number.parseInt((await params).id))) return NextResponse.json({ error: "missing_id", message: "Your request's post ID was missing or invalid. Please check your request's URL!" }, { status: 400 });
  try {
    const existCheck = await db.select().from(journalTable).where(and(eq(journalTable.id, Number.parseInt((await params).id)), eq(journalTable.user, req.auth.user.email)));
    if (existCheck.length < 1) return NextResponse.json({ error: "not_found", message: "The post you are looking for doesn't exist!" }, { status: 404 });
    await db.delete(journalTable).where(and(eq(journalTable.id, Number.parseInt((await params).id)), eq(journalTable.user, req.auth.user.email)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "database_error", message: "Error connecting to the database! Please check your request structure and try again." }, { status: 500 })
  }
});