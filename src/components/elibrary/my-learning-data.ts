import { learningPaths, nextLearningModule, progressFor, type LearningModule } from "./learning-data";

export const assignedPath = learningPaths[0];
export type AssignmentTab = "All Assignments" | "In Progress" | "Completed" | "Upcoming";
export const assignmentTabs: AssignmentTab[] = ["All Assignments", "In Progress", "Completed", "Upcoming"];
export function assignedSummary() { return progressFor(assignedPath); }
export function nextAssignment() { return nextLearningModule(assignedPath); }
export function assignmentsFor(tab: AssignmentTab): LearningModule[] {
  return assignedPath.modules.filter(m => tab === "All Assignments" || m.status === (tab === "Upcoming" ? "Not Started" : tab));
}
export function actionFor(m: LearningModule) { return m.status === "Completed" ? "Review" : m.status === "In Progress" ? "Continue" : "Start"; }
export function moduleProgressFor(m: LearningModule): number | null {
  return m.status === "Completed" ? 100 : m.status === "Not Started" ? 0 : null;
}