import { notFound } from "next/navigation";
import { reels, getReel } from "@/data/reels";
import ReelDetails from "@/components/ReelDetails";

export async function generateStaticParams() {
  // Only reel slugs are reachable. Legacy /images/projectN cards in
  // data/projects.js are intentionally NOT enumerated here so the AI-
  // generated routes 404 without deleting the data file (keeps revert
  // a single `git checkout` away).
  return reels.map((r) => ({ id: r.slug }));
}

export default async function ProjectPage({ params }) {
  const { id } = await params;
  const reel = getReel(id);
  if (!reel) notFound();
  return <ReelDetails reel={reel} />;
}
