import React from "react";
import { MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b dark:border-slate-700">
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold">Dashboard</div>
        <div className="hidden md:block">
          <input className="px-3 py-2 rounded bg-slate-100 dark:bg-slate-700 text-sm outline-none" placeholder="Search..." />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <BellIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm">GD</div>
      </div>
    </header>
  );
}
