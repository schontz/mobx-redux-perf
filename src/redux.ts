import { configureStore, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';
import { fakeTitle, ITodo } from './common';

interface TodosState {
  todos: ITodo[];
}

const initialState: TodosState = {
  todos: [],
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (
      state,
      { payload: { title, done } }: PayloadAction<{ title?: string; done?: boolean }>
    ) => {
      state.todos.push({
        id: v4(),
        title: title ?? fakeTitle(),
        done: done ?? false,
      });
    },

    removeTodo: (state, { payload }: PayloadAction<string>) => {
      const idx = state.todos.findIndex((todo) => todo.id === payload);
      if (idx > -1) {
        state.todos.splice(idx, 1);
      }
    },

    toggleTodo: (state, { payload }: PayloadAction<string>) => {
      const idx = state.todos.findIndex((todo) => todo.id === payload);
      if (idx > -1) {
        state.todos[idx].done = !state.todos[idx].done;
      }
    },

    clearTodos: (state) => {
      state.todos = [];
    },

    updateTodo: (
      state,
      { payload: { id, title } }: PayloadAction<{ id: string; title: string }>
    ) => {
      const idx = state.todos.findIndex((todo) => todo.id === id);
      if (idx > -1) {
        state.todos[idx].title = title;
      }
    },
  },
});

export const todosSelector = createSelector(
  (state: RootState) => state.todos,
  (state) => state.todos
);

export const completedTodosSelector = createSelector(todosSelector, (todos) => {
  return todos.filter((todo) => todo.done);
});

export const incompleteTodosSelector = createSelector(
  (state: RootState) => state.todos,
  (todoState) => {
    return todoState.todos.filter((todo) => !todo.done);
  }
);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    todos: todosSlice.reducer,
  },
});
