import { ClientTime } from "@/app/(ui)/clientutils.module";
import { auth, signOut } from "@/utils/auth";
import db from "@/utils/db";
import { journalTable } from "@/utils/schema";
import { faClock, faHome } from "@fortawesome/free-regular-svg-icons";
import { faBookOpen, faPencil, faSignOut, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { and, eq } from "drizzle-orm";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
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
    entry = await db.select().from(journalTable).where(and(eq(journalTable.user, session?.user?.email as string), eq(journalTable.id, Number.parseInt((await params).id)))).limit(1);
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
    <main className="flex flex-col p-8 md:p-16 min-h-screen">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-semibold items-center"><FontAwesomeIcon icon={faBookOpen} /> {entry[0].title !== "" ? entry[0].title : "New Entry"}</h1>
          <p className="items-center font-semibold mb-2"><FontAwesomeIcon icon={faClock} /> <ClientTime date={entry[0].createdAt} /></p>
        </div>
        <Link href={`/edit/${(await params).id}`} className="hover:text-sky-500"><FontAwesomeIcon icon={faPencil} size="lg" /></Link>
      </div>
      {entry[0].body !== "" ? <p>{entry[0].body}</p> : <div className="flex flex-col gap-1">
        <p>This entry doesn&apos;t have any text yet!</p>
        <Link href={`/edit/${(await params).id}`} className="bg-violet-500 p-1 px-2 rounded-xl w-fit hover:text-sky-500"><FontAwesomeIcon icon={faPencil} /> Edit</Link>
      </div>}
    </main>
  );
}