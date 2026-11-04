import { describe, it, expect } from "vitest";
import { learningPaths, progressFor, journeyFor, nextLearningModule, selectLearningPaths } from "@/components/elibrary/learning-data";

describe("Learning Paths prototype records", () => {
  const officer = learningPaths[0];
  it("Claims Officer is three of four modules complete, or 75%", () => {
    expect(progressFor(officer)).toEqual({ completed: 3, inProgress: 1, notStarted: 0, total: 4, percent: 75 });
  });
  it("Common and Department are complete and Role is current", () => {
    expect(journeyFor(officer)).toEqual([{ stage: "Common", state: "completed" }, { stage: "Department", state: "completed" }, { stage: "Role", state: "current" }]);
  });
  it("remaining assigned module is due 11 January 2027", () => {
    expect(nextLearningModule(officer)?.due).toBe("11 Jan 2027");
    expect(nextLearningModule(officer)?.resourceId).toBe("claims-registration");
  });
  it("tab counts reflect the six sample paths", () => {
    expect(selectLearningPaths("All Learning Paths", "Most Relevant")).toHaveLength(6);
    expect(selectLearningPaths("Recommended (sample)", "Most Relevant")).toHaveLength(2);
    expect(selectLearningPaths("In Progress", "Most Relevant")).toHaveLength(2);
    expect(selectLearningPaths("Completed", "Most Relevant")).toHaveLength(2);
  });
  it("progress follows module records rather than a fixed percentage", () => {
    expect(progressFor({ ...officer, modules: officer.modules.map(m => ({ ...m, status: "Completed" })) }).percent).toBe(100);
  });
  it("sort orders the selected records", () => {
    expect(selectLearningPaths("All Learning Paths", "Progress").map(p => progressFor(p).percent)).toEqual([100, 100, 75, 33, 0, 0]);
  });
});