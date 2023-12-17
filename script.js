//----------------------ELEMENTS----------------------
const TODO_URL = "https://657983681acd268f9af93cd0.mockapi.io/api/todos/tasks";
const todoTaskList = document.getElementById("task__list");
const taskInputElement = document.getElementById("task__input");
const prioritySelectElement = document.getElementById("priority-level");
const taskFormElement = document.getElementById("task__form");
const tickButtonElement = document.getElementById("task__button--tick");
const crossButtonElement = document.getElementById("task__button--cross");
const completedList = document.getElementById("completed_list");

//----------------------VARIABLES----------------------
let dataToRender;
let todosToPost;
let completed_task;
let completedTaskName;

//------importing data from local storage----
let dataFromLocalStorage =
  JSON.parse(localStorage.getItem("completedTask")) || [];

//------checking local storage data, if exists then add it to completed list-----
if (dataFromLocalStorage.length > 0) {
  dataFromLocalStorage.forEach(
    (oneTask) => (completedList.innerHTML += `<li>${oneTask}</li>`)
  );
}

//----------------------FUNCTIONS---------------------
const fetchTodos = async () => {
  try {
    const res = await fetch(TODO_URL);
    const data = await res.json();
    dataToRender = data;
    todoTaskList.innerHTML = "";
    dataToRender.forEach((one) => addTask(one.task, one.priority, one.id));
  } catch (error) {
    console.log(error);
  }
};
fetchTodos();

const addTask = (task, priority, id) => {
  todoTaskList.innerHTML += `<divs class="task">
  <p class="task__text">${task}</p>
  <p id="task__priority">${priority}</p>
  <button onclick="taskCompleted(event,${id})" type="button" class="task__button" id="task__button--tick">
    <img
      class="task__icons tick-icon"
      src="tick.png"
      alt="tick icon"
    />
  </button>
  <button onclick="taskDeleted(event,${id})" type="button" class="task__button" id="task__button--cross">
    <img
      class="task__icons cross-icon"
      src="cross.png"
      alt="cross icon"
    />
  </button>
</divs>`;
};

const taskCompleted = (e, id) => {
  if (e.target.tagName != "BUTTON") {
    completed_task = e.target.parentNode.parentNode;
    completedTaskName = completed_task.firstElementChild.innerText;
    addToCompleted(completedTaskName);
    completed_task.remove();
    deleteTodo(id);
  }
};

//------takes just innerText of p that holds task name and adds it to completed section---
const addToCompleted = (taskName) => {
  completedList.innerHTML += `<li>${taskName}</li>`;
  dataFromLocalStorage.push(taskName);
  localStorage.setItem("completedTask", JSON.stringify(dataFromLocalStorage));
};

const taskDeleted = (e, id) => {
  if (e.target.tagName != "BUTTON") {
    deleted_task = e.target.parentNode.parentNode;
    deleted_task.remove();
    deleteTodo(id);
  }
};
//------post todo to api---------
const postTodo = async (dataToPost) => {
  try {
    const res = await fetch(TODO_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToPost),
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteTodo = async (id) => {
  try {
    const res = await fetch(`${TODO_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
  }
};

//----------------------EVENT LISTENERS----------------------
taskFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  task = taskInputElement.value;
  priority = prioritySelectElement.value;
  todosToPost = { task, priority };
  const updateDataInUrl = async () => {
    try {
      await postTodo(todosToPost);
      await fetchTodos();
    } catch (error) {
      console.log(error);
    }
  };
  updateDataInUrl();
});
