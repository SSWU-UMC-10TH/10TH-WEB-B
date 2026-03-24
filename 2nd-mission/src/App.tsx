import './App.css'
import Todo from './components/Todo';
import TodoBefore from './components/TodoBefore'
import { useState, type JSX } from 'react';
import { TodoProvider } from './context/TodoContext';

function App(): JSX.Element {
  return (
    <TodoProvider>
    <Todo/>
    </TodoProvider>
  );
};

export default App
