"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
const dockerService_1 = require("../services/dockerService");
function initSocket(io) {
    io.on("connection", (socket) => {
        console.log("socket connected:", socket.id);
        // Subscribe to container logs request: { id }
        socket.on("logs:subscribe", async (payload) => {
            const id = payload.id;
            try {
                const container = dockerService_1.docker.getContainer(id);
                const logStream = await container.logs({
                    follow: true,
                    stdout: true,
                    stderr: true,
                    since: 0,
                    tail: 100
                });
                logStream.on("data", (chunk) => {
                    socket.emit("logs:data", { id, chunk: chunk.toString() });
                });
                socket.on("disconnect", () => {
                    try {
                        logStream.destroy && logStream.destroy();
                    }
                    catch { }
                });
            }
            catch (err) {
                console.error("log subscribe error", err);
                socket.emit("logs:error", { error: String(err) });
            }
        });
        // Send lightweight stats for a container (polling)
        socket.on("stats:subscribe", async (payload) => {
            const id = payload.id;
            const container = dockerService_1.docker.getContainer(id);
            let streaming = true;
            async function stream() {
                try {
                    const statsStream = await container.stats({ stream: true });
                    statsStream.on("data", (data) => {
                        try {
                            const json = JSON.parse(data.toString());
                            socket.emit("stats:data", { id, stats: json });
                        }
                        catch { }
                    });
                    statsStream.on("end", () => { streaming = false; });
                }
                catch (err) {
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
