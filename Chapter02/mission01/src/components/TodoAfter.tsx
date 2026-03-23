import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { useTodo } from '../context/TodoContext'

const TodoAfter = () => {
     const { todos, completeTodo, deleteTodo, doneTodos } = useTodo();

   
    return (
        <div className="Todo_wrap">
            <h1 className="Todo_title">To Do List</h1>
            <TodoForm />
            <div className="render_container">
                <TodoList
                    title="할 일"
                    todos={todos}
                    buttonLabel='완료'
                    buttonColor='#28a745'
                    onClick={completeTodo} />
                <TodoList
                    title="완료"
                    todos={doneTodos}
                    buttonLabel='삭제'
                    buttonColor='#ff4d4f'
                    onClick={deleteTodo} />
            </div>
        </div>
    )
}

export default TodoAfter
