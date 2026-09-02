import { ComponentType } from "react";
import CoveragePreservation from "@/components/writing/posts/CoveragePreservation";

/**
 * Registry of custom React article bodies, keyed by post slug. Posts listed
 * here render their component (which can interleave charts and figures); posts
 * without an entry fall back to Markdown `content` from writing.ts.
 */
export const customBodies: Record<string, ComponentType> = {
  "coverage-preservation-rlvr": CoveragePreservation,
};
