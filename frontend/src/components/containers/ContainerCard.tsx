import React, { useState } from "react";
import { PlayIcon, PauseIcon, ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import ChartMini from "../ui/ChartMini";
import LogsPanel from "./LogsPanel";
import type { Container } from "../../hooks/useMockApi";

export default function ContainerCard({ container }: { container: Container }) {
  const [openLogs, setOpenLogs] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 rounded shadow p-4">
      <div className="flex justify-between">
        <div>
          <div className="text-sm text-slate-500">{container.image}</div>
          <div className="text-lg font-semibold">{container.name}</div>
          <div className="text-xs mt-1 opacity-70">{container.status}</div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <ActionBtn title="Start"><PlayIcon className="w-4 h-4" /></ActionBtn>
            <ActionBtn title="Stop"><PauseIcon className="w-4 h-4" /></ActionBtn>
            <ActionBtn title="Restart"><ArrowPathIcon className="w-4 h-4" /></ActionBtn>
            <ActionBtn title="Remove"><TrashIcon className="w-4 h-4" /></ActionBtn>
          </div>
          <button onClick={() => setOpenLogs(true)} className="text-xs underline mt-1">Logs</button>
        </div>
      </div>

      <div className="mt-4">
        <ChartMini cpu={container.stats.cpu} mem={container.stats.mem} />
      </div>

      <LogsPanel open={openLogs} onClose={() => setOpenLogs(false)} id={container.id} />
    </div>
  );
}

function ActionBtn({ children, title }: any) {
  return (
    <button title={title} className="p-2 rounded bg-slate-50 dark:bg-slate-700 hover:scale-105 transition">
      {children}
    </button>
  );
}
