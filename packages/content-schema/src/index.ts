export type BookId = "yuan-yun-dong" | "huo-shen-men";

export type VisualType =
  | "3d-flow"
  | "animated-diagram"
  | "case-timeline"
  | "comparison"
  | "decision-map"
  | "diagnostic-surface"
  | "motion-graphic";

export interface BookRecord {
  id: BookId;
  title: string;
  shortTitle: string;
  author: string;
  focus: string;
  audience: string;
  sourcePdf: string;
  sourceOcr: string;
}

export interface ConceptRecord {
  id: string;
  title: string;
  bookIds: BookId[];
  moduleId: string;
  chapter: string;
  tier: "foundation" | "intermediate" | "advanced";
  summary: string;
  plainExplanation: string;
  whyItMatters: string;
  keywords: string[];
  visualType: VisualType;
  relatedConceptIds: string[];
}

export interface DiagramRecord {
  id: string;
  title: string;
  moduleId: string;
  bookIds: BookId[];
  chapter: string;
  purpose: string;
  interactionIdea: string;
  visualPriority: "high" | "medium";
  productionFormat: "svg-motion" | "rive" | "three-scene" | "case-board";
  sourceImageCandidates: string[];
}

export interface ModuleRecord {
  id: string;
  title: string;
  premise: string;
  targetOutcome: string;
  visualFocus: string;
  conceptIds: string[];
  diagramIds: string[];
}

export interface RoadmapPhaseRecord {
  id: string;
  title: string;
  duration: string;
  goal: string;
  deliverables: string[];
}
