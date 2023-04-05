// // Get references to DOM elements
export const dom = {
  tasksList: document.querySelector("#tasks_list"),
  taskTemplate: document.querySelector("#task_template"),
  doneCount: document.querySelector("#done_count"),
  totalCount: document.querySelector("#total_count"),
};

// Initialize data. Do we have anything stored?
if (localStorage.tasks) {
  let tasks = JSON.parse(localStorage.tasks);
  for (let task of tasks) {
    addItem(task);
  }
} else {
  // Add one empty task to start with
  addItem();
}

dom.tasksList.addEventListener("keydown", (e) => {
  // ...
});

// Store data when page is closed
globalThis.addEventListener("beforeunload", () => {
  localStorage.tasks = JSON.stringify(getData());
});

let dragged;

function addTaskEventListeners(element) {
  element.querySelector(".title").addEventListener("focus", (event) => {
    element.setAttribute("draggable", "false");
  });

  element.querySelector(".title").addEventListener("blur", (event) => {
    element.setAttribute("draggable", "true");
  });
}

dom.tasksList.addEventListener("dragstart", (event) => {
  if (!event.target.closest("li")) return;
  event.target.closest("li").classList.add("dragging");
  dragged = event.target.closest("li");
});

dom.tasksList.addEventListener("dragover", (event) => {
  event.preventDefault();
  if (!event.target.closest("li")) return;
  event.target.closest("li").classList.add("drag-over");
});

dom.tasksList.addEventListener("dragleave", (event) => {
  if (!event.target.closest("li")) return;
  event.target.closest("li").classList.remove("drag-over");
});

dom.tasksList.addEventListener("drop", (event) => {
  event.preventDefault();
  if (!event.target.closest("li")) return;

  const dropTarget = event.target.closest("li");
  const dropTargetIndex = Array.from(dropTarget.parentNode.children).indexOf(
    dropTarget
  );
  const draggedIndex = Array.from(dragged.parentNode.children).indexOf(dragged);

  if (dropTargetIndex > draggedIndex) {
    dropTarget.insertAdjacentElement("afterend", dragged);
  } else {
    dropTarget.insertAdjacentElement("beforebegin", dragged);
  }

  dropTarget.classList.remove("drag-over");
});

dom.tasksList.addEventListener("dragend", (event) => {
  if (!event.target.closest("li")) return;
  event.target.closest("li").classList.remove("dragging");
});

export function addItem(data = { done: false, title: "" }) {
  dom.tasksList.insertAdjacentHTML("beforeend", dom.taskTemplate.innerHTML);

  let element = dom.tasksList.lastElementChild;
  addTaskEventListeners(element);

  element.querySelector(".title").value = data.title;

  let done = element.querySelector(".done");
  done.checked = data.done;

  done.addEventListener("input", (event) => {
    updateDoneCount();
  });

  element.querySelector(".delete").addEventListener("click", (event) => {
    let previous = element.closest("li").previousElementSibling;
    element.remove();
    focusTask(previous);
    updateCounts();
  });

  updateCounts();
  focusTask(element);
}

export function clearCompleted() {
  for (let ls of dom.tasksList.querySelectorAll(
    "li:has(.done:checked) .delete"
  )) {
    ls.click();
  }
}

export function focusTask(element) {
  element?.closest("li")?.querySelector("input.title").focus();
}

export function getData() {
  return Array.from(dom.tasksList.children).map((element) => ({
    title: element.querySelector(".title").value,
    done: element.querySelector(".done").checked,
  }));
}

function updateDoneCount() {
  dom.doneCount.textContent =
    dom.tasksList.querySelectorAll(".done:checked").length;
}

function updateTotalCount() {
  dom.totalCount.textContent = dom.tasksList.children.length;
}

// Update expressions etc when data changes
function updateCounts() {
  updateDoneCount();
  updateTotalCount();
}
