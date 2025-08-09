"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dockerService_1 = require("../services/dockerService");
const router = express_1.default.Router();
// GET /api/containers
router.get("/", async (req, res) => {
    try {
        const containers = await (0, dockerService_1.listContainers)(true);
        res.json(containers);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to list containers" });
    }
});
// GET /api/containers/:id
router.get("/:id", async (req, res) => {
    try {
        const info = await (0, dockerService_1.getContainerInfo)(req.params.id);
        res.json(info);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to inspect container" });
    }
});
// POST /api/containers/:id/:action  actions: start|stop|restart|remove
router.post("/:id/:action", async (req, res) => {
    const { id, action } = req.params;
    try {
        const container = (0, dockerService_1.getContainerById)(id);
        if (action === "start")
            await container.start();
        else if (action === "stop")
            await container.stop();
        else if (action === "restart")
            await container.restart();
        else if (action === "remove")
            await container.remove({ force: true });
        else
            return res.status(400).json({ error: "Unknown action" });
        res.json({ ok: true, action });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || "Action failed" });
    }
});
exports.default = router;
