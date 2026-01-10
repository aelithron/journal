import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Metadata } from "next";
import { ClientDate } from "../(ui)/clientutils.module";
import { auth } from "@/utils/auth";
import db from "@/utils/db";
import { journalTable } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { CreateEntry } from "./entry.module";
import Link from "next/link";
import { faArrowRight, faX } from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = { title: "Home" }
export const dynamic = "force-dynamic";
export default async function Page() {
  const session = await auth();
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-16">
      <div className="flex justify-between gap-2 items-center">
        <div>
          <h1 className="text-3xl font-semibold">Hi, {session?.user?.name}!</h1>
          <h2 className="text-lg text-slate-500"><FontAwesomeIcon icon={faCalendar} /> <ClientDate date={new Date()} /></h2>
        </div>
        <CreateEntry />
      </div>
      <h2 className="text-xl font-semibold mt-2">Your Entries</h2>
      <EntryDisplay />
    </main>
  );
}
async function EntryDisplay() {
  const session = await auth();
  let allEntries;
  try {
    allEntries = await db.select().from(journalTable).where(eq(journalTable.user, session?.user?.email as string));
  } catch {
    return (
      <div className="flex flex-col p-2 bg-red-600 rounded-xl">
        <h1 className="text-xl"><FontAwesomeIcon icon={faX} /> Error</h1>
        <p>Couldn&apos;t connect to the database!</p>
      </div>
    );
  }
  const entries = allEntries.filter((entry) => entry.createdAt.toDateString() === new Date().toDateString());
  return (
    <div className="flex mt-2">
      {entries.length < 1 && <div className="flex justify-between gap-4 items-center p-2 bg-slate-300 dark:bg-slate-700 rounded-xl">
        <p>You haven&apos;t created any entries today!</p>
        <CreateEntry />
      </div>}
      {entries.length >= 1 && entries.map((entry) => <Link href={`/edit/${entry.id}`} key={entry.id} className="flex justify-between items-center p-2 bg-slate-300 dark:bg-slate-700 rounded-lg w-full">
        <div className="flex flex-col">
          <p className="text-lg">{entry.title === "" ? "New Entry" : entry.title}</p>
          <p>{entry.body === "" ? "This entry doesn't have any text yet!" : (entry.body.length < 100 ? entry.body : `${entry.body.slice(0, 100)}...`)}</p>
        </div>
        <FontAwesomeIcon icon={faArrowRight} size="lg" className="hover:text-sky-500" />
      </Link>)}
    </div>
  )
}