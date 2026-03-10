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
  const caseStudies = await load(path.join("cases", "case-studies.json"));
  const learningPaths = await load(path.join("paths", "learning-paths.json"));

  const bookIds = new Set(books.map((book) => book.id));
  const conceptIds = new Set(concepts.map((concept) => concept.id));
  const diagramIds = new Set(diagrams.map((diagram) => diagram.id));
  const moduleIds = new Set(modules.map((module) => module.id));

  assert(books.length === 2, "Expected exactly 2 books.");
  assert(concepts.length >= 20, "Expected at least 20 concepts.");
  assert(diagrams.length >= 10, "Expected at least 10 diagrams.");
  assert(modules.length >= 3, "Expected at least 3 modules.");
  assert(moduleDetails.length === modules.length, "Expected every module to have a module detail.");
  assert(phases.length >= 3, "Expected at least 3 roadmap phases.");
  assert(storyboards.length >= 3, "Expected at least 3 storyboards.");
  assert(practiceSets.length >= 1, "Expected at least 1 practice set.");
  assert(caseStudies.length >= 1, "Expected at least 1 case study.");
  assert(learningPaths.length >= 1, "Expected at least 1 learning path.");

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
    if (diagram.prototypeHref) {
      assert(diagram.prototypeHref.startsWith("/"), `Diagram ${diagram.id} must use an app route in prototypeHref.`);
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

  for (const module of modules) {
    assert(
      moduleDetails.some((moduleDetail) => moduleDetail.moduleId === module.id),
      `Missing module detail for ${module.id}`,
    );
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
      assert(["foundation", "intermediate", "advanced"].includes(caseItem.difficulty), `Case ${caseItem.id} in ${practiceSet.id} must use a valid difficulty.`);
      assert(caseItem.mistakeTag, `Case ${caseItem.id} in ${practiceSet.id} must have a mistakeTag.`);
      assert(caseItem.mistakeReason, `Case ${caseItem.id} in ${practiceSet.id} must have a mistakeReason.`);
      assert(caseItem.reviewPrompt, `Case ${caseItem.id} in ${practiceSet.id} must have a reviewPrompt.`);

      for (const conceptId of caseItem.relatedConceptIds) {
        assert(conceptIds.has(conceptId), `Unknown related concept ${conceptId} in case ${caseItem.id}`);
      }
      for (const diagramId of caseItem.relatedDiagramIds) {
        assert(diagramIds.has(diagramId), `Unknown related diagram ${diagramId} in case ${caseItem.id}`);
      }

      for (const actionId of actionIds) {
        assert(caseItem.comparisons[actionId], `Missing comparison for ${actionId} in case ${caseItem.id}`);
      }
    }
  }

  const totalPracticeCases = practiceSets.reduce((sum, practiceSet) => sum + practiceSet.cases.length, 0);
  assert(totalPracticeCases >= 10, "Expected at least 10 practice cases.");

  for (const caseStudy of caseStudies) {
    assert(moduleIds.has(caseStudy.moduleId), `Unknown module ${caseStudy.moduleId} in case study ${caseStudy.id}`);
    assert(caseStudy.stages.length >= 3, `Case study ${caseStudy.id} must have at least 3 stages.`);
    for (const bookId of caseStudy.bookIds) {
      assert(bookIds.has(bookId), `Unknown book ${bookId} in case study ${caseStudy.id}`);
    }
    for (const conceptId of caseStudy.focusConceptIds) {
      assert(conceptIds.has(conceptId), `Unknown focus concept ${conceptId} in case study ${caseStudy.id}`);
    }
    for (const diagramId of caseStudy.focusDiagramIds) {
      assert(diagramIds.has(diagramId), `Unknown focus diagram ${diagramId} in case study ${caseStudy.id}`);
    }

    for (const stage of caseStudy.stages) {
      assert(stage.clues.length >= 3, `Stage ${stage.id} in ${caseStudy.id} must have at least 3 clues.`);
      assert(stage.reviewHref.startsWith("/"), `Stage ${stage.id} in ${caseStudy.id} must use an app route in reviewHref.`);
      assert(stage.options.length >= 2, `Stage ${stage.id} in ${caseStudy.id} must have at least 2 options.`);
      const optionIds = new Set(stage.options.map((option) => option.id));
      assert(optionIds.has(stage.correctOptionId), `Unknown correct option ${stage.correctOptionId} in stage ${stage.id}`);
      for (const option of stage.options) {
        if (option.href) {
          assert(option.href.startsWith("/"), `Option ${option.id} in stage ${stage.id} must use an app route.`);
        }
      }
      for (const conceptId of stage.relatedConceptIds) {
        assert(conceptIds.has(conceptId), `Unknown related concept ${conceptId} in stage ${stage.id}`);
      }
      for (const diagramId of stage.relatedDiagramIds) {
        assert(diagramIds.has(diagramId), `Unknown related diagram ${diagramId} in stage ${stage.id}`);
      }
      for (const optionId of optionIds) {
        assert(stage.optionFeedbacks[optionId], `Missing option feedback ${optionId} in stage ${stage.id}`);
      }
    }
  }

  for (const learningPath of learningPaths) {
    assert(learningPath.steps.length >= 5, `Learning path ${learningPath.id} must have at least 5 steps.`);
    assert(learningPath.reviewChecklist.length >= 3, `Learning path ${learningPath.id} must have at least 3 review checkpoints.`);
    assert(
      learningPath.stepIds.length === learningPath.steps.length,
      `Learning path ${learningPath.id} stepIds must align with steps length.`,
    );

    const stepIds = new Set();

    for (const step of learningPath.steps) {
      assert(!stepIds.has(step.id), `Duplicate step ${step.id} in learning path ${learningPath.id}`);
      stepIds.add(step.id);
      assert(moduleIds.has(step.moduleId), `Unknown module ${step.moduleId} in learning path ${learningPath.id}`);
      assert(step.href.startsWith("/"), `Learning path step ${step.id} in ${learningPath.id} must use an app route.`);
      assert(
        ["module", "prototype", "practice", "case"].includes(step.kind),
        `Learning path step ${step.id} in ${learningPath.id} must use a valid kind.`,
      );
    }

    for (const stepId of learningPath.stepIds) {
      assert(stepIds.has(stepId), `Unknown stepId ${stepId} in learning path ${learningPath.id}`);
    }
  }

  console.log(
    `content ok: books=${books.length}, concepts=${concepts.length}, diagrams=${diagrams.length}, modules=${modules.length}, moduleDetails=${moduleDetails.length}, phases=${phases.length}, storyboards=${storyboards.length}, practiceSets=${practiceSets.length}, caseStudies=${caseStudies.length}, learningPaths=${learningPaths.length}`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
