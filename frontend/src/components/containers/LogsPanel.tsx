import React, { useEffect, useRef, useState } from "react";

export default function LogsPanel({ open, onClose, id }: { open: boolean; onClose: () => void; id: string }) {
  const [logs, setLogs] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    // mock streaming logs (replace with real socket in integration)
    const lines = Array.from({ length: 30 }).map((_, i) => `[${new Date().toLocaleTimeString()}] ${id.slice(0,6)} log ${i}`);
    let idx = 0;
    const t = setInterval(() => {
      setLogs((prev) => [...prev, lines[idx++]]);
      if (idx >= lines.length) clearInterval(t);
    }, 120);
    return () => clearInterval(t);
  }, [open, id]);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [logs]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-2/5 bg-white dark:bg-slate-900 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Logs — {id}</div>
          <button onClick={onClose} className="text-sm underline">Close</button>
        </div>

        <div className="bg-black text-green-200 font-mono text-xs p-3 rounded overflow-auto max-h-[80vh]" ref={ref}>
          {logs.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </div>
  );
}
