// app.js
// Handles the form: reads what the user types, saves it, updates the live preview, and downloads the file.

const STORAGE_KEY = "portfolio-generator-data";

// An empty project card
function emptyProject() {
  return { title: "", description: "", link: "" };
}

// The starting values of the form
function defaultData() {
  return {
    name: "",
    title: "",
    about: "",
    skills: "",
    email: "",
    github: "",
    linkedin: "",
    theme: "light",
    projects: [emptyProject()],
  };
}

// Example content so users can see how it works in one click
const SAMPLE_DATA = {
  name: "Aarav Mehta",
  title: "Full Stack Web Developer",
  about:
    "I am a third-year Computer Science student who loves building useful web apps.\nCurrently looking for an internship where I can learn from a team and ship real features.",
  skills: "HTML, CSS, JavaScript, React, Node.js, MongoDB, Git",
  email: "aarav@example.com",
  github: "https://github.com/aarav-mehta",
  linkedin: "https://www.linkedin.com/in/aarav-mehta",
  theme: "dark",
  projects: [
    {
      title: "EventPass Lite",
      description: "Event check-in system. Each attendee gets a unique QR ticket and duplicate entries are blocked.",
      link: "https://github.com/aarav-mehta/eventpass-lite",
    },
    {
      title: "Bunk Calculator",
      description: "Tracks attendance per subject and shows how many classes you can skip while staying above 75%.",
      link: "",
    },
  ],
};

// ---------- Elements ----------
const preview = document.getElementById("preview");
const projectsBox = document.getElementById("projects");
const statusMessage = document.getElementById("status");

// Text inputs whose id matches the key in our data object
const simpleFields = ["name", "title", "about", "skills", "email", "github", "linkedin"];

let state = loadData();

// ---------- Save and load ----------

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.projects)) {
      return { ...defaultData(), ...saved };
    }
  } catch (error) {
    // ignore broken or missing data
  }
  return defaultData();
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // storage may be blocked; the app still works without it
  }
}

// ---------- Show data in the form ----------

function writeForm() {
  simpleFields.forEach((field) => {
    document.getElementById(field).value = state[field];
  });
  document.querySelector(`input[name="theme"][value="${state.theme}"]`).checked = true;
  renderProjects();
}

// Creates the project input boxes. Called only when a project is added or removed
// (not on every keystroke, otherwise the cursor would jump out of the box).
function renderProjects() {
  projectsBox.innerHTML = "";

  state.projects.forEach((project, index) => {
    const box = document.createElement("div");
    box.className = "project-box";

    box.innerHTML = `
      <div class="project-head">
        <strong>Project ${index + 1}</strong>
        <button type="button" class="link-btn" data-remove="${index}">Remove</button>
      </div>
      <label>Title</label>
      <input type="text" data-index="${index}" data-field="title" placeholder="e.g. Weather App" />
      <label>Short description</label>
      <textarea rows="2" data-index="${index}" data-field="description" placeholder="What does it do?"></textarea>
      <label>Link (optional)</label>
      <input type="text" data-index="${index}" data-field="link" placeholder="https://github.com/you/project" />
    `;

    // Set values with JS (safer than putting them inside the HTML string)
    box.querySelector('[data-field="title"]').value = project.title;
    box.querySelector('[data-field="description"]').value = project.description;
    box.querySelector('[data-field="link"]').value = project.link;

    projectsBox.appendChild(box);
  });
}

// ---------- Update preview ----------

function update() {
  saveData();
  preview.srcdoc = buildPortfolio(state);
}

// ---------- Events ----------

// Runs every time the user types in any field
document.getElementById("form").addEventListener("input", (event) => {
  const target = event.target;

  if (simpleFields.includes(target.id)) {
    state[target.id] = target.value;
  } else if (target.name === "theme") {
    state.theme = target.value;
  } else if (target.dataset.field) {
    state.projects[Number(target.dataset.index)][target.dataset.field] = target.value;
  }

  update();
});

// Add a new project card
document.getElementById("add-project").addEventListener("click", () => {
  state.projects.push(emptyProject());
  renderProjects();
  update();
});

// Remove a project card (click is handled on the container)
projectsBox.addEventListener("click", (event) => {
  const index = event.target.dataset.remove;
  if (index === undefined) return;

  state.projects.splice(Number(index), 1);
  if (state.projects.length === 0) state.projects.push(emptyProject());
  renderProjects();
  update();
});

// Fill with example content
document.getElementById("sample").addEventListener("click", () => {
  state = JSON.parse(JSON.stringify(SAMPLE_DATA));
  writeForm();
  update();
  showStatus("Sample data loaded. Replace it with your own details.", "info");
});

// Clear everything
document.getElementById("reset").addEventListener("click", () => {
  if (!confirm("Clear the whole form?")) return;
  state = defaultData();
  writeForm();
  update();
  showStatus("Form cleared.", "info");
});

// Download the portfolio as a single HTML file
document.getElementById("download").addEventListener("click", () => {
  if (!state.name.trim()) {
    showStatus("Please enter your name first.", "error");
    document.getElementById("name").focus();
    return;
  }

  const html = buildPortfolio(state);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const fileName = state.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "portfolio";

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName + "-portfolio.html";
  link.click();
  URL.revokeObjectURL(url);

  showStatus("Downloaded! Open the file in your browser or upload it to Netlify or GitHub Pages.", "success");
});

// ---------- Status message ----------

let statusTimer;
function showStatus(text, type) {
  statusMessage.textContent = text;
  statusMessage.className = "status " + type;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => (statusMessage.className = "status hidden"), 4000);
}

// ---------- Start ----------
writeForm();
update();
