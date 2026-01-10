"use client";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export function JournalEditor({ id, curTitle, curBody }: { id: number, curTitle: string, curBody: string }) {
  const [title, setTitle] = useState<string>(curTitle);
  const [body, setBody] = useState<string>(curBody);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }
  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <label>Title</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-slate-500 border-slate-700 border-2 rounded-lg" />
      <label>Entry</label>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="bg-slate-500 border-slate-700 border-2 rounded-lg" />
      <button type="submit" className="p-1 bg-purple-500 rounded-lg w-fit hover:text-sky-500"><FontAwesomeIcon icon={faSave} /> Save</button>
    </form>
  )
}