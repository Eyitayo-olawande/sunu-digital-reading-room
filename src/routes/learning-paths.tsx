import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/elibrary/AppShell";
import { LearningPathsView } from "@/components/elibrary/LearningPathsView";
import { mockUsers, type Role } from "@/components/elibrary/mock-data";

export const Route = createFileRoute("/learning-paths")({
  head: () => ({ meta: [
    { title: "Learning Paths | SUNU eLibrary" },
    { name: "description", content: "Explore assigned SUNU learning paths, track module progress and continue your Claims Officer learning journey." },
    { property: "og:title", content: "Learning Paths | SUNU eLibrary" },
    { property: "og:description", content: "Your assigned learning paths, progress and next milestones at SUNU Assurances Nigeria." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: LearningPage,
});
function LearningPage() {
  const [role, setRole] = useState<Role>("employee");
  return <AppShell user={mockUsers[role]} onRoleChange={setRole} activeLabel="Learning Paths"><LearningPathsView /></AppShell>;
}