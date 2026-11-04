import { libraryResources, departments } from "./library-data";
import { learningPaths } from "./learning-data";
import { notices, type Role } from "./mock-data";

// Catalogue fixtures are not employee assignments or authoritative staff records.
export function adminSummary() {
  return {
    activeUsers: null,
    resources: libraryResources.length,
    publishedResources: libraryResources.filter(r => r.status === "Published").length,
    draftResources: libraryResources.filter(r => r.status === "Draft").length,
    reviewResources: libraryResources.filter(r => r.status === "Under review").length,
    learningPaths: learningPaths.length,
    activeAssignments: null,
    organisationProgress: null,
    departments: departments.map(name => ({ name, completion: null })),
    activity: [],
    notices: [],
    sampleNotices: notices,
  };
}
export function canPreviewAdmin(role: Role) { return role === "admin"; }