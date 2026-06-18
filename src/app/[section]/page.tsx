import { SECTIONS } from "@/lib/constants";
import { SectionContent } from "./section-content";

export function generateStaticParams() {
  return Object.keys(SECTIONS).map((section) => ({
    section,
  }));
}

export default function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  // In static export, we only get valid section IDs from generateStaticParams
  // So we can safely read params synchronously via React 19 use() pattern
  // But for simplicity, we just pass it down
  return <SectionContentWrapper params={params} />;
}

import { use } from "react";

function SectionContentWrapper({ params }: { params: Promise<{ section: string }> }) {
  const { section } = use(params);
  return <SectionContent sectionId={section} />;
}
