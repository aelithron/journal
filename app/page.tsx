import { auth, signIn } from "@/utils/auth";
import { faHome, faPencil, faSignIn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-16">
      <h1 className="text-3xl font-semibold"><FontAwesomeIcon icon={faPencil} /> Journal</h1>
      <p>A social journaling app based around the calendar!</p>
      {session ? <Link href={"/home"} className="py-1 px-2 bg-violet-500 rounded-lg mt-2 w-fit"><FontAwesomeIcon icon={faHome} /> Go Home</Link> :
      <form action={async () => {
        "use server";
        await signIn(undefined, { redirectTo: "/home" });
      }}>
        <button type="submit" className="py-1 px-2 bg-violet-500 rounded-lg mt-2"><FontAwesomeIcon icon={faSignIn} /> Sign In</button>
      </form>}
    </main>
  );
}