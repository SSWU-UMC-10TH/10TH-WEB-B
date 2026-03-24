//import { useState } from "react";
import { useState, type FormEvent } from "react";
import type { TTodo } from "../types/todo";

const TodoBefore = () => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
  const [input, setInput] = useState<string>("");

  console.log("input", input);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("동작함");
    const text = input.trim();

    if (text) {
      const newTodo: TTodo = { id: Date.now(), text };
      setTodos((prevTodos): TTodo[] => [...prevTodos, newTodo]);
      setInput("");
    }
  };

  const completeTodo = (todo: TTodo): void => {
    setTodos((prevTodos) => prevTodos.filter((t): boolean => t.id !== todo.id));
    setDoneTodos((prevDoneTodos) => [...prevDoneTodos, todo]);
  };

  const deleteTodo = (todo: TTodo): void => {
    setDoneTodos((prevDoneTodo): TTodo[] =>
      prevDoneTodo.filter((t): boolean => t.id !== todo.id)
    );
  };

  return (
    <div className="todo-container">
      <h1 className="todo-container_header">YOUNG TODO</h1>
      <form onSubmit={handleSubmit} className="todo-container_form">
        <input
          value={input}
          onChange={(e): void => setInput(e.target.value)}
          type="text"
          className="todo-container_input"
          placeholder="할 일 입력"
          required
        />
        <button type="submit" className="todo-container_button">
          할 일 추가
        </button>
      </form>
      <div className="render-container">
        <div className="render-container_section">
          <h2 className="render-container_title">할 일</h2>
          <ul id="todo-list" className="render-container_list">
            {todos.map((todo) => (
              <li key={todo.id} className="render-container_item">
                <span className="render-container_item-text">{todo.text}</span>
                <button
                  onClick={(): void => completeTodo(todo)}
                  style={{
                    backgroundColor: "#28a745",
                  }}
                  className="render-container_item-button"
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="render-container_section">
          <h2 className="render-container_title">완료</h2>
          <ul id="todo-list" className="render-container_list">
            {doneTodos.map((todo) => (
              <li key={todo.id} className="render-container_item">
                <span className="render-container_item-text">{todo.text}</span>
                <button
                  onClick={(): void => deleteTodo(todo)}
                  style={{
                    backgroundColor: "#dc3545",
                  }}
                  className="render-container_item-button"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TodoBefore;
