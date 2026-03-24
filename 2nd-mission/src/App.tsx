import './App.css'
import Todo from './components/Todo';
import { type JSX } from 'react';
import { TodoProvider } from './context/TodoContext';
import ContextPage from './06-useContext/ContextPage';

function App(): JSX.Element {
  return (
    <ContextPage/>
  );
};

export default App
