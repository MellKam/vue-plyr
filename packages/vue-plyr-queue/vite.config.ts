import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	build: {
		lib: {
			entry: {
				index: "./src/index.ts",
			},
			formats: ["es"],
			fileName: (_format, name) => `${name}.js`,
		},
		rollupOptions: {
			external: ["vue", "plyr"],
			output: {
				globals: {
					vue: "Vue",
				},
				exports: "named",
				esModule: true,
			},
		},
	},
	plugins: [dts()],
});
