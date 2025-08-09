"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const containerController_1 = __importDefault(require("./controllers/containerController"));
const socket_1 = require("./ws/socket");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use("/api/containers", containerController_1.default);
// Add this route to handle GET /
app.get("/", (req, res) => {
    res.send(`✅ Backend is running on http://0.0.0.0:${port}`);
});
const port = Number(process.env.PORT || 3001);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
(0, socket_1.initSocket)(io);
server.listen(port, () => {
    console.log(`Backend listening on http://0.0.0.0:${port}`);
});
