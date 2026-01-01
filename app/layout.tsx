import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import "./globals.css";
import { Header } from "./(ui)/ui.module";

config.autoAddCss = false;
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
        <Header />
        {children}
      </body>
    </html>
  );
}
