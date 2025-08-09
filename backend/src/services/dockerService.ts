import Docker from "dockerode";

const docker = new Docker();

// List all containers (running + stopped)
export async function listContainers() {
  return docker.listContainers({ all: true });
}

// Get container by ID
export function getContainer(id: string) {
  return docker.getContainer(id);
}

// Start a container
export async function startContainer(id: string) {
  const container = getContainer(id);
  return container.start();
}

// Stop a container
export async function stopContainer(id: string) {
  const container = getContainer(id);
  return container.stop();
}

// Remove a container
export async function removeContainer(id: string) {
  const container = getContainer(id);
  return container.remove({ force: true });
}

// Get container logs
export async function getContainerLogs(id: string) {
  const container = getContainer(id);
  const stream = await container.logs({
    stdout: true,
    stderr: true,
    tail: 100,      // last 100 lines
    follow: false,
  });

  return stream.toString();
}
