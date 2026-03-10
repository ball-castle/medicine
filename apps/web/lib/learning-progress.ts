export type StoredPracticeSetProgress = {
  practiceSetId: string;
  moduleId: string;
  title: string;
  totalCases: number;
  answers: Record<string, string>;
  revealedCaseIds: string[];
  correctCaseIds: string[];
  wrongCaseIds: string[];
  continueHref: string;
  lastUpdatedAt: string;
};

export type StoredCaseStudyProgress = {
  caseStudyId: string;
  moduleId: string;
  title: string;
  totalStages: number;
  answers: Record<string, string>;
  revealedStageIds: string[];
  correctStageIds: string[];
  wrongStageIds: string[];
  continueHref: string;
  lastUpdatedAt: string;
};

export type LearningProgressStore = {
  practiceSets: Record<string, StoredPracticeSetProgress>;
  caseStudies: Record<string, StoredCaseStudyProgress>;
};

const STORAGE_KEY = "medicine-learning-progress-v1";

function emptyStore(): LearningProgressStore {
  return { practiceSets: {}, caseStudies: {} };
}

export function readLearningProgress(): LearningProgressStore {
  if (typeof window === "undefined") {
    return emptyStore();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyStore();
    }

    const parsed = JSON.parse(raw) as LearningProgressStore;
    if (!parsed?.practiceSets) {
      return emptyStore();
    }

    const normalizedPracticeSets = Object.fromEntries(
      Object.entries(parsed.practiceSets).map(([practiceSetId, item]) => [
        practiceSetId,
        {
          ...item,
          wrongCaseIds: item.wrongCaseIds ?? [],
        },
      ]),
    );

    const normalizedCaseStudies = Object.fromEntries(
      Object.entries(parsed.caseStudies ?? {}).map(([caseStudyId, item]) => [
        caseStudyId,
        {
          ...item,
          wrongStageIds: item.wrongStageIds ?? [],
        },
      ]),
    );

    return { practiceSets: normalizedPracticeSets, caseStudies: normalizedCaseStudies };
  } catch {
    return emptyStore();
  }
}

export function writeLearningProgress(store: LearningProgressStore) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function savePracticeSetProgress(progress: StoredPracticeSetProgress) {
  const store = readLearningProgress();
  store.practiceSets[progress.practiceSetId] = progress;
  writeLearningProgress(store);
}

export function saveCaseStudyProgress(progress: StoredCaseStudyProgress) {
  const store = readLearningProgress();
  store.caseStudies[progress.caseStudyId] = progress;
  writeLearningProgress(store);
}

export function clearLearningProgress() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
