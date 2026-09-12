import "./style.css";
import { webAppChapter } from "./data/web-app-chapter";
import { render } from "./render";
import { loadProgress, saveProgress } from "./storage";
import type { Progress } from "./types";

let progress: Progress = loadProgress();
let selectedLessonId: string | null = null;

function updateScreen(): void {
  render({
    lessons: webAppChapter,
    progress,
    selectedLessonId,
    onSelectLesson: (lessonId) => {
      selectedLessonId = lessonId === "" ? null : lessonId;
      updateScreen();
    },
    onCompleteLesson: (lessonId) => {
      if (progress.completedLessonIds.includes(lessonId)) return;

      progress = {
        completedLessonIds: [...progress.completedLessonIds, lessonId],
      };

      saveProgress(progress);
      updateScreen();
    },
  });
}

updateScreen();
