import React, { useEffect, useState } from 'react';
import './App.css';
import { observer } from 'mobx-react-lite';
import { store, toggleTodo, toggleSimulatedUpdates, TodoStore } from './mobx';
import { ITodo, CountRender } from './common';

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
      <p>
        Source:{' '}
        <a href="https://github.com/schontz/mobx-redux-perf/blob/master/src/AppMobx.tsx">
          AppMobx.tsx
        </a>
        | <a href="https://github.com/schontz/mobx-redux-perf/blob/master/src/mobx.tsx">mobx.tsx</a>
      </p>
      <div>
        Render count: <CountRender />
        &nbsp; | &nbsp; Total items: {todos.length} / {store.todos.length}
        &nbsp; | &nbsp;
        <label>
          <input type="checkbox" onChange={(e) => setHideDone(e.target.checked)} /> Hide completed?
        </label>
        &nbsp; | &nbsp; Simulate server:{' '}
        <button onClick={toggleSimulatedUpdates}>toggle streaming</button>{' '}
        <button onClick={() => store.loadFromServer()} disabled={store.loading}>
          one-time
        </button>
      </div>

      {store.loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {todos.map((todo) => (
            <Todo todo={todo} key={todo.id} />
          ))}
        </ul>
      )}
    </>
  );
});

function AppMobx() {
  useEffect(() => {
    store.loadFromServer();
  }, []);

  return <TodoList store={store} />;
}

export default AppMobx;
