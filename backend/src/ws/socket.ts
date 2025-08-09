import { Server as IOServer } from "socket.io";
import { docker, getContainerById } from "../services/dockerService";
import Docker from "dockerode";

export function initSocket(io: IOServer) {
  io.on("connection", (socket) => {
    console.log("socket connected:", socket.id);

    // Subscribe to container logs request: { id }
    socket.on("logs:subscribe", async (payload: { id: string }) => {
      const id = payload.id;
      try {
        const container = docker.getContainer(id);
        const logStream = await container.logs({
          follow: true,
          stdout: true,
          stderr: true,
          since: 0,
          tail: 100
        }) as NodeJS.ReadableStream;

        logStream.on("data", (chunk: Buffer) => {
          socket.emit("logs:data", { id, chunk: chunk.toString() });
        });

        socket.on("disconnect", () => {
          try { (logStream as any).destroy && (logStream as any).destroy(); } catch {}
        });
      } catch (err) {
        console.error("log subscribe error", err);
        socket.emit("logs:error", { error: String(err) });
      }
    });

    // Send lightweight stats for a container (polling)
    socket.on("stats:subscribe", async (payload: { id: string }) => {
      const id = payload.id;
      const container = docker.getContainer(id);
      let streaming = true;

      async function stream() {
        try {
          const statsStream = await container.stats({ stream: true }) as NodeJS.ReadableStream;
          statsStream.on("data", (data: Buffer) => {
            try {
              const json = JSON.parse(data.toString());
              socket.emit("stats:data", { id, stats: json });
            } catch {}
          });
          statsStream.on("end", () => { streaming = false; });
        } catch (err) {
          console.error("stats error", err);
          socket.emit("stats:error", { error: String(err) });
        }
      }

      stream();

      socket.on("disconnect", () => {
        streaming = false;
      });
    });
  });
}
