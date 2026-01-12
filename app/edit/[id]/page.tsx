import { auth, signOut } from "@/utils/auth"
import db from "@/utils/db"
import { journalTable } from "@/utils/schema"
import { faArrowLeft, faHome, faPencil, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { and, eq } from "drizzle-orm"
import Link from "next/link";
import { JournalEditor } from "./edit.form";
import { ErrorDisplay } from "@/app/(ui)/ui.module";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Entry" }
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) return (
    <main className="flex flex-col min-h-screen p-8 md:p-16">
      <ErrorDisplay message="Your email isn't valid, please sign out and back in!">
        <form action={async () => {
          "use server";
          await signOut();
        }}>
          <button type="submit" className="bg-slate-500 p-1 px-2 rounded-xl hover:text-sky-500 mt-2"><FontAwesomeIcon icon={faSignOut} /> Sign Out</button>
        </form>
      </ErrorDisplay>
    </main>
  );
  let entry;
  try {
    entry = await db.select().from(journalTable).where(and(eq(journalTable.user, session?.user?.email), eq(journalTable.id, Number.parseInt((await params).id)))).limit(1);
  } catch {
    return (
      <main className="flex flex-col min-h-screen p-8 md:p-16">
        <ErrorDisplay message="Couldn't connect to the database!" />
      </main>
    );
  }
  if (!entry || entry.length < 1) return (
    <main className="flex flex-col min-h-screen p-8 md:p-16">
      <ErrorDisplay message="This entry doesn't exist!">
        <Link href={"/home"} className="bg-slate-500 p-1 px-2 rounded-xl hover:text-sky-500 w-fit mt-2"><FontAwesomeIcon icon={faHome} /> Go Home</Link>
      </ErrorDisplay>
    </main>
  );
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-16">
      <Link href={`/read/${(await params).id}`} className="rounded-xl bg-slate-500 p-1 w-fit mb-2 sticky top-0"><FontAwesomeIcon icon={faArrowLeft} /></Link>
      <h1 className="text-2xl font-semibold mb-2"><FontAwesomeIcon icon={faPencil} /> Edit Entry</h1>
      <JournalEditor id={entry[0].id} curTitle={entry[0].title} curBody={entry[0].body} curCreatedAt={entry[0].createdAt} />
    </main>
  )
}