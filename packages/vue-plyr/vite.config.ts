import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	build: {
		lib: {
			entry: {
				index: "./src/index.ts",
				utils: "./src/utils.ts",
			},
			formats: ["es"],
			fileName: (_format, name) => `${name}.js`,
		},
		rollupOptions: {
			external: ["vue", "plyr", "plyr/dist/plyr.css"],
			output: {
				exports: "named",
				esModule: true,
			},
		},
	},
	plugins: [dts()],
});
