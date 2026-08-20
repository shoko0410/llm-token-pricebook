import { defineConfig } from "vite";

// A repository Pages site is served below /<repository>/, while local previews
// are served from /.  GitHub Actions sets GITHUB_ACTIONS for the Pages build.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/llm-token-pricebook/" : "/",
  build: {
    outDir: "site",
    emptyOutDir: true,
  },
});
