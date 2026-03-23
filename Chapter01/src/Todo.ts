document.addEventListener('DOMContentLoaded', () => {

    const inputBox = document.getElementById('Todo-input') as HTMLInputElement;
    const addButton = document.querySelector('.Todo_input_button') as HTMLButtonElement;
    const todoList = document.getElementById('todo-list') as HTMLUListElement;
    const doneList = document.getElementById('done-list') as HTMLUListElement;

    const addTodo = () => {
        const text = inputBox.value.trim();
        if (!text) return; 

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

    inputBox.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') addTodo();
    });

    todoList.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        
        if (target.classList.contains('commit_button')) {
            const li = target.parentElement as HTMLLIElement;
            const textElement = li.querySelector('p') as HTMLParagraphElement;
            const text: string = textElement.innerText;

            const doneLi: HTMLElement = document.createElement('li');
            doneLi.className = 'done_item';
            doneLi.innerHTML = `
                <p class="render_container_item_text">${text}</p>
                <button class="delete_button">삭제</button>
            `;

            doneList.appendChild(doneLi);
            li.remove();
        }
    });

    doneList.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        if (target.classList.contains('delete_button')) {
            (target.parentElement as HTMLLIElement).remove();
        }
    });
});