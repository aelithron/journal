"use client";

export function ClientDate({ date }: { date: Date }) {
  return <>{date.toLocaleDateString(undefined, { dateStyle: "full" })}</>
}