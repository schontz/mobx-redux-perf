import { makeAutoObservable, action } from 'mobx';
import { v4 } from 'uuid';
import { fakeTitle, rand, ITodo, ITodoList } from './common';

export class TodoItem implements ITodo {
  constructor(title: string, done = false) {
    this.setTitle(title);
    this.setDone(done);
    makeAutoObservable(this);
  }

  id = v4();

  title = '';

  done = false;

  toggleDone() {
    this.setDone(!this.done);
  }

  setDone(done: boolean) {
    this.done = done;
  }

  setTitle(newTitle: string) {
    this.title = newTitle;
  }
}

export class TodoStore implements ITodoList {
  constructor() {
    makeAutoObservable(this);
  }

  todos: TodoItem[] = [];

  get pendingTodos() {
    return this.todos.filter((todo) => !todo.done);
  }

  addTodo(todo: TodoItem) {
    this.todos.push(todo);
  }

  removeTodo(idx: number) {
    this.todos.splice(idx, 1);
  }

  clearAll() {
    this.todos = [];
  }

  findTodo(id: string) {
    return this.todos.find((todo) => todo.id === id);
  }
}

export const store = new TodoStore();

export function addTodo(title = fakeTitle(), done = false) {
  store.addTodo(new TodoItem(title, done));
}

export function removeTodo(idx: number) {
  store.removeTodo(idx);
}

export function toggleTodo(idx: number | string) {
  if (typeof idx === 'number') store.todos[idx]?.toggleDone();
  else store.findTodo(idx)?.toggleDone();
}

export function updateTodo(idx: number, title = fakeTitle()) {
  store.todos[idx]?.setTitle(title);
}

export function clearTodos() {
  store.clearAll();
  runningSimulation = false;
}

let runningSimulation = false;
export const toggleSimulatedUpdates = () => {
  runningSimulation = !runningSimulation;
  if (runningSimulation) {
    const update = action(() => {
      if (!runningSimulation) return;

      console.group('running updates');
      new Array(25).fill(0).forEach(() => {
        let idx = -1;
        switch (rand(4)) {
          case 0:
            idx = rand(store.todos.length);
            console.log('updating title at', idx, '/', store.todos.length);
            updateTodo(idx, fakeTitle());
            break;
          case 1:
            idx = rand(store.todos.length);
            console.log('toggling done at', idx, '/', store.todos.length);
            toggleTodo(idx);
            break;
          case 2:
            if (store.todos.length > 7) {
              idx = rand(store.todos.length);
              console.log('removing at', idx, '/', store.todos.length);
              removeTodo(idx);
              console.count('change length');
            }
            break;
          case 3:
            console.log('adding new item');
            addTodo(fakeTitle(), rand(2) > 1);
            store.addTodo(new TodoItem(fakeTitle(), rand(2) > 1));
            console.count('change length');
            break;
        }
      });
      console.groupEnd();

      setTimeout(update, 50 + rand(150));
    });

    update();
  }
};
