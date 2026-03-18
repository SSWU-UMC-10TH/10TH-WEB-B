const input = document.querySelector('.todo__input') as HTMLInputElement;
const addBtn = document.querySelector('.todo__add-btn') as HTMLButtonElement;
const activeList = document.querySelector('.todo__list--active') as HTMLUListElement;
const completedList = document.querySelector('.todo__list--completed') as HTMLUListElement;

function createTodoItem(text: string): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'todo__item';

  const span = document.createElement('span');
  span.textContent = text;

  const completeBtn = document.createElement('button');
  completeBtn.textContent = '완료';
  completeBtn.className = 'todo__btn todo__btn--complete';

  completeBtn.addEventListener('click', () => {
    moveToCompleted(li, text);
  });

  li.appendChild(span);
  li.appendChild(completeBtn);

  return li;
}

function moveToCompleted(item: HTMLLIElement, text: string): void {
  item.remove();

  const li = document.createElement('li');
  li.className = 'todo__item';

  const span = document.createElement('span');
  span.textContent = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '삭제';
  deleteBtn.className = 'todo__btn todo__btn--delete';

  deleteBtn.addEventListener('click', () => {
    li.remove();
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);

  completedList.appendChild(li);
}

addBtn.addEventListener('click', () => {
  const value = input.value.trim();
  if (!value) return;

  const item = createTodoItem(value);
  activeList.appendChild(item);

  input.value = '';
});

input.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});