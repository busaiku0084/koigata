// ブラウザ側の処理。診断の進行・シェアボタン・イベントの送信
import { QUESTIONS } from "../src/content/questions.ts";
import { LOVE_TYPES } from "../src/content/types.ts";
import { scoreAnswers } from "../src/lib/score.ts";

type EventPayload = { name: string; type?: string; target?: string };

function track(payload: EventPayload): void {
  const body = JSON.stringify({ ...payload, path: location.pathname });
  // sendBeacon はページ遷移中でも送れる。使えない環境では fetch(keepalive) にする
  const blob = new Blob([body], { type: "application/json" });
  if (!navigator.sendBeacon?.("/api/e", blob)) {
    fetch("/api/e", { method: "POST", body, keepalive: true }).catch(() => {});
  }
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: { class?: string; text?: string } = {},
  children: Node[] = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (props.class) node.className = props.class;
  if (props.text) node.textContent = props.text;
  for (const child of children) node.append(child);
  return node;
}

function mountQuiz(root: HTMLElement): void {
  const answers: number[] = [];

  const render = () => {
    const index = answers.length;
    const question = QUESTIONS[index];
    if (!question) return finish();

    const progress = el("div", { class: "progress" }, [el("span")]);
    (progress.firstChild as HTMLElement).style.width = `${(index / QUESTIONS.length) * 100}%`;
    const choices = question.choices.map((choice, i) => {
      const button = el("button", { class: "choice", text: choice.label });
      button.type = "button";
      button.addEventListener("click", () => {
        answers.push(i);
        render();
      });
      return button;
    });
    const back = el("button", { class: "back", text: "← ひとつ戻る" });
    back.type = "button";
    back.hidden = index === 0;
    back.addEventListener("click", () => {
      answers.pop();
      render();
    });

    root.replaceChildren(
      progress,
      el("p", { class: "eyebrow", text: `Q${index + 1} / ${QUESTIONS.length}` }),
      el("h1", { class: "question", text: question.text }),
      el("div", { class: "choices" }, choices),
      back,
    );
  };

  const finish = () => {
    const type = LOVE_TYPES[scoreAnswers(answers)];
    track({ name: "quiz_complete", type: type.slug });
    location.href = `/r/${type.slug}?from=quiz`;
  };

  render();
}

async function shareToInstagram(slug: string, status: HTMLElement): Promise<void> {
  const imageUrl = `/story/${slug}.png`;
  try {
    const blob = await (await fetch(imageUrl)).blob();
    const file = new File([blob], `koigata-${slug}.png`, { type: "image/png" });
    // スマホでは共有シートから Instagram のストーリーズを選べる
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file] });
      return;
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return;
  }
  window.open(imageUrl, "_blank", "noopener");
  status.textContent =
    "画像を長押し（PC は右クリック）で保存して、ストーリーズに投稿してください。";
}

function mountShare(root: HTMLElement): void {
  const url = root.dataset.shareUrl ?? location.origin;
  const text = root.dataset.shareText ?? "";
  const slug = root.dataset.type ?? "";
  const status = root.querySelector<HTMLElement>(".share-status");

  // 自分の結果を表示したあとは ?from=quiz を消し、再読み込みやコピーで混ざらないようにする
  history.replaceState(null, "", location.pathname);

  root.addEventListener("click", async (e) => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-share]");
    if (!button) return;
    const target = button.dataset.share ?? "";
    track({ name: "share", type: slug, target });
    // 流入元を測れるよう、共有するリンクに ?s=共有先 を付ける
    const sharedUrl = `${url}?s=${target}`;

    if (target === "x") {
      const intent = new URL("https://x.com/intent/post");
      intent.searchParams.set("text", text);
      intent.searchParams.set("url", sharedUrl);
      window.open(intent, "_blank", "noopener");
    } else if (target === "line") {
      const line = new URL("https://social-plugins.line.me/lineit/share");
      line.searchParams.set("url", sharedUrl);
      window.open(line, "_blank", "noopener");
    } else if (target === "instagram" && status) {
      await shareToInstagram(slug, status);
    } else if (target === "copy" && status) {
      await navigator.clipboard.writeText(`${text}\n${sharedUrl}`);
      status.textContent = "コピーしました！";
    }
  });
}

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const link = target.closest<HTMLElement>("[data-event]");
  if (link?.dataset.event) track({ name: link.dataset.event });

  const teaser = target.closest<HTMLElement>("[data-teaser]");
  if (teaser) {
    track({ name: "teaser_click", target: teaser.dataset.teaser, type: teaser.dataset.type });
    const status = teaser.parentElement?.querySelector(".teaser-status");
    if (status) status.textContent = "ありがとうございます！公開までもう少しお待ちください。";
    (teaser as HTMLButtonElement).disabled = true;
  }
});

const quizRoot = document.getElementById("quiz");
if (quizRoot) mountQuiz(quizRoot);

const shareRoot = document.querySelector<HTMLElement>(".share");
if (shareRoot) mountShare(shareRoot);
