import { auth, signOut } from "@/utils/auth"
import db from "@/utils/db"
import { journalTable } from "@/utils/schema"
import { faHome, faPencil, faSignOut, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { and, eq } from "drizzle-orm"
import Link from "next/link";
import { JournalEditor } from "./edit.form";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) return (
    <main className="flex flex-col min-h-screen p-8 md:p-16">
      <div className="flex flex-col p-2 bg-red-600 rounded-xl">
        <h1 className="text-xl"><FontAwesomeIcon icon={faX} /> Error</h1>
        <p>Your email isn&apos;t valid, please sign out and back in!</p>
        <form action={async () => {
          "use server";
          await signOut();
        }}>
          <button type="submit" className="bg-slate-500 p-1 px-2 rounded-xl hover:text-sky-500 mt-2"><FontAwesomeIcon icon={faSignOut} /> Sign Out</button>
        </form>
      </div>
    </main>
  );
  let entry;
  try {
    entry = await db.select().from(journalTable).where(and(eq(journalTable.user, session?.user?.email), eq(journalTable.id, Number.parseInt((await params).id)))).limit(1);
  } catch {
    return (
      <main className="flex flex-col min-h-screen p-8 md:p-16">
        <div className="flex flex-col p-2 bg-red-600 rounded-xl">
          <h1 className="text-xl"><FontAwesomeIcon icon={faX} /> Error</h1>
          <p>Couldn&apos;t connect to the database!</p>
        </div>
      </main>
    )
  }
  if (!entry || entry.length < 1) return (
    <main className="flex flex-col min-h-screen p-8 md:p-16">
      <div className="flex flex-col p-2 bg-red-600 rounded-xl">
        <h1 className="text-xl"><FontAwesomeIcon icon={faX} /> Error</h1>
        <p>This entry doesn&apos;t exist!</p>
        <Link href={"/home"} className="bg-slate-500 p-1 px-2 rounded-xl hover:text-sky-500 w-fit mt-2"><FontAwesomeIcon icon={faHome} /> Go Home</Link>
      </div>
    </main>
  );
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-16">
      <h1 className="text-2xl font-semibold mb-2"><FontAwesomeIcon icon={faPencil} /> Edit Entry</h1>
      <JournalEditor id={entry[0].id} curTitle={entry[0].title} curBody={entry[0].body} curCreatedAt={entry[0].createdAt} />
    </main>
  )
}