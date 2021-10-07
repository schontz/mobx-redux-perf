import { useEffect, useRef } from 'react';

export interface ITodo {
  id: string;
  title: string;
  done: boolean;
}

export interface ITodoList {
  todos: ITodo[];
}

export function fakeTitle() {
  const strs = 'every good boy does fine please excuse my dear aunt susy'.split(' ');
  return new Array(7)
    .fill('')
    .map(() => strs[rand(strs.length - 1)])
    .join(' ');
}

export function rand(max: number) {
  return Math.round(Math.random() * max);
}

export const CountRender: React.FC = () => {
  const count = useRef(1);
  useEffect(() => {
    count.current++;
  });
  return <div className="count-render">{count.current}</div>;
};
