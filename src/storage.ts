import type { Progress } from "./types";

const STORAGE_KEY = "typescript-train-progress";

const initialProgress: Progress = {
  completedLessonIds: [],
};

function isProgress(value: unknown): value is Progress {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as { completedLessonIds?: unknown };

  return (
    Array.isArray(candidate.completedLessonIds) &&
    candidate.completedLessonIds.every((id) => typeof id === "string")
  );
}

export function loadProgress(): Progress {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw === null) return initialProgress;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isProgress(parsed) ? parsed : initialProgress;
  } catch {
    return initialProgress;
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
