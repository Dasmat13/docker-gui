import React from "react";
import { useMockApi } from "../hooks/useMockApi";
import ContainerList from "../components/containers/ContainerList";

export default function Containers() {
  const { containers } = useMockApi();

  return (
    <section className="bg-white dark:bg-slate-800 rounded shadow p-4">
      <h3 className="text-lg font-medium mb-4">All Containers</h3>
      <ContainerList containers={containers} />
    </section>
  );
}
