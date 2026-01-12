"use client";
import { APIError, APISuccess, JournalEditReq } from "@/journal";
import { faCloud, faSave, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function JournalEditor({ id, origTitle, origBody, origCreatedAt }: { id: number, origTitle: string, origBody: string, origCreatedAt: Date }) {
  const router = useRouter();
  const [saved, setSaved] = useState<boolean>(true);
  const [title, setTitle] = useState<string>(origTitle);
  const [body, setBody] = useState<string>(origBody);
  const [createdAt, setCreatedAt] = useState<string>(htmlFormatDate(origCreatedAt));
  // state management mess for autosave
  // no wayyy is this spaghetti code :3
  const [curTitle, setCurTitle] = useState<string>(origTitle);
  const [curBody, setCurBody] = useState<string>(origBody);
  const [curCreatedAt, setCurCreatedAt] = useState<string>(htmlFormatDate(origCreatedAt));
  async function editEntry(e: React.FormEvent) {
    e.preventDefault();
    const editBody: JournalEditReq = {};
    if (curTitle !== title) editBody.title = title;
    if (curBody !== body) editBody.body = body;
    if (curCreatedAt !== createdAt) editBody.createdAt = createdAt;
    const res = await fetch(`/api/journal/${id}`, { method: "PATCH", body: JSON.stringify(editBody) });
    let resBody;
    try {
      resBody = await res.json() as APISuccess | APIError;
    } catch {
      alert("Error editing entry!");
      return;
    }
    if ((resBody as APIError).error) {
      alert(`Error editing entry: ${(resBody as APIError).message} (${(resBody as APIError).error})`);
      return;
    }
    setSaved(true);
    setCurTitle(title);
    setCurBody(body);
    setCurCreatedAt(createdAt);
  }
  async function deleteEntry() {
    if (!confirm(`Are you sure you want to delete this entry?\nTitle: ${curTitle !== "" ? curTitle : "New Entry"}\nCreated On: ${new Date(curCreatedAt).toLocaleString(undefined, { timeStyle: "short", dateStyle: "long" })}`)) return;
    const res = await fetch(`/api/journal/${id}`, { method: "DELETE" });
    let resBody;
    try {
      resBody = await res.json() as APISuccess | APIError;
    } catch {
      alert("Error deleting entry!");
      return;
    }
    if ((resBody as APIError).error) {
      alert(`Error deleting entry: ${(resBody as APIError).message} (${(resBody as APIError).error})`);
      return;
    }
    router.push("/home");
  }
  useEffect(() => {
    const timeout = setTimeout(() => {
      const editBody: JournalEditReq = {};
      if (curTitle !== title) editBody.title = title;
      if (curBody !== body) editBody.body = body;
      if (curCreatedAt !== createdAt) editBody.createdAt = createdAt;
      fetch(`/api/journal/${id}`, { method: "PATCH", body: JSON.stringify(editBody) })
        .then((res) => {
          try {
            return res.json() as Promise<APISuccess | APIError>;
          } catch {
            alert("Error editing entry!");
            return null;
          }
        })
        .then((resBody) => {
          if ((resBody as APIError).error) {
            alert(`Error creating entry: ${(resBody as APIError).message} (${(resBody as APIError).error})`);
            return;
          }
          setSaved(true);
          setCurTitle(title);
          setCurBody(body);
          setCurCreatedAt(createdAt);
        });
    }, 1500);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, title, body, createdAt]);
  function handleSet(text: string, setter: Dispatch<SetStateAction<string>>) {
    setter(text);
    setSaved(false);
  }
  return (
    <form className="flex flex-col gap-2" onSubmit={editEntry}>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <label className="text-lg font-semibold" htmlFor="title">Title:</label>
          <input id="title" type="text" value={title} onChange={(e) => handleSet(e.target.value, setTitle)} className="underline text-lg outline-none" placeholder="Enter a title..." />
        </div>
        <input type="datetime-local" value={createdAt} onChange={(e) => handleSet(e.target.value, setCreatedAt)} />
      </div>
      <label htmlFor="body" className="text-lg font-semibold">Entry</label>
      <textarea id="body" value={body} onChange={(e) => handleSet(e.target.value, setBody)} rows={7} className="bg-slate-500 border-slate-700 border-2 rounded-lg p-1" />
      <div className="flex gap-2 items-center justify-center mt-2">
        <FontAwesomeIcon icon={saved ? faCloud : faSync} className="bg-slate-500 p-2 rounded-2xl" />
        <button type="submit" className="p-1 px-2 bg-violet-500 rounded-lg hover:text-sky-500"><FontAwesomeIcon icon={faSave} /> Save</button>
        <button type="button" className="p-1 px-2 rounded-lg bg-red-600 hover:text-sky-500" onClick={deleteEntry}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
      </div>
    </form>
  )
}
function htmlFormatDate(date: Date): string {
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
}