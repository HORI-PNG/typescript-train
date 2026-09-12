import type { Lesson } from "../types";

export const webAppChapter: Lesson[] = [
  {
    id: "domain-model",
    title: "画面より先に、データの形を決める",
    summary: "Webアプリの中心はUIではなくデータモデルです。",
    minutes: 12,
    sections: [
      {
        heading: "なぜ型から考えるのか",
        text: "フォーム、保存、画面表示、API通信はすべて同じデータを扱います。先に型を決めると、「何が必須か」「どの状態を許可するか」が一か所に集まり、仕様変更に強いアプリになります。",
      },
      {
        heading: "学習記録の型を作る",
        code: `type LearningStatus = "not-started" | "in-progress" | "completed";

type StudyRecord = {
  lessonId: string;
  status: LearningStatus;
  completedAt?: string;
  memo: string;
};

const record: StudyRecord = {
  lessonId: "domain-model",
  status: "in-progress",
  memo: "ユニオン型を復習する"
};`,
        text: 'statusをstringにせず、取り得る値をユニオン型で限定しています。存在しない状態、たとえば "almost-done" を書いた時点で検出できます。',
      },
      {
        heading: "任意プロパティは「存在しない」ことを表す",
        text: "completedAtは未完了なら存在しません。空文字列で表すよりも、optionalプロパティにして「値がない」状態を型で表す方が安全です。",
      },
    ],
    challenge:
      "Book型を作ってください。titleとauthorは必須の文字列、finishedAtは任意の文字列にします。",
  },
  {
    id: "dom-events",
    title: "DOM操作とイベントを安全に書く",
    summary: "HTML要素は、取得時点で存在すると限りません。",
    minutes: 14,
    sections: [
      {
        heading: "querySelectorの返り値を信じすぎない",
        code: `const button = document.querySelector("#save");

// button は Element | null
if (!(button instanceof HTMLButtonElement)) {
  throw new Error("保存ボタンが見つかりません");
}

button.disabled = true;`,
        text: "HTMLを変更すると、idの打ち間違いなどで要素が取得できなくなることがあります。nullチェックと instanceof により、実際にボタンであることまで確認できます。",
      },
      {
        heading: "入力値は必ず文字列として届く",
        code: `const input = document.querySelector("#memo");

if (input instanceof HTMLTextAreaElement) {
  const memo: string = input.value.trim();
  console.log(memo);
}`,
        text: "input.valueは常にstringです。数値を扱うフォームでも、Number(value)に変換し、NaNにならないかを確認します。",
      },
      {
        heading: "イベントのtargetは型が広い",
        code: `document.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof HTMLButtonElement) {
    console.log(target.dataset.lessonId);
  }
});`,
        text: "event.targetはEventTarget型であり、button専用のプロパティを直接は使えません。instanceofで絞り込んでから扱います。",
      },
    ],
    challenge:
      "idが「title」のinputを取得し、存在しない場合にはエラーを出すコードを書いてください。",
  },
  {
    id: "state-render",
    title: "状態と表示を分ける",
    summary: "画面を書き換える前に、アプリの現在地を一つの状態として持ちます。",
    minutes: 15,
    sections: [
      {
        heading: "Stateは画面の元データ",
        code: `type AppState = {
  selectedLessonId: string | null;
  completedLessonIds: string[];
};

let state: AppState = {
  selectedLessonId: null,
  completedLessonIds: []
};`,
        text: "DOMそのものを「状態」にしません。状態を変更してからrender関数を呼ぶ、と決めると、表示の不整合を減らせます。",
      },
      {
        heading: "更新は新しい値を作る",
        code: `function completeLesson(lessonId: string): void {
  if (state.completedLessonIds.includes(lessonId)) return;

  state = {
    ...state,
    completedLessonIds: [...state.completedLessonIds, lessonId]
  };

  render();
}`,
        text: "配列をその場で変更するより、新しいstateを作ると変更点を追いやすくなります。これはReactやNext.jsで重要になる考え方です。",
      },
      {
        heading: "renderはStateからだけ描く",
        code: `function render(): void {
  const app = document.querySelector("#app");

  if (!(app instanceof HTMLElement)) return;

  app.innerHTML = \`完了数: \${state.completedLessonIds.length}\`;
}`,
        text: "表示内容の出どころをstateに統一します。すると、保存済みデータを読み込んだ場合でも、同じrender関数で画面を復元できます。",
      },
    ],
    challenge:
      "selectedLessonIdを受け取り、stateだけを更新するselectLesson関数を書いてください。",
  },
  {
    id: "storage",
    title: "localStorageを型安全に使う",
    summary: "ブラウザ保存のデータは壊れている前提で読み込みます。",
    minutes: 14,
    sections: [
      {
        heading: "JSON.parseの結果はunknownとして扱う",
        code: `function loadProgress(): Progress {
  const raw = localStorage.getItem("ts-train-progress");

  if (raw === null) {
    return { completedLessonIds: [] };
  }

  try {
    return JSON.parse(raw) as Progress;
  } catch {
    return { completedLessonIds: [] };
  }
}`,
        text: "JSON.parseは実行時には何でも返せます。asだけに頼らず、本来はプロパティの有無も確認する必要があります。",
      },
      {
        heading: "最低限の検証を入れる",
        code: `function isProgress(value: unknown): value is Progress {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as { completedLessonIds?: unknown };

  return Array.isArray(candidate.completedLessonIds) &&
    candidate.completedLessonIds.every((id) => typeof id === "string");
}`,
        text: "value is Progress は型ガードです。外部から来たデータを、アプリ内部で使えるProgressへ安全に絞り込みます。",
      },
    ],
    challenge: "memoが文字列であることを確認する型ガードを書いてください。",
  },
  {
    id: "api-boundary",
    title: "API通信の型と、Next.jsへの接続",
    summary: "通信結果はTypeScriptの型だけでは保証できません。",
    minutes: 18,
    sections: [
      {
        heading: "Promiseの中身を表す",
        code: `type LessonSummary = {
  id: string;
  title: string;
};

async function fetchLessons(): Promise<LessonSummary[]> {
  const response = await fetch("/api/lessons");

  if (!response.ok) {
    throw new Error("レッスンを取得できませんでした");
  }

  return response.json() as Promise<LessonSummary[]>;
}`,
        text: "async関数はPromiseを返します。ただし、サーバーが本当にLessonSummary[]を返す保証はありません。重要なAPIでは、受け取ったJSONを型ガードで検証します。",
      },
      {
        heading: "Next.jsで役立つ境界の考え方",
        text: "Next.jsでは、画面のコンポーネント、サーバー処理、データベース、外部APIの境界が増えます。それぞれの境界で「入力」「出力」「失敗」を型として設計できれば、規模が大きくなっても保守しやすくなります。",
      },
      {
        heading: "WebAssemblyにつながる部分",
        text: "WebAssemblyを呼ぶときも、JavaScript/TypeScriptとWasmの間にデータ変換の境界があります。関数の入力・出力、nullになり得る値、配列の扱いを型で明確にする経験が、そのまま役立ちます。",
      },
    ],
    challenge:
      "fetch関数の失敗時に、HTTPステータスを含むErrorを投げるように変更してください。",
  },
];
