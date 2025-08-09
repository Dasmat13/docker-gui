import { Router } from "express";
import {
  listContainers,
  startContainer,
  stopContainer,
  removeContainer,
  getContainerLogs,
} from "../services/dockerService";

const router = Router();

// List containers
router.get("/", async (req, res) => {
  try {
    const containers = await listContainers();
    res.json(containers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list containers" });
  }
});

// Start container
router.post("/:id/start", async (req, res) => {
  try {
    await startContainer(req.params.id);
    res.json({ message: "Container started" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start container" });
  }
});

// Stop container
router.post("/:id/stop", async (req, res) => {
  try {
    await stopContainer(req.params.id);
    res.json({ message: "Container stopped" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to stop container" });
  }
});

// Remove container
router.delete("/:id", async (req, res) => {
  try {
    await removeContainer(req.params.id);
    res.json({ message: "Container removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove container" });
  }
});

// Get container logs
router.get("/:id/logs", async (req, res) => {
  try {
    const logs = await getContainerLogs(req.params.id);
    res.type("text/plain").send(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch container logs" });
  }
});

export default router;
