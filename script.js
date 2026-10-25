
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.querySelector(".tasks");

let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function renderTasks() {
    const taskSummary = document.getElementById("taskSummary");
const remainingTasks = tasks.filter(task => !task.completed).length;

taskSummary.textContent = "งานที่เหลือ: " + remainingTasks + " งาน";

    taskList.querySelectorAll(".task-item").forEach(item => item.remove());
    taskList.querySelectorAll(".empty-message").forEach(item => item.remove());

        const filteredTasks = tasks.filter(task => {
    if (currentFilter === "active") {
        return !task.completed;
    }

    if (currentFilter === "completed") {
        return task.completed;
    }

    return true;
});

if (filteredTasks.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "ไม่มีงานในรายการนี้ 🌷";
    emptyMessage.className = "empty-message";
    taskList.appendChild(emptyMessage);
}

    filteredTasks.forEach(task => {

        const taskItem = document.createElement("div");
        taskItem.className = "task-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function () {
        task.completed = checkbox.checked;

        if (task.completed) {
        taskName.style.textDecoration = "line-through";
        } else {
        taskName.style.textDecoration = "none";
        }

    saveTasks();
});

        const taskName = document.createElement("span");
        taskName.textContent = task.text;
       
        if (task.date) {
    const taskDateText = document.createElement("small");
    const dateParts = task.date.split("-");

    taskDateText.textContent =
        "กำหนดส่ง: " + dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.date + "T00:00:00");
    const daysLeft = Math.round(
        (dueDate - today) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft >= 0 && daysLeft <= 3 && !task.completed) {
        taskDateText.classList.add("task-date-warning");
    }

    taskItem.appendChild(taskDateText);
}

        if (task.completed) {
            taskName.style.textDecoration = "line-through";
        }

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "ลบ";
        deleteButton.className = "delete-button";

       deleteButton.addEventListener("click", function () {
    const confirmDelete = confirm("ต้องการลบงานนี้ใช่ไหม?");

    if (confirmDelete) {
        tasks = tasks.filter(item => item.id !== task.id);
        saveTasks();
        renderTasks();
    }
});

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskName);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);
    });
}

addTaskButton.addEventListener("click", function () {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("กรุณาพิมพ์ชื่องานก่อน!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: taskText,
        date: taskDate.value,
        completed: false
    });

    saveTasks();
    renderTasks();
    taskInput.value = "";
    taskDate.value = "";
});

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTaskButton.click();
    }
});


renderTasks();
document.querySelectorAll(".filter-button").forEach(button => {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        document.querySelectorAll(".filter-button").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});

document.querySelector('.filter-button[data-filter="all"]').classList.add("active");


const clearCompletedButton = document.getElementById("clearCompletedButton");

clearCompletedButton.addEventListener("click", function () {
    const confirmClear = confirm("ต้องการลบงานที่เสร็จแล้วทั้งหมดใช่ไหม?");

    if (confirmClear) {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    }
});
