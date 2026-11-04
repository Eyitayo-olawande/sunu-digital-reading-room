import { libraryResources, type LibraryResource } from "./library-data";

export type ViewerKind = "paged" | "slides" | "sheet" | "video" | "unsupported";

export interface DocSection { heading: string; body?: string; checklist?: string[] }
export interface DocPage { sections: DocSection[] }

export interface ViewerDoc {
  resource: LibraryResource;
  subtitle: string;
  version: string;
  kind: ViewerKind;
  requiresAcknowledgement: boolean;
  pages: DocPage[];
  related: LibraryResource[];
}

/** Which viewer each supported format uses. Unknown formats fall back to "unsupported". */
export function viewerKindFor(format: string): ViewerKind {
  switch (format.toUpperCase()) {
    case "PDF": case "DOC": case "DOCX": return "paged";
    case "PPT": case "PPTX": return "slides";
    case "XLS": case "XLSX": return "sheet";
    case "MP4": return "video";
    default: return "unsupported";
  }
}

/** Policies and procedures need a read acknowledgement; other types don't. */
export function needsAcknowledgement(r: LibraryResource) {
  return r.type === "Policy" || r.type === "Procedure" || r.id === "claims-intake";
}

const intakePages: DocPage[] = [
  { sections: [
    { heading: "Purpose", body: "To provide a standard checklist for the receipt, verification and registration of claims to ensure completeness, accuracy and timely processing." },
    { heading: "Applicability", body: "This procedure applies to all claims received across all business lines." },
    { heading: "Claims Intake Checklist", checklist: ["Completed claim notification form", "Valid policy number and client details", "Supporting documents (as applicable)", "Incident details (date, location, description)", "Any additional information required by the claims team"] },
  ] },
  { sections: [{ heading: "Roles and Responsibilities", body: "Claims officers receive and verify notifications. Supervisors review incomplete submissions and approve escalations. The Claims Manager owns this procedure." }] },
  { sections: [{ heading: "Receiving a Claim", body: "Claims may be received at branches, by email or through brokers. Record the date and channel of receipt on the intake register on the same working day." }] },
  { sections: [{ heading: "Verification", body: "Confirm the policy is active and premiums are paid. Check that the loss falls within the period of cover and the insured items match the schedule." }] },
  { sections: [{ heading: "Supporting Documents", body: "Motor: police report, photographs, repair estimate. Property: incident report and proof of ownership. Request missing items within 2 working days." }] },
  { sections: [{ heading: "Registration", body: "Register complete claims on the claims system, assign a claim number and inform the client in writing within 48 hours." }] },
  { sections: [{ heading: "Escalation", body: "Refer suspected fraud indicators to the Claims Fraud Unit. Large losses above the officer's authority limit go to the Claims Manager." }] },
  { sections: [{ heading: "Document Control", body: "Version 2.0. Approved by the Head of Claims. Next review due October 2027." }] },
];

function genericPages(r: LibraryResource, n: number): DocPage[] {
  return Array.from({ length: n }, (_, i) => ({
    sections: [{ heading: i === 0 ? "Overview" : `Section ${i + 1}`, body: `${r.title} — ${i === 0 ? `this document is owned by ${r.owner} and applies to all relevant staff.` : "detailed guidance for this section is shown here in the browser viewer."}` }],
  }));
}

const subtitles: Record<string, string> = { Policy: "Corporate Policy", Procedure: "Operational Procedure", Guideline: "Guideline", Training: "Training Material", Template: "Operational Procedure" };

export function getViewerDoc(id: string): ViewerDoc | null {
  const resource = libraryResources.find((r) => r.id === id);
  if (!resource) return null;
  const kind = viewerKindFor(resource.format);
  const pages = id === "claims-intake" ? intakePages : genericPages(resource, kind === "slides" ? 6 : 4);
  const related = libraryResources
    .filter((r) => r.id !== id && r.status === "Published" && (r.topic === resource.topic || r.department === resource.department))
    .slice(0, 3);
  return {
    resource,
    subtitle: subtitles[resource.type] ?? resource.type,
    version: id === "claims-intake" ? "2.0" : "1.0",
    kind: id === "claims-intake" ? "paged" : kind,
    requiresAcknowledgement: needsAcknowledgement(resource),
    pages,
    related,
  };
}
