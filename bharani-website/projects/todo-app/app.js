// ============================================
// app.js — Todo App with Firebase, Priority & Drag-to-Reorder
// ============================================

const firebaseConfig = {
  apiKey:            "AIzaSyB1t-uQwdpc6YMMHcDbAkVexlOqm3B5hRM",
  authDomain:        "bharani-s-website.firebaseapp.com",
  databaseURL:       "https://bharani-s-website-default-rtdb.firebaseio.com",
  projectId:         "bharani-s-website",
  storageBucket:     "bharani-s-website.firebasestorage.app",
  messagingSenderId: "315781092514",
  appId:             "1:315781092514:web:d0bed98d5f4c8b7cda33fb"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ============================================
// DOM
// ============================================
const loginScreen     = document.getElementById("loginScreen");
const appScreen       = document.getElementById("appScreen");
const loginForm       = document.getElementById("loginForm");
const usernameInput   = document.getElementById("usernameInput");
const displayUsername = document.getElementById("displayUsername");
const logoutBtn       = document.getElementById("logoutBtn");
const todoInput       = document.getElementById("todoInput");
const prioritySelect  = document.getElementById("prioritySelect");
const addButton       = document.getElementById("addButton");
const todoList        = document.getElementById("todoList");
const taskCount       = document.getElementById("taskCount");
const emptyMessage    = document.getElementById("emptyMessage");
const loadingMessage  = document.getElementById("loadingMessage");
const countHigh       = document.getElementById("countHigh");
const countMedium     = document.getElementById("countMedium");
const countLow        = document.getElementById("countLow");

let currentUsername = null;
let tasks = [];
let draggedId = null;

// ============================================
// THEME
// ============================================
const themeToggle = document.getElementById("themeToggle");

function applyTheme(dark) {
  document.body.classList.toggle("dark-mode", dark);
  themeToggle.textContent = dark ? "☀️ Light" : "🌙 Dark";
  localStorage.setItem("theme", dark ? "dark" : "light");
}

applyTheme(localStorage.getItem("theme") === "dark");

themeToggle.addEventListener("click", function () {
  applyTheme(!document.body.classList.contains("dark-mode"));
});

// ============================================
// LOGIN
// ============================================
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = usernameInput.value.trim().toLowerCase();
  if (!username) return;
  currentUsername = username;
  loginScreen.style.display = "none";
  appScreen.style.display   = "flex";
  displayUsername.textContent = currentUsername;
  loadTasks();
});

logoutBtn.addEventListener("click", function () {
  currentUsername = null;
  tasks = [];
  todoList.innerHTML = "";
  appScreen.style.display   = "none";
  loginScreen.style.display = "flex";
  usernameInput.value = "";
});

// ============================================
// FIREBASE — Load
// ============================================
function loadTasks() {
  loadingMessage.style.display = "block";
  emptyMessage.style.display   = "none";
  todoList.innerHTML = "";

  db.ref("todos/" + currentUsername).get()
    .then(function (snapshot) {
      loadingMessage.style.display = "none";
      tasks = snapshot.exists() ? (snapshot.val().tasks || []) : [];
      renderAllTasks();
    })
    .catch(function (err) {
      loadingMessage.textContent = "⚠️ Could not load tasks. Check your connection.";
      console.error(err);
    });
}

// ============================================
// FIREBASE — Save
// ============================================
function saveTasks() {
  db.ref("todos/" + currentUsername).set({ tasks: tasks })
    .catch(function (err) { console.error("Save failed:", err); });
}

// ============================================
// RENDER
// ============================================
const priorityOrder = { high: 0, medium: 1, low: 2 };

function sortedTasks() {
  return [...tasks].sort(function (a, b) {
    return (priorityOrder[a.priority || "medium"] || 1) - (priorityOrder[b.priority || "medium"] || 1);
  });
}

function renderAllTasks() {
  todoList.innerHTML = "";
  sortedTasks().forEach(function (task) { renderTask(task); });
  updateSummary();
}

function updateDashboard() {
  countHigh.textContent   = tasks.filter(function (t) { return (t.priority || "medium") === "high"; }).length;
  countMedium.textContent = tasks.filter(function (t) { return (t.priority || "medium") === "medium"; }).length;
  countLow.textContent    = tasks.filter(function (t) { return (t.priority || "medium") === "low"; }).length;
}

function renderTask(task) {
  const li = document.createElement("li");
  li.setAttribute("data-id", task.id);
  li.setAttribute("data-priority", task.priority || "medium");

  // Drag handle
  const handle = document.createElement("span");
  handle.className = "drag-handle";
  handle.innerHTML = "⠿";
  handle.title = "Drag to reorder";

  // Priority badge — click to cycle
  const priorities = ["high", "medium", "low"];
  const badge = document.createElement("span");
  badge.className = "priority-badge " + (task.priority || "medium");
  badge.textContent = task.priority || "medium";
  badge.title = "Click to change priority";
  badge.style.cursor = "pointer";
  badge.addEventListener("click", function (e) {
    e.stopPropagation();
    const current = priorities.indexOf(task.priority || "medium");
    task.priority = priorities[(current + 1) % priorities.length];
    badge.className = "priority-badge " + task.priority;
    badge.textContent = task.priority;
    li.setAttribute("data-priority", task.priority);
    saveTasks();
    renderAllTasks();
  });

  // Task text
  const text = document.createElement("span");
  text.className = "task-text";
  text.textContent = task.text;

  // Delete button
  const del = document.createElement("button");
  del.className = "delete-btn";
  del.textContent = "Delete";
  del.setAttribute("aria-label", "Delete: " + task.text);
  del.addEventListener("click", function (e) {
    e.stopPropagation();
    tasks = tasks.filter(function (t) { return t.id !== task.id; });
    saveTasks();
    li.remove();
    updateSummary();
  });

  li.appendChild(handle);
  li.appendChild(badge);
  li.appendChild(text);
  li.appendChild(del);
  todoList.appendChild(li);

  // Drag & drop
  attachDrag(li, task.id);
}

function updateSummary() {
  taskCount.textContent = tasks.length;
  emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
  updateDashboard();
}

// ============================================
// ADD TASK
// ============================================
addButton.addEventListener("click", addTask);
todoInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = todoInput.value.trim();
  if (!text) return;

  const newTask = {
    id:       Date.now(),
    text:     text,
    priority: prioritySelect.value
  };

  tasks.push(newTask);
  saveTasks();
  renderTask(newTask);
  updateSummary();

  todoInput.value = "";
  todoInput.focus();
}

// ============================================
// DRAG & DROP
// ============================================
function attachDrag(li, taskId) {
  li.setAttribute("draggable", "true");

  li.addEventListener("dragstart", function () {
    draggedId = taskId;
    setTimeout(function () { li.classList.add("dragging"); }, 0);
  });

  li.addEventListener("dragend", function () {
    li.classList.remove("dragging");
    document.querySelectorAll("#todoList li").forEach(function (el) {
      el.classList.remove("drag-over");
    });
  });

  li.addEventListener("dragover", function (e) {
    e.preventDefault();
    if (draggedId === taskId) return;
    document.querySelectorAll("#todoList li").forEach(function (el) {
      el.classList.remove("drag-over");
    });
    li.classList.add("drag-over");
  });

  li.addEventListener("drop", function (e) {
    e.preventDefault();
    if (draggedId === taskId) return;

    const fromIndex = tasks.findIndex(function (t) { return t.id === draggedId; });
    const toIndex   = tasks.findIndex(function (t) { return t.id === taskId; });

    if (fromIndex === -1 || toIndex === -1) return;

    const moved = tasks.splice(fromIndex, 1)[0];
    tasks.splice(toIndex, 0, moved);

    saveTasks();
    renderAllTasks();
  });
}
