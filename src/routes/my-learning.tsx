import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/elibrary/AppShell";
import { MyLearningView } from "@/components/elibrary/MyLearningView";
import { mockUsers, type Role } from "@/components/elibrary/mock-data";

export const Route = createFileRoute("/my-learning")({
  head: () => ({ meta: [
    { title: "My Learning | SUNU eLibrary" },
    { name: "description", content: "Your assigned SUNU learning modules, personal progress and next required steps." },
    { property: "og:title", content: "My Learning | SUNU eLibrary" },
    { property: "og:description", content: "Continue your Claims Officer learning, review completed modules and track deadlines." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MyLearningPage,
});
function MyLearningPage() {
  const [role, setRole] = useState<Role>("employee");
  return <AppShell user={mockUsers[role]} onRoleChange={setRole} activeLabel="My Learning"><MyLearningView /></AppShell>;
}