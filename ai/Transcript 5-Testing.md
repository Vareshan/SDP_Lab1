# Implementing Tests with Vitest

**User:** Anonymous  
**Created:** 8/3/2026 13:09:19  
**Updated:** 8/3/2026 13:42:41  
**Exported:** 8/3/2026 16:48:04  
**Link:** [https://chatgpt.com/g/g-p-6a6c6a7081f88191bedd443931229de8/c/6a7076b7-9fe0-83ea-af4a-7f7453c5c524](https://chatgpt.com/g/g-p-6a6c6a7081f88191bedd443931229de8/c/6a7076b7-9fe0-83ea-af4a-7f7453c5c524)  

## Prompt:
8/3/2026, 1:09:18 PM

[Attachment: image(12).png]

[Attachment: image(13).png]

Okay so now we need to implement atleast three tests that will be run using npm test, how can we go about this

## Response:
8/3/2026, 1:09:19 PM

> **Searching the web**
>
> [Testing: Vitest | Next.js](https://nextjs.org/docs/app/guides/testing/vitest)
> [Getting Started | Guide | Vitest](https://vitest.dev/guide/index.html)
> [Getting Started | Guide | Vitest](https://main.vitest.dev/guide/)
> [Getting Started | Guide | Vitest](https://v3.vitest.dev/guide/)
> [Getting Started | Guide | Vitest](https://v2.vitest.dev/guide/)
> [SQLite database connector | Prisma Documentation](https://docs.prisma.io/docs/orm/core-concepts/supported-databases/sqlite)
> [Get started with Prisma | Prisma Documentation](https://www.prisma.io/docs)
>
> **Planning test setup**
>
> I’m designing a single deterministic command that resets a throwaway SQLite database, applies the Prisma schema, runs Vitest once—not watch mode—and works across operating systems without shell-specific environment syntax.
>
> **Planned test setup**
>
> 
>
> **Refining test coverage**
>
> I’m planning three deterministic integration tests: task creation, task editing, and archiving or overdue behavior. I’ll reset an isolated database between runs, verify persisted results, and make `npm test` execute the suite once.
>
> **Refined test coverage**
>
> 
>
> **Searching the web**
>
>
> **Searched 7 websites**
>
> 
>
> Worked for 1m 4s

The best approach is to use **Vitest integration tests** that call your API route handlers and verify the resulting Prisma database records.

This matches the rubric better than simple “page renders successfully” tests because the tests will exercise actual task creation, editing, archiving, and overdue behaviour against a separate disposable database.

## Tests we should implement

I recommend these three:

1. **Creating a task**
   - Call `POST /api/tasks`.
   - Check that the response succeeds.
   - Check that the task was actually stored in the database.

2. **Editing a task**
   - Create a task in the test database.
   - Call your update route.
   - Check that the title, priority, completion state, or due date changed.

3. **Archiving a task**
   - Create a completed task.
   - Call `/api/archive`.
   - Check that the task is archived and no longer appears in the active task list.

We could add a fourth test for your overdue rule:

- An incomplete task with a due date before a fixed date should be overdue.
- A completed task should not be treated as overdue.

The dates must be fixed inside the tests rather than using the real current date. That keeps the tests deterministic.

## Step 1: Install Vitest

From the project directory, run:

```bash
npm install --save-dev vitest vite-tsconfig-paths
```

Next.js officially supports Vitest for unit testing. Vitest recognises files containing `.test.` or `.spec.` in their names. ([Next.js](https://nextjs.org/docs/app/guides/testing/vitest?utm_source=chatgpt.com))

We do not initially need React Testing Library because we are testing the API and database behaviour rather than simply rendering the interface.

## Step 2: Create `vitest.config.mts`

Create this file in the root of your project:

```text
SDP_Lab1/
├── app/
├── prisma/
├── public/
├── vitest.config.mts
└── package.json
```

Add:

```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],

  test: {
    environment: "node",

    // Tests will be stored in the tests directory.
    include: ["tests/**/*.test.ts"],

    // Prevent separate test files from modifying the same test database
    // at the same time.
    fileParallelism: false,

    clearMocks: true,
    restoreMocks: true,
  },
});
```

Vitest normally runs separate test files in parallel. Disabling file parallelism is useful when the tests share one disposable database. ([Vitest](https://main.vitest.dev/config/fileparallelism?utm_source=chatgpt.com))

## Step 3: Create a disposable test-database runner

Create:

```text
scripts/run-tests.mjs
```

Use this code:

```js
import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, "..");

const testDatabasePath = path.join(
  projectRoot,
  "prisma",
  "test.db",
);

const npxCommand =
  process.platform === "win32" ? "npx.cmd" : "npx";

const testEnvironment = {
  ...process.env,

  // Ensures that the normal development database is not used.
  DATABASE_URL: "file:./test.db",
  NODE_ENV: "test",
};

function removeTestDatabase() {
  const possibleDatabaseFiles = [
    testDatabasePath,
    `${testDatabasePath}-journal`,
    `${testDatabasePath}-shm`,
    `${testDatabasePath}-wal`,
  ];

  for (const databaseFile of possibleDatabaseFiles) {
    rmSync(databaseFile, { force: true });
  }
}

function runCommand(argumentsList) {
  const result = spawnSync(npxCommand, argumentsList, {
    cwd: projectRoot,
    env: testEnvironment,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  return result.status ?? 1;
}

let exitCode = 1;

try {
  console.log("\nCreating throwaway test database...\n");

  removeTestDatabase();

  const databaseExitCode = runCommand([
    "prisma",
    "db",
    "push",
    "--force-reset",
    "--skip-generate",
  ]);

  if (databaseExitCode !== 0) {
    throw new Error("Could not create the test database.");
  }

  console.log("\nRunning tests...\n");

  exitCode = runCommand([
    "vitest",
    "run",
  ]);
} catch (error) {
  console.error(error);
  exitCode = 1;
} finally {
  console.log("\nRemoving throwaway test database...\n");
  removeTestDatabase();
}

process.exit(exitCode);
```

This runner:

- Deletes any previous test database.
- Creates `prisma/test.db` from your Prisma schema.
- Runs all tests once.
- Deletes the test database afterwards.
- Never uses your normal development database.

Prisma recommends running integration tests against a dedicated test environment rather than the production or development database. SQLite is particularly convenient here because it is file-based. ([Prisma](https://docs.prisma.io/docs/orm/core-concepts/supported-databases/sqlite?utm_source=chatgpt.com))

## Step 4: Add the `npm test` command

In `package.json`, change the scripts section to include:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "node scripts/run-tests.mjs"
  }
}
```

You will then run everything using:

```bash
npm test
```

Using `vitest run` inside the script is important because it runs the suite once and terminates. Using only `vitest` normally opens watch mode on a development machine. ([Vitest](https://vitest.dev/guide/index.html?utm_source=chatgpt.com))

## Step 5: Document it in the README

Add a testing section:

```md
## Running the tests

Install the project dependencies:

```bash
npm install
```

Run all automated tests with:

```bash
npm test
```

The command creates a temporary SQLite test database, runs the
integration tests, and deletes the database afterwards. The development
database is not modified.
```

That directly satisfies the requirement that the tests are runnable through a **single documented command**.

## Files needed for the exact tests

The test code must match your actual Prisma fields and API methods. Send these files next:

```text
package.json
prisma/schema.prisma
src/lib/prisma.ts
src/app/api/tasks/route.ts
src/app/api/tasks/[id]/route.ts
src/app/api/archive/route.ts
```

If your project does not use a `src` directory, send the equivalent files under `app/` and `lib/`. I will then give you the complete three-or-more-test file using your real routes and database schema.

---

**Sources:**

- [Testing: Vitest | Next.js](https://nextjs.org/docs/app/guides/testing/vitest?utm_source=chatgpt.com)
- [fileParallelism | Config | Vitest](https://main.vitest.dev/config/fileparallelism?utm_source=chatgpt.com)
- [SQLite database connector | Prisma Documentation](https://docs.prisma.io/docs/orm/core-concepts/supported-databases/sqlite?utm_source=chatgpt.com)
- [Getting Started | Guide | Vitest](https://vitest.dev/guide/index.html?utm_source=chatgpt.com)

## Prompt:
8/3/2026, 1:20:50 PM

{
  "name": "coms3011a-lab1",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "node scripts/run-tests.mjs",
    "lint": "eslint"
  },
  "dependencies": {
    "@prisma/adapter-better-sqlite3": "^7.9.1",
    "@prisma/client": "^7.9.1",
    "better-sqlite3": "^13.0.2",
    "dotenv": "^17.4.2",
    "lucide-react": "^1.28.0",
    "next": "16.2.12",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.13",
    "@types/node": "^20.19.43",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.12",
    "prisma": "^7.9.1",
    "typescript": "^5",
    "vite-tsconfig-paths": "^6.1.1",
    "vitest": "^4.1.10"
  }
}

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Get a free hosted Postgres database in seconds: `npx create-db`

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "sqlite"
}

model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum TaskStatus {
  todo
  progress
  done
}

enum TaskPriority {
  Low
  Medium
  High
}

model Task {
  id           String       @id @default(cuid())
  title        String
  description  String       @default("")
  topic        String       @map("project")
  startDate    String?
  dueDate      String
  timeEstimate String
  priority     TaskPriority
  status       TaskStatus
  archivedAt   DateTime?

userId Int
user   User @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
} 

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

const taskPriorities = [
  "Low",
  "Medium",
  "High",
] as const;

const taskStatuses = [
  "todo",
  "progress",
  "done",
] as const;

type TaskPriorityValue =
  (typeof taskPriorities)[number];

type TaskStatusValue =
  (typeof taskStatuses)[number];

function isTaskPriority(
  value: unknown,
): value is TaskPriorityValue {
  return (
    typeof value === "string" &&
    taskPriorities.includes(
      value as TaskPriorityValue,
    )
  );
}

function isTaskStatus(
  value: unknown,
): value is TaskStatusValue {
  return (
    typeof value === "string" &&
    taskStatuses.includes(
      value as TaskStatusValue,
    )
  );
}

function isValidDateString(
  value: unknown,
): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00`);

  return !Number.isNaN(parsedDate.getTime());
}

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      orderBy: {
        id: "asc",
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          tasks: [],
          error:
            "The local user has not been created.",
        },
        { status: 404 },
      );
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        archivedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        tasks,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Failed to retrieve tasks:",
      error,
    );

    return NextResponse.json(
      {
        tasks: [],
        error:
          "Something went wrong while retrieving the tasks.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await prisma.user.findFirst({
      orderBy: {
        id: "asc",
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "The local user has not been created.",
        },
        { status: 404 },
      );
    }

    const body = (await request.json()) as {
      title?: unknown;
      description?: unknown;
      topic?: unknown;
      startDate?: unknown;
      dueDate?: unknown;
      timeEstimate?: unknown;
      priority?: unknown;
      status?: unknown;
    };

    if (
      typeof body.title !== "string" ||
      body.title.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error: "A task title is required.",
        },
        { status: 400 },
      );
    }

    if (
      typeof body.description !== "string" ||
      body.description.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "A task description is required.",
        },
        { status: 400 },
      );
    }

    if (
      typeof body.topic !== "string" ||
      body.topic.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error: "A task topic is required.",
        },
        { status: 400 },
      );
    }

    if (!isValidDateString(body.startDate)) {
      return NextResponse.json(
        {
          error:
            "A valid task start date is required.",
        },
        { status: 400 },
      );
    }

    if (!isValidDateString(body.dueDate)) {
      return NextResponse.json(
        {
          error:
            "A valid task due date is required.",
        },
        { status: 400 },
      );
    }

    if (body.startDate > body.dueDate) {
      return NextResponse.json(
        {
          error:
            "The start date cannot be after the due date.",
        },
        { status: 400 },
      );
    }

    if (
      typeof body.timeEstimate !== "string" ||
      body.timeEstimate.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "A time estimate is required.",
        },
        { status: 400 },
      );
    }

    if (!isTaskPriority(body.priority)) {
      return NextResponse.json(
        {
          error:
            "The task priority is invalid.",
        },
        { status: 400 },
      );
    }

    if (!isTaskStatus(body.status)) {
      return NextResponse.json(
        {
          error:
            "The task status is invalid.",
        },
        { status: 400 },
      );
    }

    const task = await prisma.task.create({
      data: {
        title: body.title.trim(),
        description:
          body.description.trim(),
        topic: body.topic.trim(),
        startDate: body.startDate,
        dueDate: body.dueDate,
        timeEstimate:
          body.timeEstimate.trim(),
        priority: body.priority,
        status: body.status,
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        message:
          "Task created successfully.",
        task,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Failed to create task:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while creating the task.",
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

const taskPriorities = [
  "Low",
  "Medium",
  "High",
] as const;

const taskStatuses = [
  "todo",
  "progress",
  "done",
] as const;

const taskActions = [
  "edit",
  "archive",
] as const;

type TaskPriorityValue =
  (typeof taskPriorities)[number];

type TaskStatusValue =
  (typeof taskStatuses)[number];

type TaskActionValue =
  (typeof taskActions)[number];

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function isTaskPriority(
  value: unknown,
): value is TaskPriorityValue {
  return (
    typeof value === "string" &&
    taskPriorities.includes(
      value as TaskPriorityValue,
    )
  );
}

function isTaskStatus(
  value: unknown,
): value is TaskStatusValue {
  return (
    typeof value === "string" &&
    taskStatuses.includes(
      value as TaskStatusValue,
    )
  );
}

function isTaskAction(
  value: unknown,
): value is TaskActionValue {
  return (
    typeof value === "string" &&
    taskActions.includes(
      value as TaskActionValue,
    )
  );
}

function isValidDateString(
  value: unknown,
): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00`);

  return !Number.isNaN(parsedDate.getTime());
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findFirst({
      orderBy: {
        id: "asc",
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "The local user has not been created.",
        },
        { status: 404 },
      );
    }

    const existingTask =
      await prisma.task.findFirst({
        where: {
          id,
          userId: user.id,
          archivedAt: null,
        },
      });

    if (!existingTask) {
      return NextResponse.json(
        {
          error:
            "The requested task could not be found.",
        },
        { status: 404 },
      );
    }

    const body = (await request.json()) as {
      action?: unknown;
      title?: unknown;
      description?: unknown;
      topic?: unknown;
      startDate?: unknown;
      dueDate?: unknown;
      timeEstimate?: unknown;
      priority?: unknown;
      status?: unknown;
    };

    if (body.action === "archive") {
      const archivedTask =
        await prisma.task.update({
          where: {
            id: existingTask.id,
          },
          data: {
            archivedAt: new Date(),
          },
        });

      return NextResponse.json(
        {
          message:
            "Task archived successfully.",
          task: archivedTask,
        },
        { status: 200 },
      );
    }

    if (body.action === "edit") {
      if (
        typeof body.title !== "string" ||
        body.title.trim().length === 0
      ) {
        return NextResponse.json(
          {
            error:
              "A task title is required.",
          },
          { status: 400 },
        );
      }

      if (
        typeof body.description !== "string" ||
        body.description.trim().length === 0
      ) {
        return NextResponse.json(
          {
            error:
              "A task description is required.",
          },
          { status: 400 },
        );
      }

      if (
        typeof body.topic !== "string" ||
        body.topic.trim().length === 0
      ) {
        return NextResponse.json(
          {
            error:
              "A task topic is required.",
          },
          { status: 400 },
        );
      }

      if (!isValidDateString(body.startDate)) {
        return NextResponse.json(
          {
            error:
              "A valid task start date is required.",
          },
          { status: 400 },
        );
      }

      if (!isValidDateString(body.dueDate)) {
        return NextResponse.json(
          {
            error:
              "A valid task due date is required.",
          },
          { status: 400 },
        );
      }

      if (body.startDate > body.dueDate) {
        return NextResponse.json(
          {
            error:
              "The start date cannot be after the due date.",
          },
          { status: 400 },
        );
      }

      if (
        typeof body.timeEstimate !== "string" ||
        body.timeEstimate.trim().length === 0
      ) {
        return NextResponse.json(
          {
            error:
              "A time estimate is required.",
          },
          { status: 400 },
        );
      }

      if (!isTaskPriority(body.priority)) {
        return NextResponse.json(
          {
            error:
              "The task priority is invalid.",
          },
          { status: 400 },
        );
      }

      if (!isTaskStatus(body.status)) {
        return NextResponse.json(
          {
            error:
              "The task status is invalid.",
          },
          { status: 400 },
        );
      }

      const updatedTask =
        await prisma.task.update({
          where: {
            id: existingTask.id,
          },
          data: {
            title: body.title.trim(),
            description:
              body.description.trim(),
            topic: body.topic.trim(),
            startDate: body.startDate,
            dueDate: body.dueDate,
            timeEstimate:
              body.timeEstimate.trim(),
            priority: body.priority,
            status: body.status,
          },
        });

      return NextResponse.json(
        {
          message:
            "Task updated successfully.",
          task: updatedTask,
        },
        { status: 200 },
      );
    }

    if (
      body.action !== undefined &&
      !isTaskAction(body.action)
    ) {
      return NextResponse.json(
        {
          error:
            "The requested task action is invalid.",
        },
        { status: 400 },
      );
    }

    if (!isTaskStatus(body.status)) {
      return NextResponse.json(
        {
          error:
            "A valid task status is required.",
        },
        { status: 400 },
      );
    }

    const updatedTask =
      await prisma.task.update({
        where: {
          id: existingTask.id,
        },
        data: {
          status: body.status,
        },
      });

    return NextResponse.json(
      {
        message:
          "Task status updated successfully.",
        task: updatedTask,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Failed to update task:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while updating the task.",
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      orderBy: {
        id: "asc",
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          tasks: [],
          error: "The local user has not been created.",
        },
        { status: 404 },
      );
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        archivedAt: {
          not: null,
        },
      },
      orderBy: {
        archivedAt: "desc",
      },
    });

    return NextResponse.json(
      {
        tasks,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Failed to retrieve archived tasks:",
      error,
    );

    return NextResponse.json(
      {
        tasks: [],
        error:
          "Something went wrong while retrieving archived tasks.",
      },
      { status: 500 },
    );
  }
}

## Response:
8/3/2026, 1:21:01 PM

> **Testing the API**
>
> I’m planning a minimal Vitest integration suite for creation, editing/status updates, archiving, and active-task retrieval. I’m also checking database configuration so tests use a disposable SQLite file rather than development data.
>
> **Tested the API**
>
> 
>
> **Searching the web**
>
> [SQLite database connector - Prisma ORM](https://www.prisma.io/docs/orm/v6/overview/databases/sqlite)
> [Prisma](https://www.prisma.org.pe/)
> [Parallelism | Guide](https://vitest.dev/guide/parallelism)
> [Testing: Vitest](https://nextjs.org/docs/app/guides/testing/vitest)
> [Parallelism | Guide](https://v3.vitest.dev/guide/parallelism)
> [Watch Config 2026 from anywhere in the world](https://config.figma.com/san-francisco/virtual/)
> [E-Config | Konfigurační software](https://www.eaton.com/cz/cs-cz/support/e-config-konfiguracni-software-a-cenik.html)
> [Configuration file](https://en.wikipedia.org/wiki/Configuration_file)
>
> **Building integration coverage**
>
> I’m settling on route-level Vitest tests backed by a disposable SQLite database. I’ll cover task creation, editing, status changes, archiving, and filtering archived tasks, while isolating development data through an environment-based connection string.
>
> **Built integration coverage**
>
> 
>
> **Searching the web**
>
>
> **Searched 8 websites**
>
> 
>
> Worked for 2m 20s

Your `package.json` is already set up correctly: Vitest is installed and `npm test` points to `scripts/run-tests.mjs`.

We will add **three integration tests**:

1. Creating a task.
2. Editing a task.
3. Archiving a task and confirming that it moves from the active list to the archive.

These tests call your real route handlers and use a temporary SQLite database, so they exercise genuine application behaviour rather than only checking whether a component renders.

## 1. Update `lib/prisma.ts`

Your current file always connects to:

```ts
url: "file:./dev.db",
```

That would cause the tests to use your development database. Replace the full file with:

```ts
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const databaseUrl =
  process.env.DATABASE_URL ??
  "file:./dev.db";

const adapter = new PrismaBetterSqlite3({
  url: databaseUrl,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

Now the normal application still uses `dev.db`, but the testing script can set `DATABASE_URL` to a separate test database. Prisma 7 requires the driver adapter to receive the database URL in application code when Prisma Client is created. ([Prisma](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7?utm_source=chatgpt.com))

---

## 2. Create `vitest.config.mts`

Create this file in the project root, alongside `package.json`:

```text
coms3011a-lab1/
├── lib/
├── prisma/
├── scripts/
├── src/
├── tests/
├── package.json
└── vitest.config.mts
```

Add:

```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],

  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],

    // The tests share one temporary SQLite database.
    fileParallelism: false,

    // Prisma and better-sqlite3 work more reliably in
    // separate processes than worker threads.
    pool: "forks",

    clearMocks: true,
    restoreMocks: true,
  },
});
```

Vitest normally runs different test files in parallel. Disabling file parallelism prevents multiple files from modifying the same test database simultaneously, while the `forks` pool is appropriate for native dependencies such as Prisma and `better-sqlite3`. ([Vitest](https://vitest.dev/guide/parallelism?utm_source=chatgpt.com))

---

## 3. Create `scripts/run-tests.mjs`

Create the `scripts` folder if it does not already exist, then create:

```text
scripts/run-tests.mjs
```

Add:

```js
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
  "test.db",
);

const testDatabaseUrl = "file:./test.db";

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
    },
  );

  if (result.error) {
    throw result.error;
  }

  return result.status ?? 1;
}

let exitCode = 1;

try {
  console.log(
    "\nCreating temporary test database...\n",
  );

  removeTestDatabase();

  const databaseExitCode = runCommand([
    "prisma",
    "db",
    "push",
    "--url",
    testDatabaseUrl,
  ]);

  if (databaseExitCode !== 0) {
    throw new Error(
      "The temporary test database could not be created.",
    );
  }

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
```

The script deliberately uses `test.db`, not `dev.db`. It removes the test database before and after every run.

Prisma's `db push` command can create a new database from the schema and supports overriding the configured datasource URL with `--url`. In Prisma 7, the old `--skip-generate` option was removed because `db push` no longer generates Prisma Client automatically. ([Prisma](https://docs.prisma.io/docs/cli/db/push?utm_source=chatgpt.com))

---

## 4. Create the integration tests

Create:

```text
tests/tasks.integration.test.ts
```

Add the following full code:

```ts
import {
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import prisma from "../lib/prisma";

import {
  GET as getActiveTasks,
  POST as createTask,
} from "../src/app/api/tasks/route";

import {
  PATCH as updateTask,
} from "../src/app/api/tasks/[id]/route";

import {
  GET as getArchivedTasks,
} from "../src/app/api/archive/route";

let testUserId: number;

function createJsonRequest(
  url: string,
  method: "POST" | "PATCH",
  body: object,
) {
  return new Request(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

beforeEach(async () => {
  // Tasks must be removed first because they
  // reference users through a foreign key.
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const testUser = await prisma.user.create({
    data: {
      username: "integration-test-user",
    },
  });

  testUserId = testUser.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Task API integration tests", () => {
  it(
    "creates a task and stores it in the database",
    async () => {
      const request = createJsonRequest(
        "http://localhost/api/tasks",
        "POST",
        {
          title: "Complete testing section",
          description:
            "Add integration tests for the task tracker.",
          topic: "COMS3011A",
          startDate: "2026-08-03",
          dueDate: "2026-08-10",
          timeEstimate: "3 hours",
          priority: "High",
          status: "todo",
        },
      );

      const response = await createTask(
        request,
      );

      expect(response.status).toBe(201);

      const responseBody =
        (await response.json()) as {
          message: string;
          task: {
            id: string;
            title: string;
            description: string;
            topic: string;
            priority: string;
            status: string;
          };
        };

      expect(responseBody.message).toBe(
        "Task created successfully.",
      );

      expect(responseBody.task).toMatchObject({
        title: "Complete testing section",
        description:
          "Add integration tests for the task tracker.",
        topic: "COMS3011A",
        priority: "High",
        status: "todo",
      });

      const storedTask =
        await prisma.task.findUnique({
          where: {
            id: responseBody.task.id,
          },
        });

      expect(storedTask).not.toBeNull();

      expect(storedTask).toMatchObject({
        title: "Complete testing section",
        description:
          "Add integration tests for the task tracker.",
        topic: "COMS3011A",
        startDate: "2026-08-03",
        dueDate: "2026-08-10",
        timeEstimate: "3 hours",
        priority: "High",
        status: "todo",
        userId: testUserId,
        archivedAt: null,
      });
    },
  );

  it(
    "edits an existing task and saves the changes",
    async () => {
      const originalTask =
        await prisma.task.create({
          data: {
            title: "Original title",
            description:
              "Original task description.",
            topic: "COMS3011A",
            startDate: "2026-08-03",
            dueDate: "2026-08-10",
            timeEstimate: "1 hour",
            priority: "Low",
            status: "todo",
            userId: testUserId,
          },
        });

      const request = createJsonRequest(
        `http://localhost/api/tasks/${originalTask.id}`,
        "PATCH",
        {
          action: "edit",
          title: "Updated title",
          description:
            "Updated task description.",
          topic: "Software Design",
          startDate: "2026-08-04",
          dueDate: "2026-08-20",
          timeEstimate: "4 hours",
          priority: "High",
          status: "progress",
        },
      );

      const response = await updateTask(
        request,
        {
          params: Promise.resolve({
            id: originalTask.id,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody =
        (await response.json()) as {
          message: string;
          task: {
            id: string;
            title: string;
            priority: string;
            status: string;
          };
        };

      expect(responseBody.message).toBe(
        "Task updated successfully.",
      );

      expect(responseBody.task).toMatchObject({
        id: originalTask.id,
        title: "Updated title",
        priority: "High",
        status: "progress",
      });

      const updatedTask =
        await prisma.task.findUnique({
          where: {
            id: originalTask.id,
          },
        });

      expect(updatedTask).toMatchObject({
        title: "Updated title",
        description:
          "Updated task description.",
        topic: "Software Design",
        startDate: "2026-08-04",
        dueDate: "2026-08-20",
        timeEstimate: "4 hours",
        priority: "High",
        status: "progress",
      });
    },
  );

  it(
    "archives a task, removes it from active tasks and adds it to the archive",
    async () => {
      const completedTask =
        await prisma.task.create({
          data: {
            title: "Completed task",
            description:
              "A completed task ready to be archived.",
            topic: "COMS3011A",
            startDate: "2026-08-01",
            dueDate: "2026-08-03",
            timeEstimate: "2 hours",
            priority: "Medium",
            status: "done",
            userId: testUserId,
          },
        });

      const archiveRequest =
        createJsonRequest(
          `http://localhost/api/tasks/${completedTask.id}`,
          "PATCH",
          {
            action: "archive",
          },
        );

      const archiveResponse =
        await updateTask(
          archiveRequest,
          {
            params: Promise.resolve({
              id: completedTask.id,
            }),
          },
        );

      expect(
        archiveResponse.status,
      ).toBe(200);

      const archiveResponseBody =
        (await archiveResponse.json()) as {
          message: string;
          task: {
            id: string;
            archivedAt: string | null;
          };
        };

      expect(
        archiveResponseBody.message,
      ).toBe(
        "Task archived successfully.",
      );

      expect(
        archiveResponseBody.task.archivedAt,
      ).not.toBeNull();

      const storedArchivedTask =
        await prisma.task.findUnique({
          where: {
            id: completedTask.id,
          },
        });

      expect(
        storedArchivedTask?.archivedAt,
      ).toBeInstanceOf(Date);

      // Archived task should not be returned
      // by the active-task endpoint.
      const activeResponse =
        await getActiveTasks();

      expect(activeResponse.status).toBe(200);

      const activeBody =
        (await activeResponse.json()) as {
          tasks: Array<{
            id: string;
          }>;
        };

      expect(
        activeBody.tasks.some(
          (task) =>
            task.id === completedTask.id,
        ),
      ).toBe(false);

      // Archived task should be returned
      // by the archive endpoint.
      const archivedResponse =
        await getArchivedTasks();

      expect(
        archivedResponse.status,
      ).toBe(200);

      const archivedBody =
        (await archivedResponse.json()) as {
          tasks: Array<{
            id: string;
          }>;
        };

      expect(
        archivedBody.tasks.some(
          (task) =>
            task.id === completedTask.id,
        ),
      ).toBe(true);
    },
  );
});
```

## 5. Update `.gitignore`

Add these lines so the temporary database cannot be committed:

```gitignore
# Temporary integration-test database
/test.db
/test.db-journal
/test.db-shm
/test.db-wal
```

## 6. Document the command in `README.md`

Add:

```md
## Testing

The repository contains integration tests for creating,
editing and archiving tasks.

Run all tests with:

```bash
npm test
```

The command creates a temporary SQLite database, applies the
Prisma schema, runs the tests and deletes the database
afterwards. The development database is not modified.
```

## 7. Run the tests

From the project root:

```bash
npm test
```

You should get output similar to:

```text
Creating temporary test database...

Running tests...

✓ creates a task and stores it in the database
✓ edits an existing task and saves the changes
✓ archives a task, removes it from active tasks and adds it to the archive

Test Files  1 passed
Tests       3 passed

Removing temporary test database...
```

This reaches the rubric’s **complete** category because the repository has three deterministic tests, includes real archiving behaviour, runs against a throwaway database and uses one documented command.

---

**Sources:**

- [Upgrade to Prisma ORM 7](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7?utm_source=chatgpt.com)
- [Parallelism | Guide](https://vitest.dev/guide/parallelism?utm_source=chatgpt.com)
- [prisma db push | Apply Schema to Database (No Migrations) | Prisma Documentation](https://docs.prisma.io/docs/cli/db/push?utm_source=chatgpt.com)

## Prompt:
8/3/2026, 1:31:21 PM

> coms3011a-lab1@0.1.0 test
> node scripts/run-tests.mjs


Creating temporary test database...

Error: spawnSync npx.cmd EINVAL
    at Object.spawnSync (node:internal/child_process:1119:20)
    at spawnSync (node:child_process:911:24)
    at runCommand (file:///C:/Users/vares/OneDrive/Desktop/WITS%203rd%20Year/SDP/Labs/Lab1/coms3011a-lab1/scripts/run-tests.mjs:49:18)
    at file:///C:/Users/vares/OneDrive/Desktop/WITS%203rd%20Year/SDP/Labs/Lab1/coms3011a-lab1/scripts/run-tests.mjs:75:28
    at ModuleJob.run (node:internal/modules/esm/module_job:430:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:661:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  errno: -4071,
  code: 'EINVAL',
  syscall: 'spawnSync npx.cmd',
  path: 'npx.cmd',
  spawnargs: [ 'prisma', 'db', 'push', '--url', 'file:./test.db' ]
}

Removing temporary test database...

## Response:
8/3/2026, 1:31:23 PM

> **Searching the web**
>
> [Wednesday, April 10, 2024 Security Releases](https://nodejs.org/en/blog/vulnerability/april-2024-security-releases-2)
> [Upgrade to Prisma ORM 7](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7)
> [Command Line Interface | Guide](https://vitest.dev/guide/cli)
> [Guide (film)](https://en.wikipedia.org/wiki/Guide_%28film%29)
> [child_process](https://www.npmjs.com/package/child_process)
> [Getting to know Node's child_process module](https://medium.com/the-guild/getting-to-know-nodes-child-process-module-8ed63038f3fa)
> [Command Line Interface | Guide | Vitest v0.34](https://v0.vitest.dev/guide/cli)
> [Command Line Interface | Guide](https://v2.vitest.dev/guide/cli)
> [Node child_process.spawn function | API Reference](https://bun.com/reference/node/child_process/spawn)
> [node.js - what does require("child_process") actually do?](https://stackoverflow.com/questions/27690061/what-does-requirechild-process-actually-do)
>
> **Fixing Windows execution**
>
> The failure is coming from Windows refusing to launch the package runner directly, before Prisma or the tests start. I’m updating the command runner to use the Windows shell, then the same script can be retried.
>
> **Fixed Windows execution**
>
> 
>
> **Searching the web**
>
>
> **Searched 10 websites**
>
> 
>
> Worked for 46s

The error occurs because Windows runs `npx` through `npx.cmd`. Newer Node.js versions reject `.cmd` files passed to `spawnSync()` unless the shell option is enabled, producing the `EINVAL` error you received. ([Node.js](https://nodejs.org/en/blog/vulnerability/april-2024-security-releases-2))

Open:

```text
scripts/run-tests.mjs
```

Replace your current `runCommand` function with this:

```js
function runCommand(argumentsList) {
  const result = spawnSync(
    npxCommand,
    argumentsList,
    {
      cwd: projectRoot,
      env: testEnvironment,
      stdio: "inherit",

      // Required when executing npx.cmd on Windows.
      shell: process.platform === "win32",
    },
  );

  if (result.error) {
    throw result.error;
  }

  return result.status ?? 1;
}
```

The only added line is:

```js
shell: process.platform === "win32",
```

Now run:

```bash
npm test
```

This should allow the Prisma command to start. Send the new terminal output after running it, since Prisma may expose a separate configuration issue once this Windows-specific error is cleared.

---

**Sources:**

- [Node.js — Wednesday, April 10, 2024 Security Releases](https://nodejs.org/en/blog/vulnerability/april-2024-security-releases-2)

## Prompt:
8/3/2026, 1:34:01 PM

> coms3011a-lab1@0.1.0 test
> node scripts/run-tests.mjs


Creating temporary test database...

Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma\schema.prisma.
Datasource "db": SQLite database "test.db" at "file:./test.db"

SQLite database test.db created at file:./test.db

Your database is now in sync with your Prisma schema. Done in 53ms


Running tests...

The plugin "vite-tsconfig-paths" is detected. Vite now supports tsconfig paths resolution natively via the resolve.tsconfigPaths option. You can remove the plugin and set resolve.tsconfigPaths: true in your Vite config instead.

 RUN  v4.1.10 C:/Users/vares/OneDrive/Desktop/WITS 3rd Year/SDP/Labs/Lab1/coms3011a-lab1

 ✓ tests/tasks.integration.test.ts (3 tests) 304ms
   ✓ Task API integration tests (3)
     ✓ creates a task and stores it in the database 219ms
     ✓ edits an existing task and saves the changes 41ms
     ✓ archives a task, removes it from active tasks and adds it to the archive 40ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  13:33:23
   Duration  1.35s (transform 189ms, setup 0ms, import 519ms, tests 304ms, environment 0ms)


Removing temporary test database...

## Response:
8/3/2026, 1:34:09 PM

Everything is working correctly.

Your output confirms that:

- The temporary `test.db` was created successfully.
- The Prisma schema was applied to it.
- All **3 integration tests passed**.
- The tests exercised creating, editing, and archiving tasks.
- The temporary database was removed afterwards.
- Everything runs through the single documented command:

```bash
npm test
```

That satisfies the testing requirement and should qualify for the **complete** rubric category.

The `vite-tsconfig-paths` message is only a warning. To remove it, update `vitest.config.mts` to:

```ts
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
```

You can then remove the unnecessary package:

```bash
npm uninstall vite-tsconfig-paths
```

Run these final checks before committing:

```bash
npm test
npm run lint
npm run build
```

Your testing implementation is complete.

## Prompt:
8/3/2026, 1:36:46 PM

> coms3011a-lab1@0.1.0 lint
> eslint


C:\Users\vares\OneDrive\Desktop\WITS 3rd Year\SDP\Labs\Lab1\coms3011a-lab1\src\app\page.tsx
  717:9  error  Error: Calling setState synchronously within an effect can trigger cascading renders

Effects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:
* Update external systems with the latest state from React.
* Subscribe for updates from some external system, calling setState in a callback function when external state changes.

Calling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).

C:\Users\vares\OneDrive\Desktop\WITS 3rd Year\SDP\Labs\Lab1\coms3011a-lab1\src\app\page.tsx:717:9
  715 |         )
  716 |       ) {
> 717 |         setDismissedNotificationIds(parsedIds);
      |         ^^^^^^^^^^^^^^^^^^^^^^^^^^^ Avoid calling setState() directly within an effect
  718 |       }
  719 |     } catch (error) {
  720 |       console.error(        react-hooks/set-state-in-effect
  803:5  error  Error: Calling setState synchronously within an effect can trigger cascading renders

Effects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:
* Update external systems with the latest state from React.
* Subscribe for updates from some external system, calling setState in a callback function when external state changes.

Calling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).

C:\Users\vares\OneDrive\Desktop\WITS 3rd Year\SDP\Labs\Lab1\coms3011a-lab1\src\app\page.tsx:803:5
  801 |     const selectedTheme = savedTheme ?? systemTheme;
  802 |
> 803 |     setTheme(selectedTheme);
      |     ^^^^^^^^ Avoid calling setState() directly within an effect
  804 |
  805 |     document.documentElement.dataset.theme =
  806 |       selectedTheme;  react-hooks/set-state-in-effect

✖ 2 problems (2 errors, 0 warnings)

I got this when i ran npm run lint

## Response:
8/3/2026, 1:37:25 PM

> **Refactoring initialization**
>
> I’m planning to replace the effect’s synchronous state updates with lazy initializers or derived values. I’ll preserve SSR behavior and validate stored settings while avoiding additional lint warnings from other setters in the same effect.
>
> **Refactored initialization**
>
> 
>
> **Fixed theme hydration, lint errors, and client state initialization mismatches**
>
> 
>
> **Searching the web**
>
> [You Might Not Need an Effect – React](https://react.dev/learn/you-might-not-need-an-effect)
> [使用 Effect 进行同步 – React 中文文档](https://zh-hans.react.dev/learn/synchronizing-with-effects)
> [set-state-in-effect – React](https://tr.react.dev/reference/eslint-plugin-react-hooks/lints/set-state-in-effect)
> [useState – React](https://uk.react.dev/reference/react/useState)
> [Component – React](https://ar.react.dev/reference/react/Component)
> [エフェクトを使って同期を行う – React](https://ja.react.dev/learn/synchronizing-with-effects)
>
> **Searched 6 websites**
>
> 
>
> Worked for 2m 14s

Your tests are fine. These two errors come from existing `useEffect` blocks in `page.tsx`: one restores dismissed notifications from `localStorage`, and the other initializes the theme, date, greeting, and calendar. `page-calendar-polished.tsx`

React’s newer lint rule rejects an immediate `setState` call inside an effect because it causes another synchronous render cycle. ([React](https://tr.react.dev/reference/eslint-plugin-react-hooks/lints/set-state-in-effect))

Because these values depend on browser-only information such as `localStorage`, `matchMedia`, and the user’s local time, we can keep the post-mount initialization but move it into a browser callback.

## 1. Replace the dismissed-notifications effect

Find this effect:

```ts
useEffect(() => {
  try {
    const savedDismissedIds = localStorage.getItem(
      dismissedNotificationsStorageKey,
    );

    // ...
  } catch (error) {
    // ...
  }
}, []);
```

Replace the entire effect with:

```ts
useEffect(() => {
  const animationFrameId =
    window.requestAnimationFrame(() => {
      try {
        const savedDismissedIds =
          localStorage.getItem(
            dismissedNotificationsStorageKey,
          );

        if (!savedDismissedIds) {
          return;
        }

        const parsedIds = JSON.parse(
          savedDismissedIds,
        ) as unknown;

        if (
          Array.isArray(parsedIds) &&
          parsedIds.every(
            (taskId) =>
              typeof taskId === "string",
          )
        ) {
          setDismissedNotificationIds(
            parsedIds,
          );
        }
      } catch (error) {
        console.error(
          "Failed to load dismissed notifications:",
          error,
        );
      }
    });

  return () => {
    window.cancelAnimationFrame(
      animationFrameId,
    );
  };
}, []);
```

## 2. Replace the theme/date effect

Find the effect beginning with:

```ts
useEffect(() => {
  const savedTheme = localStorage.getItem(
    "task-tracker-theme",
  ) as Theme | null;
```

Replace that entire effect with:

```ts
useEffect(() => {
  const animationFrameId =
    window.requestAnimationFrame(() => {
      const savedTheme = localStorage.getItem(
        "task-tracker-theme",
      );

      const systemTheme: Theme =
        window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches
          ? "dark"
          : "light";

      const selectedTheme: Theme =
        savedTheme === "light" ||
        savedTheme === "dark"
          ? savedTheme
          : systemTheme;

      setTheme(selectedTheme);

      document.documentElement.dataset.theme =
        selectedTheme;

      const now = new Date();
      const hour = now.getHours();

      const todayISO = formatDateInput(now);

      setCurrentDateISO(todayISO);

      setCalendarStartDate(
        formatDateInput(
          getStartOfWeek(now),
        ),
      );

      setCurrentDate(
        new Intl.DateTimeFormat("en-ZA", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }).format(now),
      );

      if (hour < 12) {
        setGreeting("Good morning");
      } else if (hour < 18) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }
    });

  return () => {
    window.cancelAnimationFrame(
      animationFrameId,
    );
  };
}, []);
```

This also improves the saved-theme validation. Previously, any stored string was being forcibly treated as a valid `Theme`.

## 3. Run the checks again

```bash
npm run lint
```

Then run:

```bash
npm test
npm run build
```

The state updates now occur inside the scheduled browser callback rather than synchronously inside the effect body, so those two lint errors should disappear.

---

**Sources:**

- [set-state-in-effect – React](https://tr.react.dev/reference/eslint-plugin-react-hooks/lints/set-state-in-effect)



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)