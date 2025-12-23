import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	server: {
		allowedHosts: ["localhost", ".e2b.app"],
	},
	plugins: [react()],
});
