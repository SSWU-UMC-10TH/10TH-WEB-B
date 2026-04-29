import { useState } from 'react';
import {useTodo} from '../../context/TodoContext'

const TodoForm = () => {
    const [input, setInput] = useState<string>('');
    const { addTodo } = useTodo();

    const handleSubmit = (e: any): void => {
        e.preventDefault();
        const text = input.trim();

        if (text) {
            addTodo(text);
            setInput('');
        }
    };


    return (

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
    )
};

export default TodoForm;
