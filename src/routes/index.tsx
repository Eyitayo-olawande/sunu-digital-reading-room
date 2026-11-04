import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/elibrary/AppShell";
import { mockUsers, type Role } from "@/components/elibrary/mock-data";
import { AdminStats } from "@/components/elibrary/AdminStats";
import {
  CertificateTeaser, FeaturedResources, LearningJourney, LearningProgressCard,
  NextModuleCard, QuickAccess, RecentNotices, WelcomeBanner,
} from "@/components/elibrary/DashboardWidgets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview | SUNU eLibrary" },
      { name: "description", content: "SUNU Assurances Nigeria knowledge and learning hub: learning paths, library resources and notices." },
      { property: "og:title", content: "Overview | SUNU eLibrary" },
      { property: "og:description", content: "Your learning, library and knowledge hub at SUNU Assurances Nigeria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [role, setRole] = useState<Role>("employee");
  const user = mockUsers[role];
  return (
    <AppShell user={user} onRoleChange={setRole}>
      <div className="mx-auto max-w-[1400px] space-y-6">
        {role === "admin" ? (
          <div>
            <WelcomeBanner name={user.firstName} withStats subtitle="Your learning, library and knowledge hub at SUNU Assurances Nigeria." />
            <AdminStats />
          </div>
        ) : (
          <WelcomeBanner name={user.firstName} />
        )}
        <div className="grid gap-6 xl:grid-cols-2">
          <LearningProgressCard />
          <NextModuleCard />
        </div>
        <LearningJourney />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-6">
            <QuickAccess />
            <FeaturedResources />
          </div>
          <div className="min-w-0 space-y-6">
            <RecentNotices />
            <CertificateTeaser />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
