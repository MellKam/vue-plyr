import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: {
				index: "./src/index.ts"
			},
			formats: ["es", "cjs"]
		},
		rollupOptions: {
			external: ["vue", "plyr"],
			output: {
				exports: "named"
			}
		}
	}
});
