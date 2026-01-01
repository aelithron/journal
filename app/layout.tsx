import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({ weight: "500" });
export const metadata: Metadata = {
  title: {
    template: "%s ✏ Journal",
    default: "✏ Journal"
  },
  description: "A social journaling app based around the calendar.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${quicksand.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
