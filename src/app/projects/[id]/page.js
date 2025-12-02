import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import ProjectDetails from "@/components/ProjectDetails";

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectPage({ params }) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return <ProjectDetails project={project} />;
}
