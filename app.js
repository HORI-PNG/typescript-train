(() => {
  const lessons = [
    {
      id: "discriminated-unions",
      title: "判別可能なユニオン",
      time: "8分",
      desc: "UIの複雑な状態遷移を型で守る",
      body: "Webアプリでは「ローディング中」「成功」「エラー」の状態管理が不可欠です。共通のプロパティ（`type`など）を持たせた型をユニオンで束ねることで、あり得ない状態（ロード中なのにデータがある等）をコンパイル時に防げます。",
      code: "type State =\n  | { type: 'loading' }\n  | { type: 'success'; payload: string }\n  | { type: 'error'; message: string };\n\nfunction render(s: State) {\n  if (s.type === 'success') console.log(s.payload);\n}",
      tip: "分岐後はTSが型を自動で絞り込みます（Type Guard）。ReactなどのUI構築における状態管理の基本です。",
    },
    {
      id: "utility-types",
      title: "ユーティリティ型",
      time: "8分",
      desc: "CRUD処理のデータモデルを派生させる",
      body: "DBのスキーマから、更新用や新規作成用の型を派生させます。`Omit`（除外）や`Pick`（抽出）、`Partial`（全て任意）を使うことで、元の型に変更があった際にも追従できる堅牢なデータモデルを作れます。",
      code: "type User = { id: string; name: string; age: number };\n\n// 新規作成時はIDが不要\ntype CreateUser = Omit<User, 'id'>;\n// 更新時は一部の項目だけで良い\ntype UpdateUser = Partial<Omit<User, 'id'>>;",
      tip: "同じような型を何度も手動で定義せず、一つの「真実のソース」から型を変換して使い回すのが実務の基本です。",
    },
    {
      id: "type-guards",
      title: "ユーザー定義型ガード",
      time: "10分",
      desc: "外部データを安全に検証する",
      body: "APIレスポンスや外部ファイルのパースなど、動的で型が保証されないデータ（`unknown`）を扱う際に必須の技術です。戻り値に `arg is Type` を指定した検証関数を通すことで、以降の処理で安全に型を確定させます。",
      code: "type ApiData = { token: string };\n\nfunction isApiData(data: unknown): data is ApiData {\n  return typeof data === 'object' && data !== null && 'token' in data;\n}\n\n// 外部からの未検証データ\nconst res: unknown = JSON.parse('{\"token\":\"abc\"}');\nif (isApiData(res)) {\n  console.log(res.token); // ここからApiDataとして扱える\n}",
      tip: "TSの型は実行時には消えます。実行時にデータ構造を検証し、TSの型システムと結びつける重要な境界線になります。",
    },
    {
      id: "const-assertion",
      title: "Constアサーション",
      time: "7分",
      desc: "オブジェクトを不変な定数として扱う",
      body: "Webアプリの設定値や定数群を定義する際、`as const` を末尾につけることで、プロパティが再代入不可（`readonly`）となり、文字列もリテラル型として極限まで厳格に推論されます。",
      code: "const Config = {\n  endpoint: '/api/v1',\n  timeout: 5000\n} as const;\n\n// Config.timeout = 3000; // エラー: 読み取り専用\ntype Endpoint = typeof Config.endpoint; // '/api/v1' というリテラル型になる",
      tip: "マジックナンバーや固定の文字列を安全に管理し、意図しない書き換えを防ぐために多用されます。",
    },
    {
      id: "mapped-types",
      title: "Mapped TypesとRecord",
      time: "9分",
      desc: "辞書型のデータ構造を柔軟に定義する",
      body: "動的なキーを持つオブジェクトを作る際、インデックスシグネチャの代わりに `Record<K, T>` を使います。キーの集合を限定することで、アクセス時の安全性が高まります。",
      code: "type Role = 'admin' | 'user' | 'guest';\n\nconst permissions: Record<Role, boolean> = {\n  admin: true,\n  user: false,\n  guest: false\n}; // 全てのRoleを網羅しないとエラーになる",
      tip: "設定の漏れや、後からRoleの種類が追加された際の修正忘れをコンパイラが教えてくれます。",
    },
    {
      id: "template-literal",
      title: "テンプレートリテラル型",
      time: "8分",
      desc: "APIルーティングを型レベルで縛る",
      body: "文字列のパターンそのものを型として定義できます。WebアプリにおけるAPIのエンドポイント指定や、特定の規則に沿ったIDなどを型システムで強制できます。",
      code: "type Entity = 'users' | 'posts';\ntype ApiPath = `/api/v1/${Entity}`;\n\nfunction fetchApi(path: ApiPath) { /* ... */ }\n\nfetchApi('/api/v1/users'); // OK\n// fetchApi('/api/v2/users'); // エラー: パスが一致しない",
      tip: "文字列ベースの柔軟なインターフェースを持つライブラリ（ルーティングやイベント等）を自作・拡張する際に威力を発揮します。",
    },
  ];

  const questions = [
    {
      kind: "choice",
      prompt:
        "複数の状態（成功、エラーなど）を`type`プロパティで判別させる安全な型定義の手法は何と呼ばれますか？",
      choices: ["Mapped Types", "Discriminated Unions", "Type Guards"],
      answer: 1,
      explain:
        "共通のリテラル型プロパティ（判別子）を持たせたユニオン型を利用することで、安全な状態遷移を表現できます。",
    },
    {
      kind: "code",
      prompt:
        "`User`型から`password`プロパティだけを除外した`PublicUser`型を作ってください。",
      starter:
        "type User = { id: string; password: string; name: string };\ntype PublicUser = ____<User, 'password'>;",
      answer: "Omit",
      explain:
        "特定のプロパティを除外する場合は `Omit`、抽出する場合は `Pick` を使用します。",
    },
    {
      kind: "choice",
      prompt:
        "外部からの `unknown` 型データを検証し、特定の型として確定させる関数の戻り値の書き方は？",
      choices: ["data as Type", "data is Type", "typeof data === Type"],
      answer: 1,
      explain:
        "`arg is Type` を戻り値に指定した関数をユーザー定義型ガードと呼びます。",
    },
    {
      kind: "code",
      prompt:
        "オブジェクトの全プロパティを再代入不可（`readonly`）にし、型を最も厳格に推論させるアサーションを埋めてください。",
      starter: "const Roles = {\n  ADMIN: 1,\n  USER: 2\n} ____;",
      answer: "as const",
      explain:
        "`as const` をつけると、プロパティが再代入不可になり、値がリテラル型として扱われます。",
    },
    {
      kind: "choice",
      prompt:
        "特定の文字列リテラルのみをキーとして許容するオブジェクトの型を定義するのに適しているのは？",
      choices: ["Record<K, T>", "Array<T>", "Omit<T, K>"],
      answer: 0,
      explain:
        "`Record<Keys, Type>` を使うと、指定したキー（Keys）と値（Type）を持つ安全な辞書型を定義できます。",
    },
    {
      kind: "choice",
      prompt:
        "`` `/api/${string}` `` のように、特定のパターンを満たす文字列のみを許容する型の機能はどれですか？",
      choices: [
        "ジェネリクス",
        "テンプレートリテラル型",
        "インデックスシグネチャ",
      ],
      answer: 1,
      explain:
        "JavaScriptのテンプレート文字列の構文を、型定義に応用した強力な機能です。",
    },
  ];
  const roadmap = [
    [
      "01",
      "TypeScript 基礎",
      "型注釈、関数、オブジェクト、ユニオン型を学び、小さなプログラムを安全に書く。",
      "いまここ",
    ],
    [
      "02",
      "ブラウザ API",
      "DOM、localStorage、Fetchを扱い、ユーザーが触れる小さなアプリを作る。",
      "次の一歩",
    ],
    [
      "03",
      "Next.js",
      "Reactのコンポーネント、ルーティング、データ取得を学び、実用的なWebアプリへ。",
      "研究の土台",
    ],
    [
      "04",
      "WebAssembly",
      "Rustなどで書いた高速な処理をWebから呼び、型・メモリ・境界を理解する。",
      "発展",
    ],
  ];
  const key = "ts-train-progress-v1";
  const state = Object.assign(
    { done: [], answers: {}, visited: 0 },
    JSON.parse(localStorage.getItem(key) || "{}"),
  );
  const app = document.querySelector("#app");
  const toast = document.querySelector("#toast");
  const esc = (value) =>
    String(value).replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );
  const save = () => localStorage.setItem(key, JSON.stringify(state));
  const progress = () => Math.round((state.done.length / lessons.length) * 100);
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  };
  const setNav = (page) =>
    document
      .querySelectorAll("[data-nav]")
      .forEach((n) => n.classList.toggle("active", n.dataset.nav === page));
  const home = () => {
    setNav("home");
    app.innerHTML = `<section class="hero"><div class="eyebrow">Offline learning / TypeScript</div><h1>電車の時間を、<br>型が読める時間に。</h1><p class="lead">通信なしで学べる、短くて手を動かすTypeScript教材。基礎からNext.js、そしてWebAssemblyへつながる道のりを作ります。</p><div class="button-row"><a class="btn" href="#learn">レッスンを始める</a><a class="btn secondary" href="#practice">今日の練習</a></div></section><section class="grid home-grid"><article class="card continue-card"><div><span class="kicker">あなたの進捗</span><h2>${state.done.length ? "続きから学ぶ" : "最初の1レッスンから"}</h2><div class="progress-bar"><span style="width:${progress()}%"></span></div><div class="progress-copy">${state.done.length} / ${lessons.length} レッスン完了 (${progress()}%)</div></div><a class="btn" href="#learn/${state.done.length < lessons.length ? lessons.find((x) => !state.done.includes(x.id)).id : lessons[0].id}">${state.done.length ? "次のレッスンへ" : "型注釈を学ぶ"}</a></article><article class="card"><h2>学習の記録</h2><p>小さく進めるほど、型は自分の言葉になります。</p><div class="stats"><div class="stat"><strong>${state.done.length}</strong><span>完了</span></div><div class="stat"><strong>${Object.keys(state.answers).filter((k) => state.answers[k]).length}</strong><span>正解</span></div><div class="stat"><strong>${lessons.reduce((s, l) => s + (state.done.includes(l.id) ? Number(l.time.replace("分", "")) : 0), 0)}</strong><span>学習分</span></div></div></article></section><section class="card" style="margin-top:16px"><div class="eyebrow">電車で使うコツ</div><h2>出発前に一度だけ開けばOK</h2><p>このアプリは端末に教材を保存します。画面右上が「オフラインでも利用可能」になったら、通信を切ってもレッスンと練習、進捗保存を使えます。</p></section>`;
  };
  const learn = () => {
    setNav("learn");
    app.innerHTML = `<div class="section-head"><div><div class="eyebrow">Curriculum</div><h1>TypeScriptを学ぶ</h1></div><span class="progress-copy">${progress()}% 完了</span></div><p class="lead">順番に取り組んでも、気になる項目から始めても大丈夫です。各レッスンは電車の一区間で終えられる量です。</p><div class="lesson-list">${lessons.map((l, i) => `<a class="lesson ${state.done.includes(l.id) ? "done" : ""}" href="#learn/${l.id}"><span class="lesson-num">${state.done.includes(l.id) ? "✓" : String(i + 1).padStart(2, "0")}</span><span><span class="lesson-title">${l.title}</span><span class="lesson-desc">${l.desc}</span></span><span class="lesson-time">${l.time}</span></a>`).join("")}</div>`;
  };
  const lesson = (id) => {
    const l = lessons.find((x) => x.id === id);
    if (!l) return learn();
    setNav("learn");
    const index = lessons.indexOf(l);
    app.innerHTML = `<article class="lesson-page"><a class="back" href="#learn">← レッスン一覧へ</a><div class="eyebrow" style="margin-top:25px">Lesson ${String(index + 1).padStart(2, "0")} / ${l.time}</div><h1>${l.title}</h1><p class="lead">${l.desc}</p><p class="explain">${l.body}</p><pre class="code"><code>${esc(l.code)}</code></pre><div class="callout"><strong>覚えておくこと</strong><br>${l.tip}</div><div class="lesson-actions"><a class="btn secondary" href="#practice">理解度を確認</a><button class="btn" id="complete">${state.done.includes(l.id) ? "完了済み ✓" : "このレッスンを完了"}</button></div></article>`;
    document.querySelector("#complete").onclick = () => {
      if (!state.done.includes(l.id)) {
        state.done.push(l.id);
        save();
        showToast("レッスンを完了として記録しました");
      }
      location.hash =
        index < lessons.length - 1
          ? `#learn/${lessons[index + 1].id}`
          : "#home";
    };
  };
  const practice = () => {
    setNav("practice");
    const active = Number(location.hash.split("/")[1] || 0);
    const q = questions[active] || questions[0];
    const solved = state.answers[active];
    app.innerHTML = `<div class="section-head"><div><div class="eyebrow">Practice lab</div><h1>手を動かして確認</h1></div><span class="progress-copy">${Object.keys(state.answers).filter((k) => state.answers[k]).length}/${questions.length} 正解</span></div><div class="practice-layout"><div class="question-tabs">${questions.map((_, i) => `<a href="#practice/${i}" class="q-tab ${i === active ? "active" : ""} ${state.answers[i] ? "correct" : ""}"><b>${i + 1}</b><span>問題 ${i + 1}</span></a>`).join("")}</div><article class="card question-card"><div class="eyebrow">問題 ${active + 1} / ${questions.length}</div><h2>${q.kind === "code" ? "コード穴埋め" : "選択クイズ"}</h2><p class="question-prompt">${esc(q.prompt).replace(/\n/g, "<br>")}</p>${q.kind === "choice" ? `<div class="choices">${q.choices.map((c, i) => `<button class="choice" data-choice="${i}">${esc(c)}</button>`).join("")}</div>` : `<pre class="code"><code>${esc(q.starter)}</code></pre><textarea id="code-answer" class="answer-area" placeholder="空欄に入るコードを書いてください"></textarea>`}<div class="button-row"><button id="check" class="btn">答えを確認</button><a class="btn secondary" href="#practice/${Math.min(active + 1, questions.length - 1)}">次の問題</a></div><div id="feedback" class="feedback hidden"></div></article></div>`;
    let selected = null;
    document.querySelectorAll("[data-choice]").forEach(
      (b) =>
        (b.onclick = () => {
          if (solved) return;
          document
            .querySelectorAll("[data-choice]")
            .forEach((x) => x.classList.remove("selected"));
          b.classList.add("selected");
          selected = Number(b.dataset.choice);
        }),
    );
    document.querySelector("#check").onclick = () => {
      let correct = false;
      if (q.kind === "choice") {
        if (selected === null) return showToast("選択肢を選んでください");
        correct = selected === q.answer;
        document.querySelectorAll("[data-choice]").forEach((b) => {
          const n = Number(b.dataset.choice);
          b.classList.add(
            n === q.answer ? "correct" : n === selected ? "wrong" : "",
          );
        });
      } else {
        const val = document
          .querySelector("#code-answer")
          .value.trim()
          .replace(/\s+/g, " ");
        correct = val === q.answer;
      }
      if (correct) {
        state.answers[active] = true;
        save();
      }
      const feedback = document.querySelector("#feedback");
      feedback.className = `feedback ${correct ? "good" : "bad"}`;
      feedback.innerHTML = `<strong>${correct ? "正解です！" : "もう一度考えてみましょう"}</strong><br>${q.explain}`;
    };
  };
  const road = () => {
    setNav("roadmap");
    app.innerHTML = `<div class="section-head"><div><div class="eyebrow">Learning path</div><h1>研究につながる道のり</h1></div></div><p class="lead">型を理解すると、複雑な画面・データ・高速処理の境界を安全に設計できるようになります。</p><section class="roadmap">${roadmap.map((r, i) => `<article class="roadmap-item ${i === 0 ? "active" : ""}"><div class="roadmap-dot">${r[0]}</div><div><h3>${r[1]}</h3><p>${r[2]}</p><span class="badge">${r[3]}</span></div></article>`).join("")}</section><article class="card"><h2>WebAssemblyに進む前に</h2><p>TypeScriptで「データの形」「非同期の結果」「関数の入出力」を言語化できるようになると、JavaScriptとWebAssemblyの境界を設計する力につながります。焦らず、まずこの6レッスンを一周しましょう。</p><div class="button-row"><a href="#learn" class="btn">基礎から始める</a></div></article>`;
  };
  const render = () => {
    const [page, param] = location.hash.slice(1).split("/");
    if (page === "learn" && param) lesson(param);
    else if (page === "learn") learn();
    else if (page === "practice") practice();
    else if (page === "roadmap") road();
    else home();
    window.scrollTo(0, 0);
  };
  const network = () => {
    const on = navigator.onLine;
    document.querySelector("#network-dot").classList.toggle("offline", !on);
    document.querySelector("#network-label").textContent = on
      ? "オンライン"
      : "オフラインでも利用可能";
  };
  window.addEventListener("hashchange", render);
  window.addEventListener("online", network);
  window.addEventListener("offline", network);
  if ("serviceWorker" in navigator)
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  network();
  render();
})();
