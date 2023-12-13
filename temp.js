const TODO_URL = "https://657983681acd268f9af93cd0.mockapi.io/api/todos/tasks";
const todoTaskList = document.getElementById("task__list");
const taskInputElement = document.getElementById("task__input");
const prioritySelectElement = document.getElementById("priority-level");
const taskFormElement = document.getElementById("task__form");
const tickButtonElement = document.getElementById("task__button--tick");
const crossButtonElement = document.getElementById("task__button--cross");
const completedList = document.getElementById("completed_list");
let todosFetched = [];
let completed_task;
let completedTaskNameLocalStorage = [];
let completedTaskName;
let sn = 0;

const fetchTodos = (async () => {
  try {
    const res = await fetch(TODO_URL);
    const data = await res.json();
    data.forEach((one) => addTask(one.task, one.priority));
  } catch (error) {
    console.log(error);
  }
})();

function addTask(task, priority) {
  sn += 1;
  todoTaskList.innerHTML += `<div class="task">
  <p class="task__text">${task}</p>

  <p id="task__priority">${priority}</p>
  <button onclick="taskCompleted(event)" type="button" class="task__button task__button--${sn}" id="task__button--tick">
    <img
      class="task__icons tick-icon"
      src="tick.png"
      alt="tick icon"
    />
  </button>
  <button type="button" class="task__button" id="task__button--cross">
    <img
      class="task__icons cross-icon"
      src="cross.png"
      alt="cross icon"
    />
  </button>
</div>`;
  todosFetched.push({ task: task, priority: priority });
}
function taskCompleted(e) {
  completed_task = e.target.parentNode.parentNode;
  // console.log(completed_task);
  completedTaskName = completed_task.firstElementChild.innerText;
  addToCompleted(completedTaskName);
  completed_task.remove();
}
function addToCompleted(taskName) {
  completedList.innerHTML += `<li>${taskName}</li>`;
}

//----------adding task to task__list div---------
//-----------checking if the data fetched has any todos--------

// if (todosFetched.length > 0) {
//   todosFetched.forEach((oneTask) => addTask(oneTask.task, oneTask.priority));
// }

taskFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  task = taskInputElement.value;
  priority = prioritySelectElement.value;
  addTask(task, priority);
});

tickButtonElement.addClickListener("click", (e) => {
  console.log(e);
});
