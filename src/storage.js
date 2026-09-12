const STORAGE_KEY = "typescript-train-progress";
const initialProgress = {
    completedLessonIds: [],
};
function isProgress(value) {
    if (typeof value !== "object" || value === null)
        return false;
    const candidate = value;
    return (Array.isArray(candidate.completedLessonIds) &&
        candidate.completedLessonIds.every((id) => typeof id === "string"));
}
export function loadProgress() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null)
        return initialProgress;
    try {
        const parsed = JSON.parse(raw);
        return isProgress(parsed) ? parsed : initialProgress;
    }
    catch {
        return initialProgress;
    }
}
export function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
