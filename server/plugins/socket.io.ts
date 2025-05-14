import type { NitroApp } from "nitropack";
import { createClient } from "redis";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { Server as Engine } from "engine.io";
import { defineEventHandler } from "h3";

let ioInstance: Server | null = null;
export function getIOInstance(): Server {
	if (!ioInstance) {
		throw new Error('Socket.io server is not initialized.');
	}
	return ioInstance;
}
export default defineNitroPlugin(async (nitroApp: NitroApp) => {
	const pubClient = createClient({ url: "redis://localhost:6379" });
	const subClient = pubClient.duplicate();

	await Promise.all([
		pubClient.connect(),
		subClient.connect()
	]);

  const io = new Server({
		adapter: createAdapter(pubClient, subClient)
	});
  const engine = new Engine();

  io.bind(engine);

  io.on("connection", (socket) => {
    // ...
  });

  nitroApp.router.use("/socket.io/", defineEventHandler({
    handler(event) {
      engine.handleRequest(event.node.req, event.node.res);
      event._handled = true;
    },
    websocket: {
      open(peer) {
        // @ts-expect-error private method and property
        engine.prepare(peer._internal.nodeReq);
        // @ts-expect-error private method and property
        engine.onWebSocket(peer._internal.nodeReq, peer._internal.nodeReq.socket, peer.websocket);
      }
    }
  }));

	ioInstance = io;
});
