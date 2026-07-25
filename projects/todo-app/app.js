const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");

// Load saved tasks or start with an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks in localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update the task count and empty message
function updateTaskSummary() {
    const numberOfTasks = tasks.length;

    if (numberOfTasks === 1) {
        taskCount.textContent = "1 task";
    } else {
        taskCount.textContent = `${numberOfTasks} tasks`;
    }

    if (numberOfTasks === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }
}

// Display one task
function displayTask(task) {
    const li = document.createElement("li");

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    taskText.classList.add("task-text");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.type = "button";

    deleteButton.setAttribute(
        "aria-label",
        `Delete task: ${task.text}`
    );

    deleteButton.addEventListener("click", function () {
        tasks = tasks.filter(function (savedTask) {
            return savedTask.id !== task.id;
        });

        saveTasks();
        li.remove();
        updateTaskSummary();

        todoInput.focus();
    });

    li.appendChild(taskText);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
}

// Display saved tasks when the page loads
tasks.forEach(function (task) {
    displayTask(task);
});

updateTaskSummary();

// Add a task when the form is submitted
todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = todoInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        todoInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText
    };

    tasks.push(newTask);

    saveTasks();
    displayTask(newTask);
    updateTaskSummary();

    todoInput.value = "";
    todoInput.focus();
});
