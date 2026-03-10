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
  const phases = await load(path.join("roadmap", "phases.json"));

  const bookIds = new Set(books.map((book) => book.id));
  const conceptIds = new Set(concepts.map((concept) => concept.id));
  const diagramIds = new Set(diagrams.map((diagram) => diagram.id));
  const moduleIds = new Set(modules.map((module) => module.id));

  assert(books.length === 2, "Expected exactly 2 books.");
  assert(concepts.length >= 20, "Expected at least 20 concepts.");
  assert(diagrams.length >= 10, "Expected at least 10 diagrams.");
  assert(modules.length >= 3, "Expected at least 3 modules.");
  assert(phases.length >= 3, "Expected at least 3 roadmap phases.");

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

  console.log(
    `content ok: books=${books.length}, concepts=${concepts.length}, diagrams=${diagrams.length}, modules=${modules.length}, phases=${phases.length}`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
