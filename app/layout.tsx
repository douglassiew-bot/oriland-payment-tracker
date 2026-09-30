import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { getViewer } from "@/lib/data/workspace";

export const metadata: Metadata = {
  title: "Oriland Payment Tracker",
  description: "Shared payment and available balance tracker for the Oriland finance team.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await getViewer();
  return (
    <html lang="en">
      <body><AppShell viewer={{ email: viewer.email, workspaceName: viewer.workspace?.name ?? null }}>{children}</AppShell></body>
    </html>
  );
}
