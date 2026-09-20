import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { readPage } from "@/lib/page-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const doc = await readPage();
  return {
    title: doc.settings.seoTitle || doc.settings.artistName,
    description: doc.settings.seoDescription,
    openGraph: {
      title: doc.settings.seoTitle || doc.settings.artistName,
      description: doc.settings.seoDescription,
      type: "profile",
    },
  };
}

export default async function LandingPage() {
  const doc = await readPage();
  return <PageShell initialDoc={doc} />;
}
