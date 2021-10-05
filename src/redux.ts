import { configureStore, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';
import { fakeTitle, ITodo } from './common';

interface TodosState {
  todos: Record<string, ITodo>;
}

const initialState: TodosState = {
  todos: {},
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (
      state,
      { payload: { title, done } }: PayloadAction<{ title?: string; done?: boolean }>
    ) => {
      const id = v4();
      state.todos[id] = {
        id,
        title: title ?? fakeTitle(),
        done: done ?? false,
      };
    },

    removeTodo: (state, { payload }: PayloadAction<string>) => {
      delete state.todos[payload];
    },

    toggleTodo: (state, { payload }: PayloadAction<string>) => {
      const todo = state.todos[payload];
      if (todo) todo.done = !todo.done;
      else console.error('toggleTodo: no todo found', payload);
    },

    clearTodos: (state) => {
      state.todos = {};
    },

    updateTodo: (
      state,
      { payload: { id, title } }: PayloadAction<{ id: string; title: string }>
    ) => {
      const todo = state.todos[id];
      if (todo) todo.title = title;
      else console.error('updateTodo: no todo found', id);
    },
  },
});

const todoListSelector = (state: RootState) => state.todoList;

export const allTodosSelector = createSelector(todoListSelector, (state) =>
  Object.values(state.todos)
);

export const allTodoIdsSelector = createSelector(todoListSelector, (state) =>
  Object.keys(state.todos)
);

export const completedTodosSelector = createSelector(allTodosSelector, (todos) => {
  return todos.filter((todo) => todo.done);
});

export const incompleteTodosSelector = createSelector(allTodosSelector, (todos) => {
  return todos.filter((todo) => !todo.done);
});

export const incompleteTodoIdsSelector = createSelector(incompleteTodosSelector, (todos) =>
  todos.map((td) => td.id)
);

export const todoSelector = (id: string) => (state: RootState) => state.todoList.todos[id];

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    todoList: todosSlice.reducer,
  },
});
