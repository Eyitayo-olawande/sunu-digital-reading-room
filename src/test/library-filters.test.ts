import { describe, expect, it } from "vitest";
import { filterResources, libraryResources } from "@/components/elibrary/library-data";

const base = { query: "", department: "", topic: "", types: [], statuses: ["Published" as const] };

describe("library filters", () => {
  it("employees never see draft or under-review resources", () => {
    const r = filterResources(libraryResources, { ...base, statuses: [] }, false);
    expect(r.every((x) => x.status === "Published")).toBe(true);
  });
  it("managers can see drafts when the Draft status is selected", () => {
    const r = filterResources(libraryResources, { ...base, statuses: ["Draft"] }, true);
    expect(r.length).toBeGreaterThan(0);
  });
  it("search matches department", () => {
    const r = filterResources(libraryResources, { ...base, query: "compliance" }, false);
    expect(r.every((x) => [x.title, x.department, x.topic].join(" ").toLowerCase().includes("compliance"))).toBe(true);
    expect(r.length).toBeGreaterThan(0);
  });
  it("no match returns empty", () => {
    expect(filterResources(libraryResources, { ...base, query: "zzzz" }, false)).toHaveLength(0);
  });
});
