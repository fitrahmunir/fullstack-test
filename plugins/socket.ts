import { io } from "socket.io-client";

export default defineNuxtPlugin({
  name: 'socket',
  enforce: 'pre', // or 'post'
  async setup (nuxtApp) {
		const isConnected = ref(false);
		const transport = ref("N/A");

		const socket = io();

		if (socket.connected) {
			onConnect();
		}

		function onConnect() {
			isConnected.value = true;
			transport.value = socket.io.engine.transport.name;

			socket.io.engine.on("upgrade", (rawTransport) => {
				transport.value = rawTransport.name;
			});
		}

		function onDisconnect() {
			isConnected.value = false;
			transport.value = "N/A";
		}

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);

		return {
			provide: {
				socket,
				socketInfo: {
					isConnected,
					transport
				}
			}
		}
  }
})
