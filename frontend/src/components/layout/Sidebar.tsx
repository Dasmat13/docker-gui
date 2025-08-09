import React from "react";
import { CubeIcon, Cog6ToothIcon, RectangleStackIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../context/ThemeContext";

export default function Sidebar() {
  const { toggle, theme } = useTheme();

  return (
    <aside className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="p-5 border-b dark:border-slate-700">
        <div className="flex items-center gap-3">
          <CubeIcon className="h-7 w-7 text-brand-500" />
          <div>
            <div className="font-semibold">docker-gui</div>
            <div className="text-xs opacity-70">Visual container manager</div>
          </div>
        </div>
      </div>

      <nav className="p-4 flex-1 space-y-1">
        <a className="block px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">Overview</a>
        <a className="block px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">Containers</a>
        <a className="block px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">Images</a>
      </nav>

      <div className="p-4 border-t dark:border-slate-700">
        <button onClick={toggle} className="w-full px-3 py-2 rounded bg-slate-100 dark:bg-slate-700 text-sm">
          Theme: {theme === "dark" ? "Dark" : "Light"}
        </button>
      </div>
    </aside>
  );
}
