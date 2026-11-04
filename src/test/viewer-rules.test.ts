import { describe, expect, it } from "vitest";
import { getViewerDoc, viewerKindFor } from "@/components/elibrary/viewer-data";

describe("document viewer rules", () => {
  it("picks a viewer per format", () => {
    expect(viewerKindFor("PDF")).toBe("paged");
    expect(viewerKindFor("PPT")).toBe("slides");
    expect(viewerKindFor("XLS")).toBe("sheet");
    expect(viewerKindFor("MP4")).toBe("video");
    expect(viewerKindFor("ZIP")).toBe("unsupported");
  });
  it("Claims Intake Checklist has 8 pages and needs acknowledgement", () => {
    const d = getViewerDoc("claims-intake")!;
    expect(d.pages).toHaveLength(8);
    expect(d.requiresAcknowledgement).toBe(true);
  });
  it("training does not need acknowledgement", () => {
    expect(getViewerDoc("health-safety")!.requiresAcknowledgement).toBe(false);
  });
  it("related resources are published only", () => {
    expect(getViewerDoc("claims-intake")!.related.every((r) => r.status === "Published")).toBe(true);
  });
});
