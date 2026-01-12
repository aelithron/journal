import { auth } from "@/utils/auth";
import { faHome } from "@fortawesome/free-regular-svg-icons";
import { faList, faPencil, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export async function Header() {
  const session = await auth();
  return (
    <header className="flex justify-between p-3 bg-purple-300/60 sticky top-0 z-10 items-center gap-2 md:px-6">
      <Link className="hover:text-sky-500" href={session ? "/home" : "/"}><FontAwesomeIcon icon={faPencil} size="xl" /></Link>
      <div className="flex gap-2 items-center">
        <Link className="hover:text-sky-500" href={"/home"}><FontAwesomeIcon icon={faHome} /> Home</Link>
        <Link className="hover:text-sky-500" href={"/entries"}><FontAwesomeIcon icon={faList} /> Entries</Link>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {session?.user?.image && <Link href={"/settings"}><img src={session.user.image} alt="User profile picture" width={50} height={50} className="rounded-lg ml-2" /></Link>}
      </div>
    </header>
  );
}
export function ErrorDisplay({ children, message }: { children?: React.ReactNode, message: string }) {
  return (
    <div className="flex flex-col p-2 bg-red-600 rounded-xl">
      <h1 className="text-xl"><FontAwesomeIcon icon={faX} /> Error</h1>
      <p>{message}</p>
      {children}
    </div>
  ) 
}