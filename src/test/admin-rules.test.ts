import { describe, expect, it } from "vitest";
import { adminSummary, canPreviewAdmin } from "@/components/elibrary/admin-data";

describe("Administrator record boundaries", () => {
  it("derives catalogue counts from existing sample records", () => {
    expect(adminSummary().resources).toBe(15);
    expect(adminSummary().publishedResources).toBe(13);
    expect(adminSummary().learningPaths).toBe(6);
  });
  it("does not turn single-employee modules into organisation totals", () => {
    expect(adminSummary().activeUsers).toBeNull();
    expect(adminSummary().activeAssignments).toBeNull();
    expect(adminSummary().organisationProgress).toBeNull();
  });
  it("does not invent department completion percentages", () => {
    expect(adminSummary().departments).toHaveLength(6);
    expect(adminSummary().departments.every(d => d.completion === null)).toBe(true);
  });
  it("does not invent events or current system notices", () => {
    expect(adminSummary().activity).toEqual([]);
    expect(adminSummary().notices).toEqual([]);
  });
  it("keeps the admin screen out of employee preview", () => {
    expect(canPreviewAdmin("employee")).toBe(false);
    expect(canPreviewAdmin("admin")).toBe(true);
  });
});