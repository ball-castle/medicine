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

export interface ModuleDetailSectionRecord {
  id: string;
  title: string;
  summary: string;
  body: string;
  anchorConceptIds: string[];
  anchorDiagramIds: string[];
}

export interface ModuleDetailRecord {
  moduleId: string;
  subtitle: string;
  estimatedDuration: string;
  intro: string;
  learningQuestions: string[];
  sections: ModuleDetailSectionRecord[];
  exerciseIdeas: string[];
  nextModuleIds: string[];
}

export interface StoryboardSceneRecord {
  id: string;
  title: string;
  duration: string;
  visualFocus: string;
  narration: string;
  interaction: string;
}

export interface StoryboardRecord {
  id: string;
  diagramId: string;
  title: string;
  targetFeeling: string;
  userGoal: string;
  scenes: StoryboardSceneRecord[];
  interactionBeats: string[];
  assetNotes: string[];
  successCriteria: string[];
}

export interface RoadmapPhaseRecord {
  id: string;
  title: string;
  duration: string;
  goal: string;
  deliverables: string[];
}

export interface PracticeActionRecord {
  id: string;
  label: string;
  shortLabel: string;
  summary: string;
  linkedPrototypeHref: string;
}

export interface PracticeCaseRecord {
  id: string;
  title: string;
  brief: string;
  scenario: string;
  clues: string[];
  correctActionId: string;
  rationale: string;
  comparisons: Record<string, string>;
  nextHref: string;
  nextLabel: string;
}

export interface PracticeSetRecord {
  id: string;
  moduleId: string;
  title: string;
  subtitle: string;
  objective: string;
  warning: string;
  estimatedTime: string;
  actions: PracticeActionRecord[];
  cases: PracticeCaseRecord[];
}
