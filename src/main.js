import "./style.css";
import { webAppChapter } from "./data/web-app-chapter";
import { render } from "./render";
import { loadProgress, saveProgress } from "./storage";
let progress = loadProgress();
let selectedLessonId = null;
function updateScreen() {
    render({
        lessons: webAppChapter,
        progress,
        selectedLessonId,
        onSelectLesson: (lessonId) => {
            selectedLessonId = lessonId === "" ? null : lessonId;
            updateScreen();
        },
        onCompleteLesson: (lessonId) => {
            if (progress.completedLessonIds.includes(lessonId))
                return;
            progress = {
                completedLessonIds: [...progress.completedLessonIds, lessonId],
            };
            saveProgress(progress);
            updateScreen();
        },
    });
}
updateScreen();
