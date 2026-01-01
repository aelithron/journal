import { faCalendar } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Metadata } from "next"
import Link from "next/link"
import { ClientDate } from "../(ui)/clientutils.module"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

export const metadata: Metadata = { title: "Home" }
export default function Page() {
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-16">
      <div className="flex justify-between gap-2 items-center">
        <div>
          <h1 className="text-3xl font-semibold">Hi!</h1>
          <h2 className="text-lg text-slate-500"><FontAwesomeIcon icon={faCalendar} /> <ClientDate date={new Date()} /></h2>
        </div>
        <Link href={"/create"} className="bg-violet-500 p-1 px-2 rounded-lg hover:text-sky-500"><FontAwesomeIcon icon={faPlus} /> New Entry</Link>
      </div>
    </main>
  )
}