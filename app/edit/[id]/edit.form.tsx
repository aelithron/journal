"use client";
import { APIError, JournalDeleteRes, JournalEditRes } from "@/journal";
import { faSave, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function JournalEditor({ id, curTitle, curBody, curCreatedAt }: { id: number, curTitle: string, curBody: string, curCreatedAt: Date }) {
  const router = useRouter();
  const [title, setTitle] = useState<string>(curTitle);
  const [body, setBody] = useState<string>(curBody);
  const [createdAt, setCreatedAt] = useState<string>(htmlFormatDate(curCreatedAt));
  async function editEntry(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/journal/${id}`, { method: "PATCH", body: JSON.stringify({  }) });
    let body;
    try {
      body = await res.json() as JournalEditRes | APIError;
    } catch {
      alert("Error editing entry!");
    }
  }
  async function deleteEntry() {
    if (!confirm(`Are you sure you want to delete this entry?\nTitle: ${curTitle !== "" ? curTitle : "New Entry"}\nCreated On: ${curCreatedAt.toLocaleString(undefined, { timeStyle: "short", dateStyle: "long" })}`)) return;
    const res = await fetch(`/api/journal/${id}`, { method: "DELETE" });
    let body;
    try {
      body = await res.json() as JournalDeleteRes | APIError;
    } catch {
      alert("Error deleting entry!");
      return;
    }
    if ((body as APIError).error) {
      alert(`Error creating entry: ${(body as APIError).message} (${(body as APIError).error})`);
      return;
    }
    router.push("/home");
  }
  return (
    <form className="flex flex-col gap-2" onSubmit={editEntry}>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <label className="text-lg font-semibold" htmlFor="title">Title:</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="underline text-lg outline-none" placeholder="Enter a title..." />
        </div>
        <input type="datetime-local" value={createdAt} onChange={(e) => setCreatedAt(e.target.value)} />
      </div>
      <label htmlFor="body" className="text-lg font-semibold">Entry</label>
      <textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="bg-slate-500 border-slate-700 border-2 rounded-lg" />
      <div className="flex gap-2 items-center justify-center mt-2">
        <button type="submit" className="p-1 px-2 bg-purple-500 rounded-lg hover:text-sky-500"><FontAwesomeIcon icon={faSave} /> Save</button>
        <button type="button" className="p-1 px-2 rounded-lg bg-red-600 hover:text-sky-500" onClick={deleteEntry}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
      </div>
    </form>
  )
}

function htmlFormatDate(date: Date): string {
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
}