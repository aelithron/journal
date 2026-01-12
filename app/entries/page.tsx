import { auth, signOut } from "@/utils/auth";
import db from "@/utils/db";
import { journalTable } from "@/utils/schema";
import { faArrowRight, faList, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { ErrorDisplay } from "../(ui)/ui.module";
import { CreateEntry } from "../home/entry.module";
import { ClientTime } from "../(ui)/clientutils.module";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";

export const metadata: Metadata = { title: "Entries" }
export const dynamic = "force-dynamic";
export default async function Page() {
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
  let entries;
  try {
    entries = (await db.select().from(journalTable).where(eq(journalTable.user, session.user.email))).sort((entry1, entry2) => entry2.createdAt.getTime() - entry1.createdAt.getTime());
  } catch {
    return (
      <main className="flex flex-col min-h-screen p-8 md:p-16">
        <ErrorDisplay message="Couldn't connect to the database!" />
      </main>
    );
  }
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-16 gap-2">
      <h1 className="text-3xl font-semibold mb-2"><FontAwesomeIcon icon={faList} /> Your Entries</h1>
      {entries.length < 1 && <div className="flex justify-between gap-4 items-center p-2 bg-slate-300 dark:bg-slate-700 rounded-xl">
        <p>You haven&apos;t created any entries yet!</p>
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
    </main>
  );
}