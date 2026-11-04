import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/elibrary/AppShell";
import { DocumentViewer } from "@/components/elibrary/DocumentViewer";
import { getViewerDoc } from "@/components/elibrary/viewer-data";
import { mockUsers, type Role } from "@/components/elibrary/mock-data";

export const Route = createFileRoute("/library_/$id")({
  loader: ({ params }) => {
    const doc = getViewerDoc(params.id);
    if (!doc) throw notFound();
    return { id: params.id, title: doc.resource.title, owner: doc.resource.owner };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} | SUNU eLibrary` : "Document unavailable | SUNU eLibrary";
    const description = loaderData ? `Read ${loaderData.title} from ${loaderData.owner} in the SUNU eLibrary document viewer.` : "This document could not be found.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  notFoundComponent: () => <div className="p-10 text-center">Document not found.</div>,
  component: ViewerPage,
});

function ViewerPage() {
  const { id } = Route.useLoaderData();
  const [role, setRole] = useState<Role>("employee");
  const doc = getViewerDoc(id)!;
  return (
    <AppShell user={mockUsers[role]} onRoleChange={setRole} activeLabel="Library">
      <DocumentViewer key={id} doc={doc} canManage={role === "admin"} />
    </AppShell>
  );
}
