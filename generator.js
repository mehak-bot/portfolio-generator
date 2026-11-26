// generator.js
// This file turns the form data into a complete, standalone portfolio website (one HTML string).
// The same function is used for the live preview and for the downloaded file.

// ---------- Helpers ----------

// Makes user text safe to place inside HTML.
// Without this, someone could type <script> in a field and break (or attack) the page.
function escapeHTML(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Only allows normal http/https links. Anything else (like "javascript:...") is dropped.
function safeUrl(url) {
  const value = String(url || "").trim();
  if (!value) return "";
  const withProtocol = /^https?:\/\//i.test(value) ? value : "https://" + value;
  try {
    const parsed = new URL(withProtocol);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : "";
  } catch (error) {
    return "";
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

// ---------- Themes ----------
// Each theme is just a set of colors. The portfolio uses them as CSS variables.
const THEMES = {
  light: { bg: "#ffffff", text: "#1f2937", muted: "#6b7280", card: "#f3f4f6", accent: "#4f46e5", onAccent: "#ffffff" },
  dark: { bg: "#0f172a", text: "#e2e8f0", muted: "#94a3b8", card: "#1e293b", accent: "#38bdf8", onAccent: "#0f172a" },
  sunset: { bg: "#fff7ed", text: "#431407", muted: "#9a3412", card: "#ffedd5", accent: "#ea580c", onAccent: "#ffffff" },
};

// ---------- Main function ----------

function buildPortfolio(data) {
  const theme = THEMES[data.theme] || THEMES.light;

  const name = escapeHTML(data.name.trim() || "Your Name");
  const title = escapeHTML(data.title.trim());
  const about = escapeHTML(data.about.trim());

  // "HTML, CSS, JavaScript" -> ["HTML", "CSS", "JavaScript"]
  const skills = data.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Ignore project cards that have no title
  const projects = data.projects.filter((p) => p.title.trim());

  // Contact links
  const links = [];
  if (isValidEmail(data.email)) {
    links.push({ label: "Email", href: "mailto:" + data.email.trim() });
  }
  const github = safeUrl(data.github);
  if (github) links.push({ label: "GitHub", href: github });
  const linkedin = safeUrl(data.linkedin);
  if (linkedin) links.push({ label: "LinkedIn", href: linkedin });

  // Build each section only if the user filled it in
  const aboutSection = about
    ? `<section><h2>About</h2><p class="about">${about}</p></section>`
    : "";

  const skillsSection = skills.length
    ? `<section><h2>Skills</h2><div class="chips">${skills
        .map((s) => `<span class="chip">${escapeHTML(s)}</span>`)
        .join("")}</div></section>`
    : "";

  const projectsSection = projects.length
    ? `<section><h2>Projects</h2><div class="grid">${projects
        .map((p) => {
          const link = safeUrl(p.link);
          return `<article class="card">
            <h3>${escapeHTML(p.title.trim())}</h3>
            <p>${escapeHTML(p.description.trim())}</p>
            ${link ? `<a class="link" href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer">View project &rarr;</a>` : ""}
          </article>`;
        })
        .join("")}</div></section>`
    : "";

  const contactSection = links.length
    ? `<section><h2>Contact</h2><div class="buttons">${links
        .map(
          (l) =>
            `<a class="button" href="${escapeHTML(l.href)}" target="_blank" rel="noopener noreferrer">${l.label}</a>`
        )
        .join("")}</div></section>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${name}${title ? " - " + title : ""}</title>
<style>
  :root {
    --bg: ${theme.bg};
    --text: ${theme.text};
    --muted: ${theme.muted};
    --card: ${theme.card};
    --accent: ${theme.accent};
    --on-accent: ${theme.onAccent};
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
  }
  .wrap { max-width: 820px; margin: 0 auto; padding: 0 24px 60px; }
  header { padding: 80px 0 40px; }
  header h1 { margin: 0; font-size: clamp(2rem, 6vw, 3.2rem); line-height: 1.15; }
  header .subtitle { margin: 10px 0 0; font-size: 1.2rem; color: var(--accent); font-weight: 600; }
  section { margin-top: 44px; }
  h2 {
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin: 0 0 14px;
  }
  .about { margin: 0; white-space: pre-line; font-size: 1.05rem; }
  .chips { display: flex; flex-wrap: wrap; gap: 10px; }
  .chip {
    background: var(--card);
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 0.9rem;
    font-weight: 500;
  }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
  .card { background: var(--card); border-radius: 14px; padding: 20px; }
  .card h3 { margin: 0 0 8px; font-size: 1.1rem; }
  .card p { margin: 0 0 12px; color: var(--muted); font-size: 0.95rem; white-space: pre-line; }
  .link { color: var(--accent); font-weight: 600; text-decoration: none; }
  .link:hover { text-decoration: underline; }
  .buttons { display: flex; flex-wrap: wrap; gap: 12px; }
  .button {
    background: var(--accent);
    color: var(--on-accent);
    padding: 10px 20px;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 600;
  }
  .button:hover { opacity: 0.9; }
  footer { margin-top: 60px; color: var(--muted); font-size: 0.85rem; }
</style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>${name}</h1>
      ${title ? `<p class="subtitle">${title}</p>` : ""}
    </header>
    ${aboutSection}
    ${skillsSection}
    ${projectsSection}
    ${contactSection}
    <footer>&copy; ${new Date().getFullYear()} ${name}</footer>
  </div>
</body>
</html>`;
}

// This lets us test the file with Node.js. The browser ignores it.
if (typeof module !== "undefined") {
  module.exports = { buildPortfolio, escapeHTML, safeUrl, isValidEmail, THEMES };
}
