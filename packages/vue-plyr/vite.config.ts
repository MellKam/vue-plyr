import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: { entry: "./src/index.ts", formats: ["es"], fileName: "index" },
		rollupOptions: {
			external: ["vue", "plyr"],
			output: {
				globals: {
					vue: "Vue",
				},
			},
		},
	},
});
