import { describe, expect, it } from "vitest";
import { assignedSummary, assignmentsFor, nextAssignment, actionFor, moduleProgressFor } from "@/components/elibrary/my-learning-data";
describe("Dedicated assigned learning", () => {
  it("does not mistake overall 75% completion for Motor Claim Registration progress", () => {
    const motor = nextAssignment();
    if (!motor) throw new Error("Missing assigned motor module");
    expect(moduleProgressFor(motor)).toBeNull();
    expect(assignmentsFor("Completed").map(moduleProgressFor)).toEqual([100, 100, 100]);
  });
  it("shows four assigned modules, three complete, one in progress and 75% overall", () => {
    expect(assignedSummary()).toEqual({ total: 4, completed: 3, inProgress: 1, notStarted: 0, percent: 75 });
  });
  it("continues Motor Claim Registration due 11 January 2027", () => {
    expect(nextAssignment()).toMatchObject({ title: "Motor Claim Registration", resourceId: "claims-registration", due: "11 Jan 2027" });
  });
  it("filters only assigned modules without adding catalogue records", () => {
    expect(assignmentsFor("All Assignments")).toHaveLength(4);
    expect(assignmentsFor("Completed")).toHaveLength(3);
    expect(assignmentsFor("In Progress").map(m => m.title)).toEqual(["Motor Claim Registration"]);
    expect(assignmentsFor("Upcoming")).toHaveLength(0);
  });
  it("offers review for completed modules and continue for the active module", () => {
    expect(assignmentsFor("Completed").map(actionFor)).toEqual(["Review", "Review", "Review"]);
    expect(assignmentsFor("In Progress").map(actionFor)).toEqual(["Continue"]);
  });
});