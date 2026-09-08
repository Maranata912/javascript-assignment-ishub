let tasks = [];
let filter = "all";
const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");
const showAllBtn = document.getElementById("showAllBtn");
const showActiveBtn = document.getElementById("showActiveBtn");
const showDoneBtn = document.getElementById("showDoneBtn");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const clearDoneBtn = document.getElementById("clearDoneBtn");
function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function addTask() {
    const text = taskInput.value.trim();
    const date = dueDate.value;
    if (text === "") {
        alert("Please enter a task.");
        taskInput.focus();
        return;
    }
    const newTask = {
        id: Date.now(),
        text: text,
        dueDate: date,
        completed: false
    };
    tasks.push(newTask);
    taskInput.value = "";
    dueDate.value = "";
    saveTasks();
    render();
    taskInput.focus();
}
function toggleTask(id) {
    tasks = tasks.map(function(task) {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }
        return task;
    });
    saveTasks();
    render();
}
function deleteTask(id) {
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });
    saveTasks();
    render();
}
function clearDone() {
    tasks = tasks.filter(function(task) {
        return !task.completed;
    });
    saveTasks();
    render();
}
function updateCounter() {
    const activeCount = tasks.filter(function(task) {
        return !task.completed;
    }).length;
    const totalCount = tasks.length;
    counter.textContent = `${activeCount} active / ${totalCount} total`;
}
function render() {
    let visibleTasks = tasks;
    if (filter === "active") {
        visibleTasks = tasks.filter(function(task) {
            return !task.completed;
        });
    }
    if (filter === "done") {
        visibleTasks = tasks.filter(function(task) {
            return task.completed;
        });
    }
    taskList.innerHTML = "";
    visibleTasks.forEach(function(task) {
        const li = document.createElement("li");
        li.className = "task-item";
        if (task.completed) {
            li.classList.add("completed");
        }
        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;
        if (task.dueDate) {
            span.textContent += ` - Due: ${task.dueDate}`;
        }
        const doneButton = document.createElement("button");
        doneButton.className = "done-btn";
        doneButton.textContent = task.completed ? "Undo" : "Done";
        doneButton.addEventListener("click", function() {
            toggleTask(task.id);
        });
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
        });
        li.appendChild(span);
        li.appendChild(doneButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
    updateCounter();
}
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});
showAllBtn.addEventListener("click", function() {
    filter = "all";
    render();
});
showActiveBtn.addEventListener("click", function() {
    filter = "active";
    render();
});
showDoneBtn.addEventListener("click", function() {
    filter = "done";
    render();
});
clearDoneBtn.addEventListener("click", function() {
    clearDone();
});
loadTasks();
render();