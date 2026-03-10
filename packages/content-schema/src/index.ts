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
  prototypeHref?: string;
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

export type PracticeDifficulty = "foundation" | "intermediate" | "advanced";

export interface PracticeCaseRecord {
  id: string;
  title: string;
  brief: string;
  scenario: string;
  clues: string[];
  difficulty: PracticeDifficulty;
  correctActionId: string;
  rationale: string;
  mistakeTag: string;
  mistakeReason: string;
  reviewPrompt: string;
  relatedConceptIds: string[];
  relatedDiagramIds: string[];
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

export interface CaseStudyOptionRecord {
  id: string;
  label: string;
  summary: string;
  href?: string;
}

export interface CaseStudyStageRecord {
  id: string;
  title: string;
  stateSummary: string;
  question: string;
  clues: string[];
  options: CaseStudyOptionRecord[];
  correctOptionId: string;
  rationale: string;
  takeaway: string;
  reviewPrompt: string;
  reviewHref: string;
  reviewLabel: string;
  relatedConceptIds: string[];
  relatedDiagramIds: string[];
  optionFeedbacks: Record<string, string>;
}

export interface CaseStudyRecord {
  id: string;
  moduleId: string;
  bookIds: BookId[];
  title: string;
  subtitle: string;
  summary: string;
  targetSkill: string;
  estimatedTime: string;
  focusConceptIds: string[];
  focusDiagramIds: string[];
  stages: CaseStudyStageRecord[];
}

export type LearningPathStepKind = "module" | "prototype" | "practice" | "case";

export interface LearningPathStepRecord {
  id: string;
  kind: LearningPathStepKind;
  moduleId: string;
  title: string;
  summary: string;
  goal: string;
  estimatedTime: string;
  href: string;
  buttonLabel: string;
  completionHint: string;
}

export interface LearningPathRecord {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  targetOutcome: string;
  estimatedTime: string;
  stepIds: string[];
  steps: LearningPathStepRecord[];
  reviewChecklist: string[];
  completionMessage: string;
}
