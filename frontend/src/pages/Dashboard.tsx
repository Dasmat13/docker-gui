import React from "react";
import { useMockApi } from "../hooks/useMockApi";
import ContainerList from "../components/containers/ContainerList";
import QuickStats from "../components/ui/QuickStats";

export default function Dashboard() {
  const { containers } = useMockApi(); // get mock data for UI

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <section className="bg-white dark:bg-slate-800 rounded shadow p-4">
            <h3 className="text-lg font-medium mb-4">Containers</h3>
            <ContainerList containers={containers} />
          </section>
        </div>

        <div>
          <QuickStats containers={containers} />
        </div>
      </div>
    </div>
  );
}
