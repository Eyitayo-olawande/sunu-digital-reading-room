import intake from "@/assets/res-intake.jpg";
import claims from "@/assets/res-claims.jpg";
import compliance from "@/assets/res-aml.jpg";
import security from "@/assets/res-data.jpg";
import conduct from "@/assets/res-conduct.jpg";
import service from "@/assets/res-service.jpg";

export type ModuleStatus = "Completed" | "In Progress" | "Not Started";
export type LearningTab = "All Learning Paths" | "Recommended (sample)" | "In Progress" | "Completed";
export type LearningSort = "Most Relevant" | "Title A–Z" | "Progress";
export interface LearningModule { title: string; resourceId: string; status: ModuleStatus; stage: "Common" | "Department" | "Role"; due?: string }
export interface LearningPath { id: string; title: string; category: string; duration: string; image: string; recommended: boolean; modules: LearningModule[] }
const module = (title: string, resourceId: string, status: ModuleStatus, stage: LearningModule["stage"]): LearningModule => ({ title, resourceId, status, stage });
export const learningPaths: [LearningPath, ...LearningPath[]] = [
  { id: "claims-officer", title: "Claims Officer Path", category: "Core", duration: "2 hours", image: intake, recommended: true, modules: [
    module("Code of Conduct & Ethics", "code-of-conduct", "Completed", "Common"),
    module("Claims Operations Essentials", "motor-policy", "Completed", "Department"),
    module("Claims Intake Checklist", "claims-intake", "Completed", "Role"),
    { ...module("Motor Claim Registration", "claims-registration", "In Progress", "Role"), due: "11 Jan 2027" },
  ] },
  { id: "claims-operations", title: "Claims Operations Path", category: "Department", duration: "1.5 hours", image: claims, recommended: true, modules: [
    module("Motor Insurance Policy Guide", "motor-policy", "Completed", "Department"), module("Claims Registration Procedure", "claims-registration", "In Progress", "Department"), module("Claims Intake Checklist", "claims-intake", "Not Started", "Department"),
  ] },
  { id: "regulatory-compliance", title: "Regulatory Compliance Path", category: "Common", duration: "2 hours", image: compliance, recommended: false, modules: [
    module("AML/CFT Essentials", "aml-cft", "Completed", "Common"), module("Data Protection at Work", "data-protection", "Completed", "Common"), module("KYC Onboarding", "kyc-training", "Completed", "Common"), module("Code of Conduct", "code-of-conduct", "Completed", "Common"),
  ] },
  { id: "information-security", title: "Information Security Awareness", category: "Common", duration: "45 mins", image: security, recommended: false, modules: [module("Data Protection at Work", "data-protection", "Not Started", "Common"), module("IT Acceptable Use", "it-acceptable-use", "Not Started", "Common")] },
  { id: "conduct-ethics", title: "Code of Conduct & Ethics", category: "Common", duration: "30 mins", image: conduct, recommended: false, modules: [module("Code of Conduct", "code-of-conduct", "Completed", "Common"), module("Customer Service Standards", "service-standards", "Completed", "Common")] },
  { id: "customer-service", title: "Customer Service Excellence", category: "Role", duration: "1 hour", image: service, recommended: false, modules: [module("Customer Service Standards", "service-standards", "Not Started", "Role"), module("Complaints Handling", "complaints-handling", "Not Started", "Role"), module("Code of Conduct", "code-of-conduct", "Not Started", "Role")] },
];
export function progressFor(path: LearningPath) {
  const completed = path.modules.filter(m => m.status === "Completed").length;
  const inProgress = path.modules.filter(m => m.status === "In Progress").length;
  const total = path.modules.length;
  return { completed, inProgress, notStarted: total - completed - inProgress, total, percent: total ? Math.round(completed / total * 100) : 0 };
}
export function statusFor(path: LearningPath): ModuleStatus {
  const p = progressFor(path);
  return p.total > 0 && p.completed === p.total ? "Completed" : p.completed || p.inProgress ? "In Progress" : "Not Started";
}
export function nextLearningModule(path: LearningPath) { return path.modules.find(m => m.status !== "Completed") ?? path.modules[0]; }
export function selectLearningPaths(tab: LearningTab, sort: LearningSort) {
  const result = learningPaths.filter(p => tab === "All Learning Paths" || (tab === "Recommended (sample)" ? p.recommended : statusFor(p) === tab));
  return [...result].sort((a, b) => sort === "Title A–Z" ? a.title.localeCompare(b.title) : sort === "Progress" ? progressFor(b).percent - progressFor(a).percent : Number(b.recommended) - Number(a.recommended));
}
export function journeyFor(path: LearningPath) {
  return (["Common", "Department", "Role"] as const).map(stage => {
    const modules = path.modules.filter(m => m.stage === stage);
    return { stage, state: modules.length && modules.every(m => m.status === "Completed") ? "completed" : modules.some(m => m.status !== "Not Started") ? "current" : "upcoming" };
  });
}