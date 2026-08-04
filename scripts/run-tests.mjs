import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDirectory = path.dirname(
  fileURLToPath(import.meta.url),
);

const projectRoot = path.resolve(
  scriptsDirectory,
  "..",
);

const testDatabasePath = path.join(
  projectRoot,
  "prisma",
  "test.db",
);

const testDatabaseUrl =
  "file:./prisma/test.db";

const npxCommand =
  process.platform === "win32"
    ? "npx.cmd"
    : "npx";

const testEnvironment = {
  ...process.env,
  NODE_ENV: "test",
  DATABASE_URL: testDatabaseUrl,
};

function removeTestDatabase() {
  const databaseFiles = [
    testDatabasePath,
    `${testDatabasePath}-journal`,
    `${testDatabasePath}-shm`,
    `${testDatabasePath}-wal`,
  ];

  for (const databaseFile of databaseFiles) {
    rmSync(databaseFile, {
      force: true,
    });
  }
}

function runCommand(argumentsList) {
  const result = spawnSync(
    npxCommand,
    argumentsList,
    {
      cwd: projectRoot,
      env: testEnvironment,
      stdio: "inherit",
      shell: process.platform === "win32",
    },
  );

  if (result.error) {
    throw result.error;
  }

  return result.status ?? 1;
}

function ensureCommandSucceeded(
  exitCode,
  errorMessage,
) {
  if (exitCode !== 0) {
    throw new Error(errorMessage);
  }
}

let exitCode = 1;

try {
  console.log(
    "\nCreating temporary test database...\n",
  );

  removeTestDatabase();

  const generateExitCode = runCommand([
    "prisma",
    "generate",
  ]);

  ensureCommandSucceeded(
    generateExitCode,
    "Prisma Client could not be generated.",
  );

  const databaseExitCode = runCommand([
    "prisma",
    "db",
    "push",
  ]);

  ensureCommandSucceeded(
    databaseExitCode,
    "The temporary test database could not be created.",
  );

  console.log("\nRunning tests...\n");

  exitCode = runCommand([
    "vitest",
    "run",
  ]);
} catch (error) {
  console.error(error);
  exitCode = 1;
} finally {
  console.log(
    "\nRemoving temporary test database...\n",
  );

  removeTestDatabase();
}

process.exit(exitCode);