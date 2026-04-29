import TodoAfter from './components/TodoAfter'
import { TodoProvider } from '../context/TodoContext'

const App = () => {
  return (
    <div>
      <TodoProvider>
        <TodoAfter />
      </TodoProvider>
    </div>
  )
}

export default App
