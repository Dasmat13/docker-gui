import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import containerRouter from "./controllers/containerController";
import { initSocket } from "./ws/socket";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/containers", containerRouter);

// Add this route to handle GET /
app.get("/", (req, res) => {
  res.send(`✅ Backend is running on http://0.0.0.0:${port}`);
});

const port = Number(process.env.PORT || 3001);
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initSocket(io);

server.listen(port, () => {
  console.log(`Backend listening on http://0.0.0.0:${port}`);
});
