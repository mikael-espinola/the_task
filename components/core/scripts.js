import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

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
const closeTrashButtom = document.querySelector(".closeTrashBtn")
const modal = document.querySelector(".trashContainer")
const openTrashButton = document.querySelector(".openTrash")
const quitButton = document.querySelector(".quitButton")
const modalQuit = document.querySelector(".modalQuit")
const exitButton = document.querySelector("#exitButton")
const stayButton = document.querySelector("#stayButton")


let todoList = []
let completedList = [];
let deletedList = [];


const validateInput = () => inputElement.value.trim().length > 0;

const formatDateObject = (dateObject) => {
    let options = {
        dateStyle: 'short',
        timeStyle: 'short'
    };

    const formatDate = new Intl.DateTimeFormat("pt-BR", options);
    const currentDate = `<i class="fa-solid fa-clock"></i> ${formatDate.format(dateObject)}`;

    return currentDate;
};

const renderTodo = (todo) => {
    if (!document.querySelector(`div[todoId="${todo.id}"]`)) {
        const taskItemContainer = document.createElement('div');
        taskItemContainer.classList.add("taskItem");
        taskItemContainer.classList.add("divisor");
        taskItemContainer.setAttribute('todoId', todo.id)

        const taskContent = document.createElement('p');
        taskContent.classList.add('task');
        taskContent.classList.add('completedTask');
        taskContent.innerText = todo.title;
        taskItemContainer.appendChild(taskContent);

        const buttonsContainer = document.createElement('section');
        buttonsContainer.classList.add("buttonsTasks");
        buttonsContainer.classList.add("buttons");
        taskItemContainer.appendChild(buttonsContainer);

        const completeButton = document.createElement('i');
        completeButton.classList.add('fa-solid');
        completeButton.classList.add('fa-check-double');
        buttonsContainer.appendChild(completeButton);

        completeButton.addEventListener("click", () => handleCompleteClick(todo.id))

        const editButton = document.createElement('i');
        editButton.classList.add('fa-solid');
        editButton.classList.add('fa-pen');
        editButton.classList.add('editButton');
        buttonsContainer.appendChild(editButton);

        editButton.addEventListener("click", () => editTask(todo.id, todo.title, todo.time));

        const deleteButton = document.createElement('i');
        deleteButton.classList.add('fa-regular');
        deleteButton.classList.add('fa-trash-can');
        buttonsContainer.appendChild(deleteButton);

        deleteButton.addEventListener("click", () => handleDeleteClick(todo.id))

        const timeClockItem = document.createElement('footer');
        timeClockItem.classList.add("clock");
        timeClockItem.classList.add("footer");
        taskItemContainer.appendChild(timeClockItem);

        let registertime = document.createElement('h4');
        registertime.classList.add("createdAt");
        registertime.innerHTML = formatDateObject(todo.time);
        timeClockItem.appendChild(registertime)

        tasksContainer.appendChild(taskItemContainer);

        inputElement.value = "";
        inputElement.focus();
        updateLocalStorage();
    } else {
        const taskItemContainer = document.querySelector(`div[todoId="${todo.id}"]`);
        const paragraph = taskItemContainer.querySelector('p')

        if (todo.completed && !paragraph.classList.contains('completed')) {
            paragraph.classList.add('completed');
        } else {
            paragraph.classList.remove('completed');
            todo.completed = false;
        }
        paragraph.innerText = todo.title;
    }
}

const renderCompletedTask = (todo) => {
    if (!document.querySelector(`div[todoId="${todo.id}"]`)) {
        const completedItem = document.createElement('div');
        completedItem.classList.add("completedItem");
        completedItem.classList.add("divisor");
        completedItem.setAttribute('todoId', todo.id)

        const taskContent = document.createElement('p');
        taskContent.classList.add('task');
        taskContent.innerText = todo.title;
        completedItem.appendChild(taskContent);

        const buttonsContainer = document.createElement('section');
        buttonsContainer.classList.add("buttonsTasks");
        buttonsContainer.classList.add("buttons");
        completedItem.appendChild(buttonsContainer);

        const completeButton = document.createElement('i');
        completeButton.classList.add('fa-solid');
        completeButton.classList.add('fa-rotate');
        buttonsContainer.appendChild(completeButton);

        completeButton.addEventListener("click", () => handleRestoreCompletedTask(todo.id))

        const timeClockItem = document.createElement('footer');
        timeClockItem.classList.add("clock");
        timeClockItem.classList.add("footer");
        completedItem.appendChild(timeClockItem);

        let registertime = document.createElement('h4');
        registertime.classList.add("createdAt");
        registertime.innerHTML = formatDateObject(todo.time);
        timeClockItem.appendChild(registertime)
        
        completedContainer.appendChild(completedItem);
        updateLocalStorage();
    }
}

const renderDeletedTask = (todo) => {
    if (!document.querySelector(`div[todoId="${todo.id}"]`)) {
        const deletedItem = document.createElement('div');
        deletedItem.classList.add("deletedItem");
        deletedItem.classList.add("divisor");
        deletedItem.setAttribute('todoId', todo.id)

        const taskContent = document.createElement('p');
        taskContent.classList.add('task');
        taskContent.innerText = todo.title;
        deletedItem.appendChild(taskContent);

        const buttonsContainer = document.createElement('section');
        buttonsContainer.classList.add("buttonsTasks");
        buttonsContainer.classList.add("buttons");
        deletedItem.appendChild(buttonsContainer);

        const completeButton = document.createElement('i');
        completeButton.classList.add('fa-solid');
        completeButton.classList.add('fa-rotate');
        buttonsContainer.appendChild(completeButton);

        completeButton.addEventListener("click", () => handleRestoreDeletedTask(todo.id))

        const timeClockItem = document.createElement('footer');
        timeClockItem.classList.add("clock");
        timeClockItem.classList.add("footer");
        deletedItem.appendChild(timeClockItem);

        let registertime = document.createElement('h4');
        registertime.classList.add("createdAt");
        registertime.innerHTML = formatDateObject(todo.time);
        timeClockItem.appendChild(registertime)
        
        deletedContainer.appendChild(deletedItem);
        updateLocalStorage();
    }
}

const handleAddTask = () => {
    const newTodo = createTodo(inputElement.value)

    if (!newTodo) {
        return inputElement.classList.add("error");
    }

    renderTodo(newTodo)
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
        title
    };

    todoList.push(newTodo)

    return newTodo;
}

const handleCompleteClick = (todoId) => {

    document.querySelector(`div[todoID="${todoId}"]`).remove();

    completedList.push(todoList.find((todo) => todo.id === todoId));
    todoList = todoList.filter((todo) => todo.id !== todoId);
    renderCompletedTask(completedList.find((todo) => todo.id === todoId))
    updateLocalStorage();
};

const handleRestoreCompletedTask = (todoId) => {

    document.querySelector(`div[todoID="${todoId}"]`).remove();
    todoList.push(completedList.find((todo) => todo.id === todoId));
    completedList = completedList.filter((todo) => todo.id !== todoId);

    const todo = todoList.find((todo) => todo.id === todoId);

    renderTodo(todo);
    updateLocalStorage();

}

const handleRestoreDeletedTask = (todoId) => {

    document.querySelector(`div[todoID="${todoId}"]`).remove();
    todoList.push(deletedList.find((todo) => todo.id === todoId));
    deletedList = deletedList.filter((todo) => todo.id !== todoId);

    const todo = todoList.find((todo) => todo.id === todoId);

    renderTodo(todo);
    updateLocalStorage();
}

const editTask = (todoID, todoTitle) => {
    editInputElement.value = todoTitle
    editTaskContainer.classList.toggle("hide");
    editInputElement.focus();

    const handleClick = () => {

        todoList = todoList.map((todo) => {
            if (todo.id === todoID) {
                todo.title = editInputElement.value
                todo.time = new Date()
            }
            return todo;
        })
        updateLocalStorage()
        renderTodo(todoList.find((todo) => todo.id === todoID))

        editTaskContainer.classList.toggle("hide");
        saveEditButton.removeEventListener("click", handleClick)
    }

    saveEditButton.addEventListener("click", handleClick)
}

const handleDeleteClick = (todoId) => {

    deletedList.push(todoList.find((todo) => todo.id === todoId));
    todoList = todoList.filter((todo) => todo.id !== todoId);
    document.querySelector(`div[todoID="${todoId}"]`).remove();
    renderDeletedTask(deletedList.find((todo) => todo.id === todoId))
    updateLocalStorage();
};

const handleInputChange = () => {
    const inputIsValid = validateInput();

    if (inputIsValid) {
        return inputElement.classList.remove("error");
    };
};

const updateLocalStorage = () => {
    const parsedTodos = todoList.map((todo) => ({ ...todo, time: todo.time.getTime(), hidden: false, completed: false }));
    localStorage.setItem('tasks', JSON.stringify(parsedTodos));

    const parsedCompletedTodos = completedList.map((todo) => ({ ...todo, completed: true, hidden: true, time: todo.time.getTime() }));
    localStorage.setItem('completedTasks', JSON.stringify(parsedCompletedTodos))

    const parsedDeletedTodos = deletedList.map((todo) => ({ ...todo, hidden: true, time: todo.time.getTime() }));
    localStorage.setItem('deletedTasks', JSON.stringify(parsedDeletedTodos))
};

const refreshTasksFromLocalStorage = () => {
    const tasksFromLocalStorage = JSON.parse(localStorage.getItem('tasks'));
    if (!tasksFromLocalStorage) return;

    todoList = tasksFromLocalStorage.map((todo) => ({ ...todo, time: (new Date(todo.time)) }))
    todoList.forEach(renderTodo)

    const currentCompletedTasks = JSON.parse(localStorage.getItem('completedTasks'));
    if (!currentCompletedTasks) return;

    completedList = currentCompletedTasks.map((todo) => ({ ...todo, time: (new Date(todo.time)) }))
    completedList.forEach(renderCompletedTask);

    const currentDeletedTasks = JSON.parse(localStorage.getItem('deletedTasks'));
    if (!currentDeletedTasks) return;

    deletedList = currentDeletedTasks.map((todo) => ({ ...todo, time: (new Date(todo.time)) }))
    deletedList.forEach(renderDeletedTask)
};

const removeTask = () => {
    editTaskContainer.classList.toggle("hide");
    editInputElement.value = "";
}

addButton.addEventListener("click", () => {
    handleAddTask()
});
inputElement.addEventListener("change", () => handleInputChange());
cancelBtn.addEventListener("click", () => removeTask());

openTrashButton.onclick = function () {
    console.log("clicado!")
    modal.showModal()
}
closeTrashButtom.onclick = function () { 
    modal.close()
}

quitButton.onclick = function() {
    modalQuit.showModal();
}

exitButton.onclick = function () { 
    location.href = "../../index.html"
}

stayButton.onclick = function () {
    modalQuit.close();
}



refreshTasksFromLocalStorage();