import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Acme",
  description: "Learn about Acme’s About and how we build modern products.",
};

export default function MissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
