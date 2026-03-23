import type { TTodo } from '../types/Todo';

interface TodoListProps {
    title: string;
    todos: TTodo[];
    buttonLabel: string;
    buttonColor: string;
    onClick: (todo: TTodo) => void;
}

const TodoList = ({ title, todos, buttonLabel, onClick, buttonColor }: TodoListProps) => {
    return (
        <div className="render_container_section">
            <h2>{title}</h2>
            <ul className="render_container_list">
                {todos.map((todo) => (
                    <li key={todo.id} className='list_item'>
                        <p className='render_container_item_text'>{todo.text}</p>
                        <button style={{ backgroundColor: buttonColor }}
                        onClick={(): void=> onClick(todo)} className='commit_button'>
                            {buttonLabel}</button>
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default TodoList;
