import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },

  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    fileParallelism: false,
    pool: "forks",
    clearMocks: true,
    restoreMocks: true,
  },
});