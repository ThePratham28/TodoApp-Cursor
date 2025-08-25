type Props = {
  isDark: boolean;
  onToggleDark: () => void;
  onLogout?: () => void;
  isAuthed: boolean;
};

export function Header({ isDark, onToggleDark, onLogout, isAuthed }: Props) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-3xl font-bold">Todo App</h1>
      <div className="flex items-center gap-2">
        {isAuthed && (
          <button
            onClick={onLogout}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Logout
          </button>
        )}
        <button
          onClick={onToggleDark}
          className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          aria-label="Toggle dark mode"
        >
          {isDark ? "Light" : "Dark"}
        </button>
      </div>
    </div>
  );
}
