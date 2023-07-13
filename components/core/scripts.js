import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const inputElement = document.querySelector(".newTaskInput");
const addButton = document.querySelector(".newTaskButton");
const tasksContainer = document.querySelector(".tasksContainer");
const completedContainer = document.querySelector(".completedTasksContainer");
const editTaskContainer = document.querySelector(".editTaskContainer");
const deletedContainer = document.querySelector(".deletedContainer");
const editButton = document.querySelector(".editButton");
const cancelBtn = document.querySelector(".cancelBtn");
const editInputElement = document.querySelector(".editTaskInput");
const saveEditButton = document.querySelector(".saveEditTaskButton");
const closeTrashButtom = document.querySelector(".closeTrashBtn");
const modal = document.querySelector(".trashContainer");
const openTrashButton = document.querySelector(".openTrash");
const quitButton = document.querySelector(".quitButton");
const modalQuit = document.querySelector(".modalQuit");
const exitButton = document.querySelector("#exitButton");
const stayButton = document.querySelector("#stayButton");

let todoList = [];
let completedList = [];
let deletedList = [];

const validateInput = () => inputElement.value.trim().length > 0;

const formatDateObject = (dateObject) => {
  let options = {
    dateStyle: "short",
    timeStyle: "short",
  };

  const formatDate = new Intl.DateTimeFormat("pt-BR", options);
  return formatDate.format(dateObject);
};

const renderTodo = (todo) => {
  if (!document.querySelector(`div[todoId="${todo.id}"]`)) {
    const template = document.querySelector("#rowTemplate");

    const clone = template.content.cloneNode(true);

    const taskItemContainer = clone.querySelector("div");
    taskItemContainer.setAttribute("todoId", todo.id);

    const taskContent = clone.querySelector("p");
    taskContent.innerText = todo.title;

    const registertime = clone.querySelector("h4 > span");
    registertime.innerText = formatDateObject(todo.time);

    const sectionElement = clone.querySelector(".buttonsTasks");

    const completeButton = document.createElement("button");
    completeButton.innerHTML =
      '<i class="fa-solid fa-check-double checkButton"></i>';
    completeButton.classList.add("taskManipulationButton");
    sectionElement.appendChild(completeButton);

    completeButton.addEventListener("click", () =>
      handleCompleteClick(todo.id)
    );

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-solid fa-pen editButton"></i>';
    editButton.classList.add("taskManipulationButton");
    sectionElement.appendChild(editButton);

    editButton.addEventListener("click", () =>
      editTask(todo.id, todo.title, todo.time)
    );

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash deleteButton"></i>';
    deleteButton.classList.add("taskManipulationButton");
    sectionElement.appendChild(deleteButton);

    deleteButton.addEventListener("click", () => handleDeleteClick(todo.id));

    tasksContainer.appendChild(clone);

    inputElement.value = "";
    inputElement.focus();
    updateLocalStorage();
  } else {
    const taskItemContainer = document.querySelector(
      `div[todoId="${todo.id}"]`
    );
    const paragraph = taskItemContainer.querySelector("p");

    if (todo.completed && !paragraph.classList.contains("completed")) {
      paragraph.classList.add("completed");
    } else {
      paragraph.classList.remove("completed");
      todo.completed = false;
    }
    paragraph.innerText = todo.title;
  }
};

const renderCompletedTask = (todo) => {
  if (!document.querySelector(`div[todoId="${todo.id}"]`)) {
    const template = document.querySelector("#rowTemplate");
    const clone = template.content.cloneNode(true);

    const completedItem = clone.querySelector("div");
    completedItem.setAttribute("todoId", todo.id);

    const taskContent = clone.querySelector("p");
    taskContent.innerText = todo.title;

    const registertime = clone.querySelector("h4 > span");
    registertime.innerText = formatDateObject(todo.time);

    const sectionElement = clone.querySelector(".buttonsTasks");

    const completeButton = document.createElement("button");
    completeButton.innerHTML = '<i class="fa-solid fa-rotate checkButton"></i>';
    completeButton.classList.add("taskManipulationButton");
    sectionElement.appendChild(completeButton);

    completeButton.addEventListener("click", () =>
      handleRestoreCompletedTask(todo.id)
    );

    completedContainer.appendChild(clone);
    updateLocalStorage();
  }
};

const renderDeletedTask = (todo) => {
  if (!document.querySelector(`div[todoId="${todo.id}"]`)) {
    const template = document.querySelector("#rowTemplate");
    const clone = template.content.cloneNode(true);

    const deletedItem = clone.querySelector("div");
    deletedItem.classList.add("deletedItem");
    deletedItem.classList.add("divisor");
    deletedItem.setAttribute("todoId", todo.id);

    const taskContent = clone.querySelector("p");
    taskContent.innerText = todo.title;

    const registertime = clone.querySelector("h4 > span");
    registertime.innerText = formatDateObject(todo.time);

    const sectionElement = clone.querySelector(".buttonsTasks");

    const completeButton = document.createElement("button");
    completeButton.innerHTML = '<i class="fa-solid fa-rotate checkButton"></i>';
    completeButton.classList.add("taskManipulationButton");
    sectionElement.appendChild(completeButton);

    completeButton.addEventListener("click", () =>
      handleRestoreDeletedTask(todo.id)
    );

    deletedContainer.appendChild(deletedItem);
    updateLocalStorage();
  }
};

const handleAddTask = () => {
  const newTodo = createTodo(inputElement.value);

  if (!newTodo) {
    return inputElement.classList.add("error");
  }

  renderTodo(newTodo);
};

function createTodo(title) {
  if (title.trim().length === 0) {
    return false;
  }

  const newTodo = {
    id: uuidv4(),
    time: new Date(),
    completed: false,
    hidden: false,
    title,
  };

  todoList.push(newTodo);

  return newTodo;
}

const handleCompleteClick = (todoId) => {
  document.querySelector(`div[todoID="${todoId}"]`).remove();

  completedList.push(todoList.find((todo) => todo.id === todoId));
  todoList = todoList.filter((todo) => todo.id !== todoId);
  renderCompletedTask(completedList.find((todo) => todo.id === todoId));
  updateLocalStorage();
};

const handleRestoreCompletedTask = (todoId) => {
  document.querySelector(`div[todoID="${todoId}"]`).remove();
  todoList.push(completedList.find((todo) => todo.id === todoId));
  completedList = completedList.filter((todo) => todo.id !== todoId);

  const todo = todoList.find((todo) => todo.id === todoId);

  renderTodo(todo);
  updateLocalStorage();
};

const handleRestoreDeletedTask = (todoId) => {
  document.querySelector(`div[todoID="${todoId}"]`).remove();
  todoList.push(deletedList.find((todo) => todo.id === todoId));
  deletedList = deletedList.filter((todo) => todo.id !== todoId);

  const todo = todoList.find((todo) => todo.id === todoId);

  renderTodo(todo);
  updateLocalStorage();
};

const editTask = (todoID, todoTitle) => {
  editInputElement.value = todoTitle;
  editTaskContainer.classList.toggle("hide");
  editInputElement.focus();

  const handleClick = () => {
    todoList = todoList.map((todo) => {
      if (todo.id === todoID) {
        todo.title = editInputElement.value;
        todo.time = new Date();
      }
      return todo;
    });
    updateLocalStorage();
    renderTodo(todoList.find((todo) => todo.id === todoID));

    editTaskContainer.classList.toggle("hide");
    saveEditButton.removeEventListener("click", handleClick);
  };

  saveEditButton.addEventListener("click", handleClick);
};

const handleDeleteClick = (todoId) => {
  deletedList.push(todoList.find((todo) => todo.id === todoId));
  todoList = todoList.filter((todo) => todo.id !== todoId);
  document.querySelector(`div[todoID="${todoId}"]`).remove();
  renderDeletedTask(deletedList.find((todo) => todo.id === todoId));
  updateLocalStorage();
};

const handleInputChange = () => {
  const inputIsValid = validateInput();

  if (inputIsValid) {
    return inputElement.classList.remove("error");
  }
};

const updateLocalStorage = () => {
  const parsedTodos = todoList.map((todo) => ({
    ...todo,
    time: todo.time.getTime(),
    hidden: false,
    completed: false,
  }));
  localStorage.setItem("tasks", JSON.stringify(parsedTodos));

  const parsedCompletedTodos = completedList.map((todo) => ({
    ...todo,
    completed: true,
    hidden: true,
    time: todo.time.getTime(),
  }));
  localStorage.setItem("completedTasks", JSON.stringify(parsedCompletedTodos));

  const parsedDeletedTodos = deletedList.map((todo) => ({
    ...todo,
    hidden: true,
    time: todo.time.getTime(),
  }));
  localStorage.setItem("deletedTasks", JSON.stringify(parsedDeletedTodos));
};

const refreshTasksFromLocalStorage = () => {
  const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));
  if (!tasksFromLocalStorage) return;

  todoList = tasksFromLocalStorage.map((todo) => ({
    ...todo,
    time: new Date(todo.time),
  }));
  todoList.forEach(renderTodo);

  const currentCompletedTasks = JSON.parse(
    localStorage.getItem("completedTasks")
  );
  if (!currentCompletedTasks) return;

  completedList = currentCompletedTasks.map((todo) => ({
    ...todo,
    time: new Date(todo.time),
  }));
  completedList.forEach(renderCompletedTask);

  const currentDeletedTasks = JSON.parse(localStorage.getItem("deletedTasks"));
  if (!currentDeletedTasks) return;

  deletedList = currentDeletedTasks.map((todo) => ({
    ...todo,
    time: new Date(todo.time),
  }));
  deletedList.forEach(renderDeletedTask);
};

const removeTask = () => {
  editTaskContainer.classList.toggle("hide");
  editInputElement.value = "";
};

addButton.addEventListener("click", () => {
  handleAddTask();
});
inputElement.addEventListener("change", () => handleInputChange());
cancelBtn.addEventListener("click", () => removeTask());

openTrashButton.onclick = function () {
  modal.showModal();
};
closeTrashButtom.onclick = function () {
  modal.close();
};

quitButton.onclick = function () {
  modalQuit.showModal();
};

exitButton.onclick = function () {
  location.href = "../../index.html";
};

stayButton.onclick = function () {
  modalQuit.close();
};

refreshTasksFromLocalStorage();
