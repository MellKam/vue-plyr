import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

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
	plugins: [vue()],
});
