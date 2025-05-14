// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	future: {
    compatibilityVersion: 4,
  },
	vite: {
    server: {
      host: '0.0.0.0', // Or your desired host
      hmr: {
        protocol: 'ws', // Or 'wss' if using HTTPS
      },
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
	},
	nitro: {
    storage: {
      redis: {
        driver: 'redis',
        /* redis connector options */
        port: 6379, // Redis port
        host: "127.0.0.1", // Redis host
        username: "", // needs Redis >= 6
        password: "",
        db: 0, // Defaults to 0
        tls: {} // tls/ssl
      }
    },
		experimental: {
			websocket: true
		},
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@prisma/nuxt'
  ],
	plugins: [],
	css: ['~/assets/css/main.css']
})
