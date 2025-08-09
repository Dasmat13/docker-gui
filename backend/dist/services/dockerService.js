"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.docker = void 0;
exports.listContainers = listContainers;
exports.getContainerInfo = getContainerInfo;
exports.getContainerById = getContainerById;
const dockerode_1 = __importDefault(require("dockerode"));
const socketPath = process.env.DOCKER_SOCKET || "/var/run/docker.sock";
exports.docker = new dockerode_1.default({ socketPath });
async function listContainers(all = true) {
    return exports.docker.listContainers({ all });
}
async function getContainerInfo(id) {
    const container = exports.docker.getContainer(id);
    const inspect = await container.inspect();
    return inspect;
}
function getContainerById(id) {
    return exports.docker.getContainer(id);
}
