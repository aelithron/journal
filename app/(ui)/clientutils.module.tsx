"use client";

export function ClientDate({ date }: { date: Date }) {
  return (<>{date.toLocaleDateString(undefined, { dateStyle: "full" })}</>);
}
export function ClientTime({ date }: { date: Date }) {
  return (<>{date.toLocaleString(undefined, { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</>);
}