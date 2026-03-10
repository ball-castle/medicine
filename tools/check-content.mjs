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
  const practiceSets = await load(path.join("practices", "practice-sets.json"));

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
  assert(practiceSets.length >= 1, "Expected at least 1 practice set.");

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

  for (const practiceSet of practiceSets) {
    assert(moduleIds.has(practiceSet.moduleId), `Unknown module ${practiceSet.moduleId} in practice set ${practiceSet.id}`);
    assert(practiceSet.actions.length >= 3, `Practice set ${practiceSet.id} must have at least 3 actions.`);
    assert(practiceSet.cases.length >= 3, `Practice set ${practiceSet.id} must have at least 3 cases.`);

    const actionIds = new Set(practiceSet.actions.map((action) => action.id));

    for (const action of practiceSet.actions) {
      assert(action.linkedPrototypeHref.startsWith("/"), `Practice action ${action.id} in ${practiceSet.id} must use an app route.`);
    }

    for (const caseItem of practiceSet.cases) {
      assert(actionIds.has(caseItem.correctActionId), `Unknown correct action ${caseItem.correctActionId} in case ${caseItem.id}`);
      assert(caseItem.clues.length >= 3, `Case ${caseItem.id} in ${practiceSet.id} must have at least 3 clues.`);
      assert(caseItem.nextHref.startsWith("/"), `Case ${caseItem.id} in ${practiceSet.id} must use an app route.`);

      for (const actionId of actionIds) {
        assert(caseItem.comparisons[actionId], `Missing comparison for ${actionId} in case ${caseItem.id}`);
      }
    }
  }

  const totalPracticeCases = practiceSets.reduce((sum, practiceSet) => sum + practiceSet.cases.length, 0);
  assert(totalPracticeCases >= 6, "Expected at least 6 practice cases.");

  console.log(
    `content ok: books=${books.length}, concepts=${concepts.length}, diagrams=${diagrams.length}, modules=${modules.length}, moduleDetails=${moduleDetails.length}, phases=${phases.length}, storyboards=${storyboards.length}, practiceSets=${practiceSets.length}`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
