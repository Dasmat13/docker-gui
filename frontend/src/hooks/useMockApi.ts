import { useEffect, useState } from "react";

export type Container = {
  id: string;
  name: string;
  image: string;
  state: "running" | "exited" | "paused" | string;
  status: string;
  stats: { cpu: number; mem: number };
};

const initial: Container[] = [
  { id: "1a2b3c", name: "web-app", image: "nginx:latest", state: "running", status: "Up 2 hours", stats: { cpu: 12.4, mem: 38.2 } },
  { id: "2b3c4d", name: "db", image: "postgres:15", state: "running", status: "Up 4 hours", stats: { cpu: 7.3, mem: 62.6 } },
  { id: "3c4d5e", name: "worker", image: "node:20", state: "exited", status: "Exited (0) 1 hour ago", stats: { cpu: 0.1, mem: 1.2 } }
];

export function useMockApi() {
  const [containers, setContainers] = useState<Container[]>(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // simulate periodic stat updates
    const t = setInterval(() => {
      setContainers((prev) => prev.map((c) => ({ ...c, stats: { cpu: Math.max(0, Math.min(100, c.stats.cpu + (Math.random() * 8 - 4))), mem: Math.max(0, Math.min(100, c.stats.mem + (Math.random() * 6 - 3))) } })));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const refresh = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setLoading(false);
  };

  const performAction = async (id: string, action: "start" | "stop" | "restart" | "remove") => {
    // mock; update state locally
    setContainers((prev) => {
      if (action === "remove") return prev.filter((p) => p.id !== id);
      return prev.map((p) => (p.id === id ? { ...p, state: action === "start" ? "running" : action === "stop" ? "exited" : p.state } : p));
    });
    return true;
  };

  const inspect = async (id: string) => {
    await new Promise((r) => setTimeout(r, 200));
    return containers.find((c) => c.id === id) ?? null;
  };

  return { containers, loading, refresh, performAction, inspect };
}
