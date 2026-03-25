import { useState } from "react";
import { useTodo } from "../context/TodoContext";

interface TodoFormProps {
    input: string;
    setInput: (input: string) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const TodoForm = () => {
    const [input, setInput] = useState<string>('');
    const {addTodo} = useTodo();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
         e.preventDefault();
        const text = input.trim();
    
        if (text) {
             addTodo(text);
             setInput('');
         }
    };

    return(
        <form onSubmit={handleSubmit} className="todo-container__form">
                <input
                    value={input} 
                    onChange={(e): void => setInput(e.target.value)}
                    type='text'
                    className="todo-container__input" 
                    placeholder="할 일을 입력해주세요." 
                    required
                />
                <button type="submit" className="todo-container__button">할 일 추가</button>
        </form>
    )
}

export default TodoForm;