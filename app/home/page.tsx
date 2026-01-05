import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Metadata } from "next";
import { ClientDate } from "../(ui)/clientutils.module";
import { auth } from "@/utils/auth";
import db from "@/utils/db";
import { journalTable } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { CreateEntry } from "./entry.module";

export const metadata: Metadata = { title: "Home" }
export const dynamic = "force-dynamic";
export default async function Page() {
  const session = await auth();
  const allEntries = await db.select().from(journalTable).where(eq(journalTable.user, session?.user?.email as string));
  const entries = allEntries.filter((entry) => entry.createdAt.toDateString() === new Date().toDateString());
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
      <div className="flex mt-2">
        {entries.length < 1 && <div className="flex justify-between gap-4 items-center p-2 bg-slate-300 dark:bg-slate-700 rounded-xl">
          <p>You haven&apos;t created any entries today!</p>
          <CreateEntry />
        </div>}
        {entries.length >= 1 && entries.map((entry) => <div key={entry.id}>
          
        </div>)}
      </div>
    </main>
  );
}