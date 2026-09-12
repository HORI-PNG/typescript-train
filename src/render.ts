import type { Lesson, Progress } from "./types";

type RenderOptions = {
  lessons: Lesson[];
  progress: Progress;
  selectedLessonId: string | null;
  onSelectLesson: (lessonId: string) => void;
  onCompleteLesson: (lessonId: string) => void;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function render(options: RenderOptions): void {
  const app = document.querySelector("#app");

  if (!(app instanceof HTMLElement)) {
    throw new Error("#app が見つかりません");
  }

  const selectedLesson = options.lessons.find(
    (lesson) => lesson.id === options.selectedLessonId,
  );

  if (selectedLesson === undefined) {
    app.innerHTML = renderLessonList(options);
    attachListEvents(app, options);
    return;
  }

  app.innerHTML = renderLesson(selectedLesson, options.progress);
  attachLessonEvents(app, selectedLesson, options);
}

function renderLessonList(options: RenderOptions): string {
  const completedCount = options.progress.completedLessonIds.length;

  const lessonItems = options.lessons
    .map((lesson) => {
      const completed = options.progress.completedLessonIds.includes(lesson.id);

      return `
        <button class="lesson-card" data-lesson-id="${lesson.id}">
          <span>${completed ? "✓ 完了" : `${lesson.minutes}分`}</span>
          <h2>${escapeHtml(lesson.title)}</h2>
          <p>${escapeHtml(lesson.summary)}</p>
        </button>
      `;
    })
    .join("");

  return `
    <section>
      <p>Chapter 02</p>
      <h1>Webアプリを作るためのTypeScript</h1>
      <p>
        画面、フォーム、保存、通信を安全に扱うための型設計を学びます。
        ${completedCount} / ${options.lessons.length} 完了
      </p>
      <div class="lesson-list">${lessonItems}</div>
    </section>
  `;
}

function renderLesson(lesson: Lesson, progress: Progress): string {
  const completed = progress.completedLessonIds.includes(lesson.id);

  const sections = lesson.sections
    .map(
      (section) => `
        <section>
          <h2>${escapeHtml(section.heading)}</h2>
          <p>${escapeHtml(section.text)}</p>
          ${
            section.code === undefined
              ? ""
              : `<pre><code>${escapeHtml(section.code)}</code></pre>`
          }
        </section>
      `,
    )
    .join("");

  return `
    <article>
      <button id="back-button">← 章の一覧へ戻る</button>
      <p>${lesson.minutes}分</p>
      <h1>${escapeHtml(lesson.title)}</h1>
      <p>${escapeHtml(lesson.summary)}</p>
      ${sections}
      <section>
        <h2>演習</h2>
        <p>${escapeHtml(lesson.challenge)}</p>
      </section>
      <button id="complete-button" ${completed ? "disabled" : ""}>
        ${completed ? "完了済み" : "このレッスンを完了する"}
      </button>
    </article>
  `;
}

function attachListEvents(app: HTMLElement, options: RenderOptions): void {
  app
    .querySelectorAll<HTMLButtonElement>("[data-lesson-id]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const lessonId = button.dataset.lessonId;

        if (lessonId !== undefined) {
          options.onSelectLesson(lessonId);
        }
      });
    });
}

function attachLessonEvents(
  app: HTMLElement,
  lesson: Lesson,
  options: RenderOptions,
): void {
  app.querySelector("#back-button")?.addEventListener("click", () => {
    options.onSelectLesson("");
  });

  app.querySelector("#complete-button")?.addEventListener("click", () => {
    options.onCompleteLesson(lesson.id);
  });
}
