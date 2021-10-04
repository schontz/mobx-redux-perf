import React, { useEffect, useState } from 'react';
import './App.css';
import { observer } from 'mobx-react-lite';
import { addTodo, clearTodos, store, toggleTodo, toggleSimulatedUpdates, TodoStore } from './mobx';
import { ITodo, CountRender, fakeTitle, rand } from './common';

const Todo: React.FC<{ todo: ITodo }> = observer(({ todo }) => {
  return (
    <li className={todo.done ? 'completed' : ''} onClick={() => toggleTodo(todo.id)}>
      {todo.title} <CountRender />
    </li>
  );
});

const TodoList: React.FC<{ store: TodoStore }> = observer(({ store }) => {
  const [hideDone, setHideDone] = useState(false);

  const todos = hideDone ? store.pendingTodos : store.todos;

  return (
    <>
      <h3>mobx: Re-rendering long lists</h3>
      <p>mobx allows fine-grain updates, which only re-render the necessary components.</p>
      <div>
        Render count: <CountRender />
        &nbsp; | &nbsp; Total items: {todos.length} / {store.todos.length}
        &nbsp; | &nbsp;
        <label>
          <input type="checkbox" onChange={(e) => setHideDone(e.target.checked)} /> Hide completed?
        </label>
        &nbsp; | &nbsp;
        <button onClick={toggleSimulatedUpdates}>Simulate remote updates</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <Todo todo={todo} key={todo.id} />
        ))}
      </ul>
    </>
  );
});

function AppMobx() {
  useEffect(() => {
    new Array(1000).fill(0).forEach(() => {
      addTodo(fakeTitle(), rand(2) > 1);
    });
    return () => {
      clearTodos();
    };
  }, []);

  return <TodoList store={store} />;
}

export default AppMobx;
