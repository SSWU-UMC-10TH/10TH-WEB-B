"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.getElementById('Todo-input');
    const addButton = document.querySelector('.Todo_input_button');
    const todoList = document.getElementById('todo-list');
    const doneList = document.getElementById('done-list');
    const addTodo = () => {
        const text = inputBox.value.trim();
        if (!text)
            return;
        const li = document.createElement('li');
        li.className = 'list_item';
        li.innerHTML = `
            <p class="render_container_item_text">${text}</p>
            <button class="commit_button">완료</button>
        `;
        todoList.appendChild(li);
        inputBox.value = "";
        inputBox.focus();
    };
    addButton.addEventListener('click', addTodo);
    inputBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter')
            addTodo();
    });
    todoList.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('commit_button')) {
            const li = target.parentElement;
            const textElement = li.querySelector('p');
            const text = textElement.innerText;
            const doneLi = document.createElement('li');
            doneLi.className = 'done_item';
            doneLi.innerHTML = `
                <p class="render_container_item_text">${text}</p>
                <button class="delete_button">삭제</button>
            `;
            doneList.appendChild(doneLi);
            li.remove();
        }
    });
    doneList.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('delete_button')) {
            target.parentElement.remove();
        }
    });
});
