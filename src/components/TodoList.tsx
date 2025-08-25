export type Todo = { id: string; title: string; completed: boolean };

type Props = {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TodoList({ todos, onToggle, onDelete }: Props) {
  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-950"
        >
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              className="h-4 w-4 accent-blue-600"
            />
            <span
              className={todo.completed ? "text-gray-400 line-through" : ""}
            >
              {todo.title}
            </span>
          </label>
          <button
            onClick={() => onDelete(todo.id)}
            className="rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            aria-label={`Delete ${todo.title}`}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
