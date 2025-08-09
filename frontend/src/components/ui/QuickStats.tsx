import React from "react";
import type { Container } from "../../hooks/useMockApi";

export default function QuickStats({ containers }: { containers: Container[] }) {
  const running = containers.filter((c) => c.state === "running").length;
  const stopped = containers.length - running;

  return (
    <section className="bg-white dark:bg-slate-800 rounded shadow p-4">
      <h4 className="text-base font-medium mb-3">Quick Stats</h4>
      <div className="space-y-3">
        <div>
          <div className="text-sm text-slate-500">Running</div>
          <div className="text-2xl font-semibold">{running}</div>
        </div>
        <div>
          <div className="text-sm text-slate-500">Stopped</div>
          <div className="text-2xl font-semibold">{stopped}</div>
        </div>
      </div>
    </section>
  );
}
