import motor from "@/assets/res-motor.jpg";
import claims from "@/assets/res-claims.jpg";
import aml from "@/assets/res-aml.jpg";
import conduct from "@/assets/res-conduct.jpg";
import intake from "@/assets/res-intake.jpg";
import service from "@/assets/res-service.jpg";
import data from "@/assets/res-data.jpg";
import safety from "@/assets/res-safety.jpg";

export type DocType = "Policy" | "Procedure" | "Guideline" | "Training" | "Template";
export type DocStatus = "Published" | "Draft" | "Under review";

export interface LibraryResource {
  id: string;
  title: string;
  type: DocType;
  badge?: string;
  department: string;
  topic: string;
  size: string;
  format: string;
  status: DocStatus;
  updated: string;
  owner: string;
  image: string;
}

export const topics = [
  { name: "Claims", count: 24, icon: "umbrella" },
  { name: "Compliance", count: 18, icon: "shield" },
  { name: "Customer Service", count: 12, icon: "users" },
  { name: "Human Resources", count: 9, icon: "people" },
  { name: "Information Technology", count: 7, icon: "laptop" },
  { name: "Operations", count: 11, icon: "file" },
] as const;

export const departments = ["Claims", "Compliance", "Service", "Human Resources", "Operations", "IT"];
export const docTypes: DocType[] = ["Policy", "Procedure", "Guideline", "Training", "Template"];
export const statuses: DocStatus[] = ["Published", "Draft", "Under review"];

export const libraryResources: LibraryResource[] = [
  { id: "motor-policy", title: "Motor Insurance Policy Guide", type: "Policy", department: "Claims", topic: "Claims", size: "2.6 MB", format: "PDF", status: "Published", updated: "12 Oct 2026", owner: "Claims Department", image: motor },
  { id: "claims-registration", title: "Claims Registration Procedure", type: "Procedure", department: "Claims", topic: "Claims", size: "1.2 MB", format: "DOC", status: "Published", updated: "3 Nov 2026", owner: "Claims Department", image: claims },
  { id: "aml-cft", title: "AML/CFT Essentials for All Staff", type: "Training", badge: "Compliance", department: "Compliance", topic: "Compliance", size: "2.4 MB", format: "PDF", status: "Published", updated: "28 Oct 2026", owner: "Compliance Unit", image: aml },
  { id: "code-of-conduct", title: "Code of Conduct", type: "Policy", badge: "HR", department: "Human Resources", topic: "Human Resources", size: "1.8 MB", format: "PDF", status: "Published", updated: "1 Sep 2026", owner: "Human Resources", image: conduct },
  { id: "claims-intake", title: "Claims Intake Checklist", type: "Template", badge: "Procedure", department: "Claims", topic: "Claims", size: "680 KB", format: "XLS", status: "Published", updated: "19 Oct 2026", owner: "Claims Department", image: intake },
  { id: "service-standards", title: "Customer Service Standards", type: "Guideline", department: "Service", topic: "Customer Service", size: "4.8 MB", format: "PPT", status: "Published", updated: "7 Oct 2026", owner: "Customer Service", image: service },
  { id: "data-protection", title: "Data Protection at Work", type: "Policy", department: "Compliance", topic: "Information Technology", size: "1.9 MB", format: "PDF", status: "Published", updated: "22 Sep 2026", owner: "IT & Compliance", image: data },
  { id: "health-safety", title: "Health and Safety Awareness", type: "Training", department: "Operations", topic: "Operations", size: "10.4 MB", format: "MP4", status: "Published", updated: "15 Aug 2026", owner: "Operations", image: safety },
  { id: "complaints-handling", title: "Complaints Handling Procedure", type: "Procedure", department: "Service", topic: "Customer Service", size: "940 KB", format: "PDF", status: "Published", updated: "30 Oct 2026", owner: "Customer Service", image: service },
  { id: "it-acceptable-use", title: "IT Acceptable Use Guideline", type: "Guideline", department: "IT", topic: "Information Technology", size: "1.1 MB", format: "PDF", status: "Published", updated: "2 Oct 2026", owner: "Information Technology", image: data },
  { id: "leave-procedure", title: "Leave Request Procedure", type: "Procedure", department: "Human Resources", topic: "Human Resources", size: "520 KB", format: "DOC", status: "Published", updated: "11 Sep 2026", owner: "Human Resources", image: conduct },
  { id: "kyc-training", title: "KYC Onboarding Training", type: "Training", department: "Compliance", topic: "Compliance", size: "6.2 MB", format: "MP4", status: "Published", updated: "25 Oct 2026", owner: "Compliance Unit", image: aml },
  { id: "branch-ops", title: "Branch Operations Policy", type: "Policy", department: "Operations", topic: "Operations", size: "2.1 MB", format: "PDF", status: "Published", updated: "5 Oct 2026", owner: "Operations", image: claims },
  { id: "fraud-review", title: "Claims Fraud Indicators (Revised)", type: "Guideline", department: "Claims", topic: "Claims", size: "1.4 MB", format: "PDF", status: "Under review", updated: "2 Nov 2026", owner: "Claims Department", image: motor },
  { id: "onboarding-draft", title: "New Staff Onboarding Pack", type: "Training", department: "Human Resources", topic: "Human Resources", size: "3.3 MB", format: "PDF", status: "Draft", updated: "1 Nov 2026", owner: "Human Resources", image: intake },
];

export interface LibraryFilters {
  query: string;
  department: string;
  topic: string;
  types: DocType[];
  statuses: DocStatus[];
}

/** Pure filter used by the Library page. Employees only ever see Published items. */
export function filterResources(items: LibraryResource[], f: LibraryFilters, canManage: boolean) {
  const q = f.query.trim().toLowerCase();
  return items.filter((r) => {
    if (!canManage && r.status !== "Published") return false;
    if (canManage && f.statuses.length && !f.statuses.includes(r.status)) return false;
    if (f.department && r.department !== f.department) return false;
    if (f.topic && r.topic !== f.topic) return false;
    if (f.types.length && !f.types.includes(r.type)) return false;
    if (q && ![r.title, r.department, r.topic, r.type].some((v) => v.toLowerCase().includes(q))) return false;
    return true;
  });
}
