import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

import type {
  BookRecord,
  CaseStudyRecord,
  ConceptRecord,
  DiagramRecord,
  ModuleDetailRecord,
  ModuleRecord,
  PracticeSetRecord,
  RoadmapPhaseRecord,
  LearningPathRecord,
  StoryboardRecord,
} from "@medicine/content-schema";

const contentRoot = path.resolve(process.cwd(), "../../content");

async function loadJson<T>(...segments: string[]): Promise<T> {
  const filePath = path.join(contentRoot, ...segments);
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export const getSiteContent = cache(async () => {
  const [books, concepts, diagrams, modules, moduleDetails, phases, storyboards, practiceSets, caseStudies, learningPaths] = await Promise.all([
    loadJson<BookRecord[]>("books", "books.json"),
    loadJson<ConceptRecord[]>("concepts", "concepts.json"),
    loadJson<DiagramRecord[]>("diagrams", "diagrams.json"),
    loadJson<ModuleRecord[]>("modules", "modules.json"),
    loadJson<ModuleDetailRecord[]>("modules", "module-details.json"),
    loadJson<RoadmapPhaseRecord[]>("roadmap", "phases.json"),
    loadJson<StoryboardRecord[]>("storyboards", "storyboards.json"),
    loadJson<PracticeSetRecord[]>("practices", "practice-sets.json"),
    loadJson<CaseStudyRecord[]>("cases", "case-studies.json"),
    loadJson<LearningPathRecord[]>("paths", "learning-paths.json"),
  ]);

  return { books, concepts, diagrams, modules, moduleDetails, phases, storyboards, practiceSets, caseStudies, learningPaths };
});
