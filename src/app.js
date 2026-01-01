// ✅ Use backend directly on Cloudflare Pages (fixes 405)
const API_URL = "https://storyframe-backend.onrender.com/web/stories";

async function generateStory() {
  const promptEl = document.getElementById("prompt");
  const styleEl = document.getElementById("style");
  const resultEl = document.getElementById("result");
  const btn = document.getElementById("btn");
  const copyBtn = document.getElementById("copyBtn");

  const prompt = (promptEl?.value || "").trim();
  const style = styleEl?.value || "default";

  resultEl.className = "";
  if (copyBtn) copyBtn.disabled = true;

  if (!prompt) {
    resultEl.classList.add("error");
    resultEl.textContent = "Please type a prompt first.";
    return;
  }

  btn.disabled = true;
  resultEl.textContent = "Generating...";
  resultEl.classList.remove("error", "success");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, style }),
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!response.ok) {
      resultEl.classList.add("error");
      resultEl.textContent =
        `Error ${response.status}:\n` + JSON.stringify(data, null, 2);
      return;
    }

    const storyText = data.story ?? JSON.stringify(data, null, 2);
    resultEl.classList.add("success");
    resultEl.textContent = storyText;

    if (copyBtn) copyBtn.disabled = !storyText;
  } catch (err) {
    resultEl.classList.add("error");
    resultEl.textContent = "Error: " + (err?.message || String(err));
  } finally {
    btn.disabled = false;
  }
}

async function copyStory() {
  const resultEl = document.getElementById("result");
  const copyBtn = document.getElementById("copyBtn");
  const text = (resultEl?.textContent || "").trim();

  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    if (copyBtn) {
      const old = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = old), 900);
    }
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    if (copyBtn) {
      const old = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = old), 900);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn")?.addEventListener("click", generateStory);
  document.getElementById("copyBtn")?.addEventListener("click", copyStory);
});
