import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Metadata } from "next";
import { ClientDate, ClientTime } from "../(ui)/clientutils.module";
import { auth } from "@/utils/auth";
import db from "@/utils/db";
import { journalTable } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { CreateEntry } from "./entry.module";
import Link from "next/link";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ErrorDisplay } from "../(ui)/ui.module";

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
      <h2 className="text-xl font-semibold mt-2">Today&apos;s Entries</h2>
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
    return (<ErrorDisplay message="Couldn't connect to the database!" />);
  }
  const entries = allEntries.filter((entry) => entry.createdAt.toDateString() === new Date().toDateString());
  return (
    <div className="flex mt-2">
      {entries.length < 1 && <div className="flex justify-between gap-4 items-center p-2 bg-slate-300 dark:bg-slate-700 rounded-xl">
        <p>You haven&apos;t created any entries today!</p>
        <CreateEntry />
      </div>}
      {entries.length >= 1 && entries.map((entry) => <Link href={`/read/${entry.id}`} key={entry.id} className="flex justify-between items-center p-2 bg-slate-300 dark:bg-slate-700 rounded-lg w-full">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <p className="text-xl font-semibold">{entry.title === "" ? "New Entry" : entry.title}</p>
            <p className="text-slate-500 text-sm"><FontAwesomeIcon icon={faClock} /> <ClientTime date={entry.createdAt} /></p>
          </div>
          <p>{entry.body === "" ? "This entry doesn't have any text yet!" : (entry.body.length < 100 ? entry.body : `${entry.body.slice(0, 100)}...`)}</p>
        </div>
        <FontAwesomeIcon icon={faArrowRight} size="lg" className="hover:text-sky-500" />
      </Link>)}
    </div>
  )
}