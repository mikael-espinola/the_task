import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const inputElement = document.querySelector(".newTaskInput");
const addButton = document.querySelector(".newTaskButton");
const tasksContainer = document.querySelector(".tasksContainer");
const editTaskContainer = document.querySelector(".editTaskContainer");
const editButton = document.querySelector(".editButton");
const cancelBtn = document.querySelector(".cancelBtn");
const editInputElement = document.querySelector(".editTaskInput");
const saveEditButton = document.querySelector(".saveEditTaskButton");

let todoList = []


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

const handleAddTask = () => {
    const newTodo = createTodo(inputElement.value)

    if (!newTodo) {
        return inputElement.classList.add("error");
    }
    console.log(newTodo)

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

    todoList = todoList.map((todo) => {
        if (todo.id === todoId) {
            return { ...todo, completed: true }
        }
        return todo
    })
    renderTodo(todoList.find((todo) => todo.id === todoId))
    updateLocalStorage();
};

const editTask = (todoID, todoTitle) => {
    editInputElement.value = todoTitle
    editTaskContainer.classList.toggle("hide");
    editInputElement.focus();

    const handleClick = () => {
        console.log("editado!")
        
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

    todoList = todoList.filter((todo) => todo.id !== todoId);
    document.querySelector(`div[todoID="${todoId}"]`).remove();
    updateLocalStorage();
};

const handleInputChange = () => {
    const inputIsValid = validateInput();

    if (inputIsValid) {
        return inputElement.classList.remove("error");
    };
};

const updateLocalStorage = () => {
    const parsedTodos = todoList.map((todo) => ({ ...todo, time: todo.time.getTime() }))
    localStorage.setItem('tasks', JSON.stringify(parsedTodos));
};

const refreshTasksFromLocalStorage = () => {
    const tasksFromLocalStorage = JSON.parse(localStorage.getItem('tasks'));

    if (!tasksFromLocalStorage) return;

    todoList = tasksFromLocalStorage.map((todo) => ({ ...todo, time: (new Date(todo.time)) }))

    todoList.forEach(renderTodo)
};

const removeTask = () => {
    editTaskContainer.classList.toggle("hide");
    editInputElement.value = "";
}



addButton.addEventListener("click", () =>{
    handleAddTask()
    console.log(todoList)   
});
inputElement.addEventListener("change", () => handleInputChange());
cancelBtn.addEventListener("click", () => removeTask());

refreshTasksFromLocalStorage();