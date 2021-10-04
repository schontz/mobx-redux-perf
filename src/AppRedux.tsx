import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { ITodo, CountRender, fakeTitle, rand } from './common';
import { batch, Provider, useDispatch, useSelector } from 'react-redux';
import { incompleteTodosSelector, RootState, store, todosSelector, todosSlice } from './redux';
const { toggleTodo, addTodo, clearTodos, removeTodo, updateTodo } = todosSlice.actions;

const Todo: React.FC<{ todo: ITodo }> = ({ todo }) => {
  return (
    <li className={todo.done ? 'completed' : ''} onClick={() => toggleTodo(todo.id)}>
      {todo.title} <CountRender />
    </li>
  );
};

const TodoList: React.FC = () => {
  const [hideDone, setHideDone] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const allTodos = useSelector(todosSelector);
  const incompleteTodos = useSelector(incompleteTodosSelector);

  const todos = hideDone ? incompleteTodos : allTodos;

  return (
    <>
      <h3>Redux: Re-rendering long lists</h3>
      <div>
        Render count: <CountRender />
        &nbsp; | &nbsp; Total items: {todos.length} / {todos.length}
        &nbsp; | &nbsp;
        <label>
          <input type="checkbox" onChange={(e) => setHideDone(e.target.checked)} /> Hide completed?
        </label>
        &nbsp; | &nbsp;
        <button onClick={() => setIsSimulating(!isSimulating)}>Simulate remote updates</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <Todo todo={todo} key={todo.id} />
        ))}
      </ul>
      {isSimulating && <RunningSimulator />}
    </>
  );
};

const RunningSimulator: React.FC = () => {
  const dispatch = useDispatch();
  const { todos } = useSelector((state: RootState) => state.todos);
  const [causeUpdate, setCauseUpdate] = useState(false);
  const timer = useRef<NodeJS.Timer>();

  useEffect(() => {
    clearTimeout(timer.current!);

    timer.current = setTimeout(
      () =>
        batch(() => {
          console.group('running updates');
          new Array(25).fill(0).forEach(() => {
            let idx = -1;
            switch (rand(4)) {
              case 0:
                idx = rand(todos.length);
                console.log('updating title at', idx, '/', todos.length);
                dispatch(updateTodo({ id: todos[idx].id, title: fakeTitle() }));
                break;
              case 1:
                idx = rand(todos.length);
                console.log('toggling done at', idx, '/', todos.length);
                dispatch(toggleTodo(todos[idx].id));
                break;
              case 2:
                if (todos.length > 7) {
                  idx = rand(todos.length);
                  console.log('removing at', idx, '/', todos.length);
                  dispatch(removeTodo(todos[idx].id));
                  console.count('change length');
                }
                break;
              case 3:
                console.log('adding new item');
                dispatch(addTodo({ title: fakeTitle(), done: rand(2) > 1 }));
                console.count('change length');
                break;
            }
          });
          console.groupEnd();

          setCauseUpdate(!causeUpdate); // force a refresh
        }),
      50 + rand(150)
    );

    return () => clearTimeout(timer.current!);
  }, [causeUpdate]);

  return null;
};

function Hydrate() {
  const dispatch = useDispatch();
  useEffect(() => {
    new Array(1000).fill(0).forEach(() => {
      dispatch(addTodo({ title: fakeTitle(), done: rand(2) > 1 }));
    });
    return () => {
      dispatch(clearTodos());
    };
  }, []);

  return null;
}

function AppRedux() {
  return (
    <Provider store={store}>
      <Hydrate />
      <TodoList />
    </Provider>
  );
}

export default AppRedux;
