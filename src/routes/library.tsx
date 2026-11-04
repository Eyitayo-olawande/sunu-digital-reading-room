import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/elibrary/AppShell";
import { LibraryView } from "@/components/elibrary/LibraryView";
import { mockUsers, type Role } from "@/components/elibrary/mock-data";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Knowledge Library | SUNU eLibrary" },
      { name: "description", content: "Search SUNU Assurances Nigeria policies, procedures, guidelines and training materials by department and topic." },
      { property: "og:title", content: "Knowledge Library | SUNU eLibrary" },
      { property: "og:description", content: "Find policies, procedures, guidelines and learning materials to support your work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const [role, setRole] = useState<Role>("employee");
  return (
    <AppShell user={mockUsers[role]} onRoleChange={setRole} activeLabel="Library">
      <LibraryView canManage={role === "admin"} />
    </AppShell>
  );
}
