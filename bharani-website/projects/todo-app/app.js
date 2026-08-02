// ============================================
// app.js — Todo App with Firebase Cloud Sync
// ============================================

// ⚠️  REPLACE the values below with your own Firebase project config.
// Get them from: https://console.firebase.google.com
//   → Your Project → ⚙️ Project Settings → Your apps → Web app → firebaseConfig

const firebaseConfig = {
  apiKey:            "AIzaSyB1t-uQwdpc6YMMHcDbAkVexlOqm3B5hRM",
  authDomain:        "bharani-s-website.firebaseapp.com",
  databaseURL:       "https://bharani-s-website-default-rtdb.firebaseio.com",
  projectId:         "bharani-s-website",
  storageBucket:     "bharani-s-website.firebasestorage.app",
  messagingSenderId: "315781092514",
  appId:             "1:315781092514:web:d0bed98d5f4c8b7cda33fb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ============================================
// DOM references
// ============================================
const loginScreen     = document.getElementById("loginScreen");
const appScreen       = document.getElementById("appScreen");
const loginForm       = document.getElementById("loginForm");
const usernameInput   = document.getElementById("usernameInput");
const displayUsername = document.getElementById("displayUsername");
const logoutBtn       = document.getElementById("logoutBtn");
const todoForm        = document.getElementById("todoForm");
const todoInput       = document.getElementById("todoInput");
const todoList        = document.getElementById("todoList");
const taskCount       = document.getElementById("taskCount");
const emptyMessage    = document.getElementById("emptyMessage");
const loadingMessage  = document.getElementById("loadingMessage");

let currentUsername = null;
let tasks = [];

// ============================================
// LOGIN
// ============================================
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = usernameInput.value.trim().toLowerCase();
  if (!username) return;
  currentUsername = username;
  showApp();
});

function showApp() {
  loginScreen.style.display = "none";
  appScreen.style.display   = "block";
  displayUsername.textContent = currentUsername;
  loadTasksFromFirebase();
}

logoutBtn.addEventListener("click", function () {
  currentUsername = null;
  tasks = [];
  todoList.innerHTML = "";
  appScreen.style.display   = "none";
  loginScreen.style.display = "flex";
  usernameInput.value = "";
});

// ============================================
// FIREBASE — Load tasks
// ============================================
function loadTasksFromFirebase() {
  loadingMessage.style.display = "block";
  emptyMessage.style.display   = "none";
  todoList.innerHTML = "";

  db.ref("todos/" + currentUsername).get()
    .then(function (snapshot) {
      loadingMessage.style.display = "none";
      tasks = snapshot.exists() ? (snapshot.val().tasks || []) : [];
      tasks.forEach(displayTask);
      updateTaskSummary();
    })
    .catch(function (err) {
      loadingMessage.textContent = "⚠️ Could not load tasks. Check your Firebase config.";
      console.error(err);
    });
}

// ============================================
// FIREBASE — Save tasks
// ============================================
function saveTasksToFirebase() {
  db.ref("todos/" + currentUsername).set({ tasks: tasks })
    .catch(function (err) {
      console.error("Save failed:", err);
    });
}

// ============================================
// TASK DISPLAY
// ============================================
function displayTask(task) {
  const li = document.createElement("li");

  const taskText = document.createElement("span");
  taskText.textContent = task.text;
  taskText.classList.add("task-text");

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-btn");
  deleteButton.type = "button";
  deleteButton.setAttribute("aria-label", `Delete task: ${task.text}`);

  deleteButton.addEventListener("click", function () {
    tasks = tasks.filter(function (t) { return t.id !== task.id; });
    saveTasksToFirebase();
    li.remove();
    updateTaskSummary();
    todoInput.focus();
  });

  li.appendChild(taskText);
  li.appendChild(deleteButton);
  todoList.appendChild(li);
}

function updateTaskSummary() {
  taskCount.textContent = tasks.length === 1 ? "1 task" : `${tasks.length} tasks`;
  emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
}

// ============================================
// ADD TASK
// ============================================
todoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const taskText = todoInput.value.trim();
  if (!taskText) return;

  const newTask = { id: Date.now(), text: taskText };
  tasks.push(newTask);
  saveTasksToFirebase();
  displayTask(newTask);
  updateTaskSummary();

  todoInput.value = "";
  todoInput.focus();
});
