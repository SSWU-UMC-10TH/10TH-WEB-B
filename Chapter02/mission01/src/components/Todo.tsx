import { useState } from 'react'; 
import type { TTodo } from '../types/Todo';

const Todo = () => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
    const [input, setInput] = useState<string>('');

    const handleSubmit = (e: any): void => {
        e.preventDefault();
        const text = input.trim();

        if (text) {
            const newTodo: TTodo = { id: Date.now(), text };
            setTodos((prevTodos) => [...prevTodos, newTodo]);
            setInput('');
        }
    };

    const completeTodo = (todo: TTodo): void => {
        setTodos(prevTodos => prevTodos.filter((t) => t.id !== todo.id));
        setDoneTodos((prevDoneTodos) => [...prevDoneTodos, todo]);
    };

    const deleteTodo = (todo: TTodo): void => {
        setDoneTodos((prevDoneTodo) =>
            prevDoneTodo.filter((t) => t.id !== todo.id));
    };

    return (
        <div>
            <div className="Todo_wrap">
                <h1 className="Todo_title">To Do List</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        id="Todo-input"
                        value={input}
                        onChange={(e): void => setInput(e.target.value)}
                        type="text"
                        className="Todo_input_text"
                        placeholder="할 일을 입력해주세요"
                    />
                    <button className="Todo_input_button" type="submit">할 일 추가</button>
                </form>

                <div className="render_container">
                    <div className="render_container_section">
                        <h2>할 일</h2>
                        <ul className="render_container_list">
                            {todos.map((todo) => (
                                <li key={todo.id} className='list_item'>
                                    <p className='render_container_item_text'>{todo.text}</p>
                                    <button onClick={() => completeTodo(todo)} className='commit_button'>
                                        완료</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="render_container_section">
                        <h2>완료</h2>
                        <ul className="render_container_list">
                            {doneTodos.map((todo) => (
                                <li key={todo.id} className='list_item'>
                                    <p className='render_container_item_text'>{todo.text}</p>
                                    <button onClick={() => deleteTodo(todo)} className='delete_button'>
                                        삭제</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Todo;