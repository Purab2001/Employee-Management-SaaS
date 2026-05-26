/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  globalSetup: "./tests/globalSetup.js",
  globalTeardown: "./tests/globalTeardown.js",
  setupFiles: ["./tests/setup.js"],
  verbose: true,
  testTimeout: 60000,
  forceExit: true,
  detectOpenHandles: true,
}
