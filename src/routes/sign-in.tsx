import { createFileRoute } from "@tanstack/react-router";
import { SignInView } from "@/components/elibrary/SignInView";

export const Route = createFileRoute("/sign-in")({
  head: () => ({ meta: [
    { title: "Sign In | SUNU eLibrary" },
    { name: "description", content: "SUNU Assurances Nigeria eLibrary sign-in visual prototype for organisational knowledge and structured learning." },
    { property: "og:title", content: "Sign In | SUNU eLibrary" },
    { property: "og:description", content: "Learn, grow and perform with SUNU eLibrary resources and learning paths." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SignInView,
});