"use strict";
const todoInput = document.getElementById("todo-input");
const todoForm = document.getElementById("todo-form");
const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");
let todos = [];
let doneTasks = [];
const renderTask = () => {
  todoList.innerHTML = "";
  doneList.innerHTML = "";
  todos.forEach((todo) => {
    const li = createTodoElement(todo, false);
    todoList.appendChild(li);
  });
  doneTasks.forEach((todo) => {
    const li = createTodoElement(todo, true);
    doneList.appendChild(li);
  });
};
const getTodoText = () => {
  return todoInput.value.trim();
};
const addTodo = (text) => {
  const newTodo = { id: Date.now(), text };
  todos.push(newTodo);
  todoInput.value = "";
  renderTask();
};
const compleTask = (todo) => {
  todos = todos.filter((t) => t.id !== todo.id);
  doneTasks.push(todo);
  renderTask();
};
const deleteTodo = (todo) => {
  doneTasks = doneTasks.filter((t) => t.id !== todo.id);
  renderTask();
};
const createTodoElement = (todo, isDone) => {
  const li = document.createElement("li");
  li.classList.add("render-container_item");
  const span = document.createElement("span");
  span.textContent = todo.text;
  li.appendChild(span);
  const button = document.createElement("button");
  button.classList.add("render-container_item-button");
  if (isDone) {
    button.textContent = "삭제";
    button.style.backgroundColor = "#bc3545";
  } else {
    button.textContent = "완료";
    button.style.backgroundColor = "#28a745";
  }
  button.addEventListener("click", () => {
    if (isDone) {
      deleteTodo(todo);
    } else {
      compleTask(todo);
    }
  });
  li.appendChild(button);
  return li;
};
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = getTodoText();
  if (text) {
    addTodo(text);
  }
});
