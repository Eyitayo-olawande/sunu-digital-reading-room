import motor from "@/assets/res-motor.jpg";
import claims from "@/assets/res-claims.jpg";
import aml from "@/assets/res-aml.jpg";
import conduct from "@/assets/res-conduct.jpg";

export type Role = "employee" | "admin";
export interface MockUser { name: string; firstName: string; department: string; role: Role }

export const mockUsers: Record<Role, MockUser> = {
  employee: { name: "Funke Adeyemi", firstName: "Funke", department: "Claims Department", role: "employee" },
  admin: { name: "Funke Adeyemi", firstName: "Funke", department: "Claims Department", role: "admin" },
};

export const learning = { path: "Claims Officer Path", percent: 75, completed: 3, total: 4 };

export type StageState = "completed" | "current" | "upcoming";
export const journey: { label: string; state: StageState; note: string }[] = [
  { label: "Common", state: "completed", note: "Completed" },
  { label: "Department", state: "completed", note: "Completed" },
  { label: "Role", state: "current", note: "In progress" },
  { label: "Certificate", state: "upcoming", note: "Coming soon" },
];

export const nextModule = { title: "Motor claim registration", path: "Claims Officer Path", module: "Module 4 of 4", due: "11 Jan 2027" };

export const resources = [
  { title: "Motor Insurance Policy Guide", category: "Policy", image: motor },
  { title: "Claims Registration Procedure", category: "Procedure", image: claims },
  { title: "AML/CFT Essentials for All Staff", category: "Compliance", image: aml },
  { title: "Code of Conduct", category: "HR", image: conduct },
];

export const notices = [
  { title: "Updated motor claims workflow takes effect", date: "3 Nov 2026" },
  { title: "Q4 compliance training window now open", date: "28 Oct 2026" },
  { title: "Library maintenance this Saturday, 8–10 AM", date: "24 Oct 2026" },
];
