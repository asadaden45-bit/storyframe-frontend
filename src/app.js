const API_URL = "https://storyframe-backend.onrender.com/web/stories";

async function generateStory() {
  const promptEl = document.getElementById("prompt");
  const styleEl = document.getElementById("style");
  const resultEl = document.getElementById("result");
  const btn = document.getElementById("btn");

  const prompt = (promptEl?.value || "").trim();
  const style = styleEl?.value || "default";

  resultEl.className = "";
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
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      resultEl.classList.add("error");
      resultEl.textContent =
        `Error ${response.status}:\n` + JSON.stringify(data, null, 2);
      return;
    }

    resultEl.classList.add("success");
    resultEl.textContent = data.story ?? JSON.stringify(data, null, 2);
  } catch (err) {
    resultEl.classList.add("error");
    resultEl.textContent = "Error: " + (err?.message || String(err));
  } finally {
    btn.disabled = false;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn")?.addEventListener("click", generateStory);
});
