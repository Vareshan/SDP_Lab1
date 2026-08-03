# Raj's SDP - Implementing Tests with Vitest

> **Platform:** chatgpt  ·  **Messages:** 6  ·  **Exported:** August 3, 2026

---

### Turn 1 — 👤 You

Okay so now we need to implement atleast three tests that will be run using npm test, how can we go about this

---

### Turn 2 — 🤖 Assistant

The error occurs because Windows runs npx through npx.cmd. Newer Node.js versions reject .cmd files passed to spawnSync() unless the shell option is enabled, producing the EINVAL error you received. Node.js
Open:

Replace your current runCommand function with this:

The only added line is:

Now run:

This should allow the Prisma command to start. Send the new terminal output after running it, since Prisma may expose a separate configuration issue once this Windows-specific error is cleared.

```text
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

```text
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

```text
shell: process.platform === "win32",
```

```text
shell: process.platform === "win32",
```

---

### Turn 3 — 👤 You

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

---

### Turn 4 — 🤖 Assistant

Everything is working correctly.
Your output confirms that:

The temporary test.db was created successfully.

The Prisma schema was applied to it.

All 3 integration tests passed.

The tests exercised creating, editing, and archiving tasks.

The temporary database was removed afterwards.

Everything runs through the single documented command:

That satisfies the testing requirement and should qualify for the complete rubric category.
The vite-tsconfig-paths message is only a warning. To remove it, update vitest.config.mts to:

You can then remove the unnecessary package:

Run these final checks before committing:

Your testing implementation is complete.

```text
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

```text
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

```text
npm uninstall vite-tsconfig-paths
```

```text
npm uninstall vite-tsconfig-paths
```

```text
npm test
npm run lint
npm run build
```

```text
npm test
npm run lint
npm run build
```

---

### Turn 5 — 👤 You

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

---

### Turn 6 — 🤖 Assistant

Your tests are fine. These two errors come from existing useEffect blocks in page.tsx: one restores dismissed notifications from localStorage, and the other initializes the theme, date, greeting, and calendar. 
React’s newer lint rule rejects an immediate setState call inside an effect because it causes another synchronous render cycle. React+1
Because these values depend on browser-only information such as localStorage, matchMedia, and the user’s local time, we can keep the post-mount initialization but move it into a browser callback.
1. Replace the dismissed-notifications effect
Find this effect:

Replace the entire effect with:

2. Replace the theme/date effect
Find the effect beginning with:

Replace that entire effect with:

This also improves the saved-theme validation. Previously, any stored string was being forcibly treated as a valid Theme.
3. Run the checks again

Then run:

The state updates now occur inside the scheduled browser callback rather than synchronously inside the effect body, so those two lint errors should disappear.

```text
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

```text
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

```text
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

```text
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

```text
useEffect(() => {
  const savedTheme = localStorage.getItem(
    "task-tracker-theme",
  ) as Theme | null;
```

```text
useEffect(() => {
  const savedTheme = localStorage.getItem(
    "task-tracker-theme",
  ) as Theme | null;
```

```text
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

```text
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

```text
npm test
npm run build
```

```text
npm test
npm run build
```

---

*Exported with [ContextSwitchAI](https://github.com)*
