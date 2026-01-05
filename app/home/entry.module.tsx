"use client";
import { APIError, JournalCreateReq, JournalCreateRes } from "@/journal";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export function CreateEntry() {
  const router = useRouter();
  async function createEntry() {
    const res = await fetch("/api/journal", { method: "POST", body: JSON.stringify({ createdAt: new Date().toISOString() } as JournalCreateReq) });
    let body;
    try {
      body = await res.json() as JournalCreateRes | APIError;
    } catch {
      alert("Error creating entry!");
      return;
    }
    if ((body as APIError).error) {
      alert(`Error creating entry: ${(body as APIError).message} (${(body as APIError).error})`);
      return;
    }
    router.push(`/edit/${(body as JournalCreateRes).id}`);
  }
  return (
    <button onClick={createEntry} className="bg-violet-500 p-1 px-2 rounded-lg hover:text-sky-500"><FontAwesomeIcon icon={faPlus} /> New Entry</button>
  )
}