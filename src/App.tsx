import { useEffect, useMemo, useState } from "react";
import { api } from "./services/api";
import { useTheme } from "./hooks/useTheme";
import { Header } from "./components/Header";
import { AuthForm } from "./components/AuthForm";
import { TodoList } from "./components/TodoList";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

function App() {
  const [titleInput, setTitleInput] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const { isDark, setIsDark } = useTheme();
  const [token, setToken] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  // auth inputs handled within AuthForm

  // Load token
  useEffect(() => {
    try {
      const saved = localStorage.getItem("token");
      if (saved) setToken(saved);
    } catch {}
  }, []);

  // Load todos when token changes
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await api.listTodos(token);
        setTodos(
          data.map((d) => ({
            id: d._id,
            title: d.title,
            completed: d.completed,
          }))
        );
      } catch {
        // if unauthorized, clear token
        setToken(null);
        try {
          localStorage.removeItem("token");
        } catch {}
      }
    })();
  }, [token]);

  const remainingCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos]
  );
  const filteredTodos = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  function addTodo(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = titleInput.trim();
    if (!trimmed) return;
    if (!token) return;
    (async () => {
      try {
        const created = await api.addTodo(token, trimmed);
        const newTodo: Todo = {
          id: created._id,
          title: created.title,
          completed: created.completed,
        };
        setTodos((prev) => [newTodo, ...prev]);
        setTitleInput("");
      } catch {}
    })();
  }

  function toggleTodo(id: string) {
    if (!token) return;
    const target = todos.find((t) => t.id === id);
    if (!target) return;
    const nextCompleted = !target.completed;
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t))
    );
    (async () => {
      try {
        await api.updateTodo(token, id, { completed: nextCompleted });
      } catch {}
    })();
  }

  function removeTodo(id: string) {
    if (!token) return;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    (async () => {
      try {
        await api.deleteTodo(token, id);
      } catch {}
    })();
  }

  // auth submit handled inline via AuthForm onSubmit

  function logout() {
    setToken(null);
    try {
      localStorage.removeItem("token");
    } catch {}
    setTodos([]);
  }

  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="mx-auto max-w-lg px-4 py-10">
        <Header
          isDark={isDark}
          onToggleDark={() => setIsDark((v) => !v)}
          onLogout={logout}
          isAuthed={!!token}
        />

        {!token && (
          <AuthForm
            mode={authMode}
            setMode={setAuthMode}
            onSubmit={async (em, pw) => {
              try {
                const tok =
                  authMode === "login"
                    ? await api.login(em, pw)
                    : await api.register(em, pw);
                setToken(tok);
                try {
                  localStorage.setItem("token", tok);
                } catch {}
              } catch {}
            }}
          />
        )}

        {token && (
          <form onSubmit={addTodo} className="mb-6 flex gap-2">
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Add a new task..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
            />
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!titleInput.trim()}
            >
              Add
            </button>
          </form>
        )}

        <div className="mb-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            {todos.length === 0
              ? "No tasks yet."
              : `${remainingCount} remaining / ${todos.length} total`}
          </span>
          <div className="inline-flex overflow-hidden rounded-md border border-gray-300 dark:border-gray-700">
            {(["all", "active", "completed"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={
                  "px-3 py-1 capitalize text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800" +
                  (filter === key ? " bg-gray-100 dark:bg-gray-800" : "")
                }
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {token && (
          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={removeTodo}
          />
        )}
      </div>
    </div>
  );
}

export default App;
