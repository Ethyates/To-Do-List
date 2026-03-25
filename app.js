const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const tagInput = document.getElementById("tag-input");
const list = document.getElementById("task-list");
const error = document.getElementById("error");
const counter = document.getElementById("counter");
const tagFilter = document.getElementById("tag-filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let currentTag = "all";

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  list.innerHTML = "";

  let filtered = tasks.filter(task => {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "completed") return task.done;
    return true;
  });

  if (currentTag !== "all") {
    filtered = filtered.filter(task => task.tag === currentTag);
  }

  filtered.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="${task.done ? "completed" : ""}">
        ${task.text} ${task.tag ? `(${task.tag})` : ""}
      </span>
      <div>
        <button onclick="toggleTask(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">✖</button>
      </div>
    `;

    list.appendChild(li);
  });

  updateCounter();
  updateTagFilter();
}

// Counter
function updateCounter() {
  const active = tasks.filter(t => !t.done).length;
  counter.textContent = `${active} active tasks`;
}

// Tag dropdown population
function updateTagFilter() {
  const tags = [...new Set(tasks.map(t => t.tag).filter(Boolean))];

  tagFilter.innerHTML = `<option value="all">All Tags</option>`;

  tags.forEach(tag => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    tagFilter.appendChild(option);
  });
}

// Add task
form.addEventListener("submit", e => {
  e.preventDefault();

  if (!input.value.trim()) {
    error.textContent = "Task name is required";
    return;
  }

  const task = {
    id: Date.now(),
    text: input.value.trim(),
    tag: tagInput.value,
    done: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  input.value = "";
  tagInput.value = "";
  error.textContent = "";
});

// Toggle
function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, done: !t.done } : t
  );
  saveTasks();
  renderTasks();
}

// Delete
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// Filter buttons
document.querySelectorAll("[data-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Tag filter
tagFilter.addEventListener("change", () => {
  currentTag = tagFilter.value;
  renderTasks();
});

// Initial load
renderTasks();