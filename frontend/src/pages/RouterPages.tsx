import React from "react";
import Dashboard from "./Dashboard";
import Containers from "./Containers";
import Settings from "./Settings";

export default function RouterPages() {
  // simple internal navigation placeholder (no router)
  const [page, setPage] = React.useState<"dashboard" | "containers" | "settings">("dashboard");

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => setPage("dashboard")} className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-700">Overview</button>
        <button onClick={() => setPage("containers")} className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-700">Containers</button>
        <button onClick={() => setPage("settings")} className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-700">Settings</button>
      </div>

      {page === "dashboard" && <Dashboard />}
      {page === "containers" && <Containers />}
      {page === "settings" && <Settings />}
    </div>
  );
}
