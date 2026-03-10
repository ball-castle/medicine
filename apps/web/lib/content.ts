import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

import type {
  BookRecord,
  ConceptRecord,
  DiagramRecord,
  ModuleRecord,
  RoadmapPhaseRecord,
} from "@medicine/content-schema";

const contentRoot = path.resolve(process.cwd(), "../../content");

async function loadJson<T>(...segments: string[]): Promise<T> {
  const filePath = path.join(contentRoot, ...segments);
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export const getSiteContent = cache(async () => {
  const [books, concepts, diagrams, modules, phases] = await Promise.all([
    loadJson<BookRecord[]>("books", "books.json"),
    loadJson<ConceptRecord[]>("concepts", "concepts.json"),
    loadJson<DiagramRecord[]>("diagrams", "diagrams.json"),
    loadJson<ModuleRecord[]>("modules", "modules.json"),
    loadJson<RoadmapPhaseRecord[]>("roadmap", "phases.json"),
  ]);

  return { books, concepts, diagrams, modules, phases };
});
