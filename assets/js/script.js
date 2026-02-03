const input = document.getElementById("url-input");
const convertBtn = document.querySelector("button");
const outputText = document.getElementById("output-text");
const copyBtn = document.getElementById("copy-btn");
const themeBtn = document.getElementById("theme-toggle-btn");
const body = document.body;

function pagesToRepo(url) {
const parsed = new URL(url);
const username = parsed.hostname.replace(".github.io", "");
const repo = parsed.pathname.replace(/^\/|\/$/g, "");
if (!username || !repo) throw new Error("Invalid GitHub Pages URL");
return `https://github.com/${username}/${repo}`;
}

function repoToPages(url) {
const parsed = new URL(url);
const parts = parsed.pathname.replace(/^\/|\/$/g, "").split("/");
if (parts.length < 2) throw new Error("Invalid GitHub repository URL");
return `https://${parts[0]}.github.io/${parts[1]}/`;
}

function convertUrl(url) {
if (url.includes(".github.io")) return pagesToRepo(url);
if (url.includes("github.com")) return repoToPages(url);
throw new Error("Enter a valid GitHub Pages or repo URL");
}

function runConversion() {
  const value = input.value.trim();
  copyBtn.disabled = true;

  // Remove previous animation class
  outputText.classList.remove("error-shake");
  
  // Force reflow to restart animation
  void outputText.offsetWidth;

  if (!value) {
    outputText.textContent = "Please enter a URL.";
    outputText.classList.add("error-shake");
    return;
  }

  try {
    const result = convertUrl(value);
    outputText.innerHTML = `<a href="${result}" target="_blank">${result}</a>`;
    copyBtn.dataset.copy = result;
    copyBtn.disabled = false;
  } catch (err) {
    outputText.textContent = err.message;
    outputText.classList.add("error-shake");
  }
}

// Convert on button click
convertBtn.addEventListener("click", runConversion);

// Convert on Enter key
input.addEventListener("keydown", (e) => {
if (e.key === "Enter") {
    e.preventDefault();
    runConversion();
}
});

// Copy to clipboard
const tooltip = document.getElementById("copy-tooltip");

copyBtn.addEventListener("click", async () => {
  const text = copyBtn.dataset.copy;
  if (!text) return;

  await navigator.clipboard.writeText(text);

  tooltip.style.opacity = "1";

  setTimeout(() => {
    tooltip.style.opacity = "0";
  }, 1200);
});

// Theme toggle
themeBtn.addEventListener("click", () => {
body.classList.toggle("light");
themeBtn.textContent = body.classList.contains("light") ? "🌞" : "🌙";
});

