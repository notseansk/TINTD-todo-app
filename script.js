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
let todosToPost;
let completed_task;
//------importing data from local storage----
let dataFromLocalStorage =
  JSON.parse(localStorage.getItem("completedTask")) || [];
//------checking local storage data, if exists then add it to completed list-----
if (dataFromLocalStorage.length > 0) {
  dataFromLocalStorage.forEach(
    (oneTask) => (completedList.innerHTML += `<li>${oneTask}</li>`)
  );
}
let completedTaskName;

//----------------------FUNCTIONS----------------------

//------fetching data from api--------
const fetchTodos = async () => {
  try {
    const res = await fetch(TODO_URL);
    const data = await res.json();
    data.forEach((one) => addTask(one.task, one.priority, one.id));
  } catch (error) {
    console.log(error);
  }
};
fetchTodos();
function addTask(task, priority, id) {
  todoTaskList.innerHTML += `<div class="task">
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
</div>`;
}
function taskCompleted(e, id) {
  if (e.target.tagName != "BUTTON") {
    // console.log(e.target.tagName);
    completed_task = e.target.parentNode.parentNode;
    // console.log(completed_task);
    completedTaskName = completed_task.firstElementChild.innerText;
    addToCompleted(completedTaskName);
    completed_task.remove();
    deleteTodo(id);
  }
}

//------takes just innerText of p that holds task name and adds it to completed section---
function addToCompleted(taskName) {
  completedList.innerHTML += `<li>${taskName}</li>`;
  dataFromLocalStorage.push(taskName);
  // console.log(dataFromLocalStorage);
  localStorage.setItem("completedTask", JSON.stringify(dataFromLocalStorage));
  // console.log(JSON.stringify(dataFromLocalStorage));
}
function taskDeleted(e, id) {
  if (e.target.tagName != "BUTTON") {
    // console.log(e.target.tagName);
    deleted_task = e.target.parentNode.parentNode;
    // // console.log(completed_task);
    // completedTaskName = completed_task.firstElementChild.innerText;
    // addToCompleted(completedTaskName);
    deleted_task.remove();
    deleteTodo(id);
  }
}
//------post todo to api---------
const postTodo = async () => {
  try {
    const res = await fetch(TODO_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todosToPost),
    });
    console.log(res);
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
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
//------adding task to task__list div---------
//------checking if the data fetched has any todos--------

// if (todosFetched.length > 0) {
//   todosFetched.forEach((oneTask) => addTask(oneTask.task, oneTask.priority));
// }

//----------------------EVENT LISTENERS----------------------
//-----when add is pressed todostopost is updated and posttodo is called to add postTodo to api---
//-----addTask will add task and priority to list(need to solve id problem)--------
taskFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  task = taskInputElement.value;
  priority = prioritySelectElement.value;

  todosToPost = { task, priority };
  postTodo();
  addTask(task, priority);
  // setTimeout(() => {
  //   window.location.reload();
  // }, 0);
});

// tickButtonElement.addClickListener("click", (e) => {
//   console.log(e);
// });
