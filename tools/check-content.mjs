import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const contentRoot = path.join(root, "content");

async function load(relativePath) {
  const absolutePath = path.join(contentRoot, relativePath);
  const raw = await readFile(absolutePath, "utf8");
  return JSON.parse(raw);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const books = await load(path.join("books", "books.json"));
  const concepts = await load(path.join("concepts", "concepts.json"));
  const diagrams = await load(path.join("diagrams", "diagrams.json"));
  const modules = await load(path.join("modules", "modules.json"));
  const moduleDetails = await load(path.join("modules", "module-details.json"));
  const phases = await load(path.join("roadmap", "phases.json"));
  const storyboards = await load(path.join("storyboards", "storyboards.json"));

  const bookIds = new Set(books.map((book) => book.id));
  const conceptIds = new Set(concepts.map((concept) => concept.id));
  const diagramIds = new Set(diagrams.map((diagram) => diagram.id));
  const moduleIds = new Set(modules.map((module) => module.id));

  assert(books.length === 2, "Expected exactly 2 books.");
  assert(concepts.length >= 20, "Expected at least 20 concepts.");
  assert(diagrams.length >= 10, "Expected at least 10 diagrams.");
  assert(modules.length >= 3, "Expected at least 3 modules.");
  assert(moduleDetails.length >= 2, "Expected at least 2 module details.");
  assert(phases.length >= 3, "Expected at least 3 roadmap phases.");
  assert(storyboards.length >= 3, "Expected at least 3 storyboards.");

  for (const concept of concepts) {
    assert(moduleIds.has(concept.moduleId), `Unknown module on concept ${concept.id}`);
    for (const bookId of concept.bookIds) {
      assert(bookIds.has(bookId), `Unknown book on concept ${concept.id}: ${bookId}`);
    }
    for (const relatedId of concept.relatedConceptIds) {
      assert(conceptIds.has(relatedId), `Unknown related concept ${relatedId} on ${concept.id}`);
    }
  }

  for (const diagram of diagrams) {
    assert(moduleIds.has(diagram.moduleId), `Unknown module on diagram ${diagram.id}`);
    for (const bookId of diagram.bookIds) {
      assert(bookIds.has(bookId), `Unknown book on diagram ${diagram.id}: ${bookId}`);
    }
  }

  for (const module of modules) {
    for (const conceptId of module.conceptIds) {
      assert(conceptIds.has(conceptId), `Unknown concept ${conceptId} in module ${module.id}`);
    }
    for (const diagramId of module.diagramIds) {
      assert(diagramIds.has(diagramId), `Unknown diagram ${diagramId} in module ${module.id}`);
    }
  }

  for (const moduleDetail of moduleDetails) {
    assert(moduleIds.has(moduleDetail.moduleId), `Unknown module detail ${moduleDetail.moduleId}`);
    for (const section of moduleDetail.sections) {
      for (const conceptId of section.anchorConceptIds) {
        assert(conceptIds.has(conceptId), `Unknown concept ${conceptId} in module detail ${moduleDetail.moduleId}`);
      }
      for (const diagramId of section.anchorDiagramIds) {
        assert(diagramIds.has(diagramId), `Unknown diagram ${diagramId} in module detail ${moduleDetail.moduleId}`);
      }
    }
    for (const nextModuleId of moduleDetail.nextModuleIds) {
      assert(moduleIds.has(nextModuleId), `Unknown next module ${nextModuleId} in module detail ${moduleDetail.moduleId}`);
    }
  }

  for (const storyboard of storyboards) {
    assert(diagramIds.has(storyboard.diagramId), `Unknown diagram ${storyboard.diagramId} in storyboard ${storyboard.id}`);
    assert(storyboard.scenes.length >= 3, `Storyboard ${storyboard.id} must have at least 3 scenes.`);
  }

  console.log(
    `content ok: books=${books.length}, concepts=${concepts.length}, diagrams=${diagrams.length}, modules=${modules.length}, moduleDetails=${moduleDetails.length}, phases=${phases.length}, storyboards=${storyboards.length}`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
