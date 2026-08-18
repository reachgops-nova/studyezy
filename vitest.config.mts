import path from "node:path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
    // e2e/ holds Playwright specs (their own `test`/`expect` runtime, run via
    // `npm run test:e2e`) - excluded here so Vitest's default *.spec.ts glob
    // doesn't also try to collect and execute them under the wrong runner.
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
