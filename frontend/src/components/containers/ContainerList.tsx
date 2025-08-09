import React from "react";
import ContainerCard from "./ContainerCard";
import type { Container } from "../../hooks/useMockApi";

export default function ContainerList({ containers }: { containers: Container[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {containers.map((c) => (
        <ContainerCard key={c.id} container={c} />
      ))}
      {containers.length === 0 && <div className="p-4 text-sm text-slate-500">No containers found.</div>}
    </div>
  );
}
