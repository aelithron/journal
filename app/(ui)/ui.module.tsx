import { auth } from "@/utils/auth";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export async function Header() {
  const session = await auth();
  return (
    <header className="flex justify-between p-3 bg-purple-300/60 sticky top-0 z-10 items-center">
      <Link className="hover:text-sky-500" href={session ? "/home" : "/"}><FontAwesomeIcon icon={faPencil} size="xl" /></Link>
    </header>
  );
}