# Raj's SDP - Task Tracker UI Design

> **Platform:** chatgpt  ·  **Messages:** 7  ·  **Exported:** August 3, 2026

---

### Turn 1 — 👤 You

Here is some inspiration for my task tracker UI, the colour scheme however, i would prefer a teal blue and white for the light mode and then a teal blue and black/ dark grey for the dark mode

---

### Turn 2 — 👤 You

SO i got this error when i ran the code

---

### Turn 3 — 🤖 Assistant

The error is because "use client"; is on line 4, after your CSS import. It must be the first statement in page.tsx, before every import.
Change the top of src/app/page.tsx to:

Since the CSS I provided was for globals.css, remove this line from page.tsx:

Then confirm that src/app/layout.tsx contains:

The file structure should therefore begin exactly like this:

Save the file. Next.js should automatically rebuild, and this specific error should disappear.

```text
"use client";

import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  CircleDashed,
  Clock,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sun,
  Users,
  X,
} from "lucide-react";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
```

```text
"use client";

import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  CircleDashed,
  Clock,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sun,
  Users,
  X,
} from "lucide-react";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
```

```text
import styles from "./page.module.css";
```

```text
import styles from "./page.module.css";
```

```text
import "./globals.css";
```

```text
import "./globals.css";
```

```text
"use client";

import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  CircleDashed,
  Clock,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sun,
  Users,
  X,
} from "lucide-react";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";
```

```text
"use client";

import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  CircleDashed,
  Clock,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sun,
  Users,
  X,
} from "lucide-react";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";
```

---

### Turn 4 — 👤 You

So its working properly, however it did say there is one issue which i provided

---

### Turn 5 — 🤖 Assistant

The page is working, but React found a hydration mismatch because this line generates a different value on the server and browser:

The server generated:

The browser generated a moment later:

React expects the first browser render to match the server-rendered HTML. Values such as new Date(), Date.now() and Math.random() can break that requirement when called directly during rendering. Next.js+2React+2
Fix the date state
Find:

Replace it with:

Then, inside your existing useEffect, you already have:

Immediately after that, add:

That part of the effect should now resemble:

Fix the <time> element
Find:

Replace it with:

This works because the server and initial browser render both begin with:

After hydration finishes, useEffect safely updates both values in the browser. The dateTime value is also now just the calendar date, such as 2026-07-31, which matches the visible content better than a timestamp.
Save page.tsx, refresh the page, and the hydration issue should disappear. Using suppressHydrationWarning is possible for unavoidable timestamp differences, but fixing the unstable render value is preferable here. Next.js+1

```text
<time dateTime={new Date().toISOString()}>
```

```text
<time dateTime={new Date().toISOString()}>
```

```text
const [currentDate, setCurrentDate] = useState("Today");
```

```text
const [currentDate, setCurrentDate] = useState("Today");
```

```text
const [currentDate, setCurrentDate] = useState("Today");
const [currentDateISO, setCurrentDateISO] = useState("");
```

```text
const [currentDate, setCurrentDate] = useState("Today");
const [currentDateISO, setCurrentDateISO] = useState("");
```

```text
const now = new Date();
const hour = now.getHours();
```

```text
const now = new Date();
const hour = now.getHours();
```

```text
setCurrentDateISO(now.toISOString().split("T")[0]);
```

```text
setCurrentDateISO(now.toISOString().split("T")[0]);
```

```text
useEffect(() => {
  const savedTheme = localStorage.getItem(
    "task-tracker-theme",
  ) as Theme | null;

  const systemTheme: Theme = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches
    ? "dark"
    : "light";

  const selectedTheme = savedTheme ?? systemTheme;

  setTheme(selectedTheme);
  document.documentElement.dataset.theme = selectedTheme;

  const now = new Date();
  const hour = now.getHours();

  setCurrentDateISO(now.toISOString().split("T")[0]);

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
}, []);
```

```text
useEffect(() => {
  const savedTheme = localStorage.getItem(
    "task-tracker-theme",
  ) as Theme | null;

  const systemTheme: Theme = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches
    ? "dark"
    : "light";

  const selectedTheme = savedTheme ?? systemTheme;

  setTheme(selectedTheme);
  document.documentElement.dataset.theme = selectedTheme;

  const now = new Date();
  const hour = now.getHours();

  setCurrentDateISO(now.toISOString().split("T")[0]);

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
}, []);
```

```text
<time dateTime={new Date().toISOString()}>
  {currentDate}
</time>
```

```text
<time dateTime={new Date().toISOString()}>
  {currentDate}
</time>
```

```text
<time dateTime={currentDateISO || undefined}>
  {currentDate}
</time>
```

```text
<time dateTime={currentDateISO || undefined}>
  {currentDate}
</time>
```

```text
currentDateISO === ""
currentDate === "Today"
```

```text
currentDateISO === ""
currentDate === "Today"
```

---

### Turn 6 — 👤 You

Pasted code.tsTypeScriptOkay so i have already chnaged most of the names and Assignee's, but please can you change all the KR to VR and give me back the full code

---

### Turn 7 — 🤖 Assistant

Here is the complete src/app/page.tsx with every profile and assignee initial changed from KR to VR. The name is also set to Vareshan, and the hydration fix remains included. 
Your globals.css does not need to change.

```text
"use client";

import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  CircleDashed,
  Clock,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sun,
  Users,
  X,
} from "lucide-react";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";
type TaskStatus = "todo" | "progress" | "done";
type TaskPriority = "Low" | "Medium" | "High";

type Task = {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  timeEstimate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: string;
};

type DraftTask = {
  title: string;
  project: string;
  dueDate: string;
  timeEstimate: string;
  priority: TaskPriority;
  status: TaskStatus;
};

const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Design dashboard wireframe",
    project: "Task Tracker",
    dueDate: "2026-08-02",
    timeEstimate: "2h 30m",
    priority: "High",
    status: "todo",
    assignee: "VR",
  },
  {
    id: "task-2",
    title: "Create reusable button component",
    project: "Task Tracker",
    dueDate: "2026-08-04",
    timeEstimate: "1h 15m",
    priority: "Medium",
    status: "todo",
    assignee: "VR",
  },
  {
    id: "task-3",
    title: "Review assignment requirements",
    project: "University",
    dueDate: "2026-08-05",
    timeEstimate: "45m",
    priority: "Low",
    status: "todo",
    assignee: "VR",
  },
  {
    id: "task-4",
    title: "Build responsive navigation",
    project: "Task Tracker",
    dueDate: "2026-08-01",
    timeEstimate: "3h",
    priority: "High",
    status: "progress",
    assignee: "VR",
  },
  {
    id: "task-5",
    title: "Connect light and dark themes",
    project: "Task Tracker",
    dueDate: "2026-08-03",
    timeEstimate: "1h",
    priority: "Medium",
    status: "progress",
    assignee: "VR",
  },
  {
    id: "task-6",
    title: "Set up the Next.js application",
    project: "Task Tracker",
    dueDate: "2026-07-31",
    timeEstimate: "2h",
    priority: "High",
    status: "done",
    assignee: "VR",
  },
  {
    id: "task-7",
    title: "Choose the application colour palette",
    project: "Task Tracker",
    dueDate: "2026-07-31",
    timeEstimate: "30m",
    priority: "Low",
    status: "done",
    assignee: "VR",
  },
];

const columns: {
  status: TaskStatus;
  title: string;
  description: string;
}[] = [
  {
    status: "todo",
    title: "To do",
    description: "Tasks that have not been started",
  },
  {
    status: "progress",
    title: "In progress",
    description: "Tasks currently being worked on",
  },
  {
    status: "done",
    title: "Completed",
    description: "Tasks that have been finished",
  },
];

const navigationItems = [
  {
    label: "Dashboard",
    href: "#dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "My tasks",
    href: "#tasks",
    icon: ListTodo,
    active: false,
  },
  {
    label: "Calendar",
    href: "#calendar",
    icon: CalendarDays,
    active: false,
  },
  {
    label: "Projects",
    href: "#projects",
    icon: FolderKanban,
    active: false,
  },
  {
    label: "Analytics",
    href: "#analytics",
    icon: BarChart3,
    active: false,
  },
  {
    label: "Team",
    href: "#team",
    icon: Users,
    active: false,
  },
];

function createEmptyTask(
  status: TaskStatus = "todo",
): DraftTask {
  return {
    title: "",
    project: "Task Tracker",
    dueDate: "",
    timeEstimate: "1h",
    priority: "Medium",
    status,
  };
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T00:00:00`));
}

function TaskStatusIcon({
  status,
}: {
  status: TaskStatus;
}) {
  if (status === "done") {
    return <CheckCircle2 size={18} aria-hidden="true" />;
  }

  if (status === "progress") {
    return <CircleDashed size={18} aria-hidden="true" />;
  }

  return <Circle size={18} aria-hidden="true" />;
}

function TaskCard({
  task,
  onAdvance,
}: {
  task: Task;
  onAdvance: (taskId: string) => void;
}) {
  const actionLabel =
    task.status === "todo"
      ? "Move task to in progress"
      : task.status === "progress"
        ? "Mark task as completed"
        : "Task has been completed";

  return (
    <article className="task-card">
      <header className="task-card-header">
        <figure
          className={`task-status-icon status-${task.status}`}
          aria-label={`Status: ${task.status}`}
        >
          <TaskStatusIcon status={task.status} />
        </figure>

        <button
          className="icon-button task-menu-button"
          type="button"
          aria-label={`Open options for ${task.title}`}
        >
          <MoreHorizontal size={19} aria-hidden="true" />
        </button>
      </header>

      <h4>{task.title}</h4>

      <p className="task-project">
        <FolderKanban size={15} aria-hidden="true" />
        {task.project}
      </p>

      <dl className="task-metadata">
        <dt>
          <CalendarDays size={15} aria-hidden="true" />
          Due date
        </dt>

        <dd>
          <time dateTime={task.dueDate}>
            {formatDate(task.dueDate)}
          </time>
        </dd>

        <dt>
          <Clock size={15} aria-hidden="true" />
          Estimate
        </dt>

        <dd>{task.timeEstimate}</dd>
      </dl>

      <footer className="task-card-footer">
        <small
          className={`priority-badge priority-${task.priority.toLowerCase()}`}
        >
          {task.priority} priority
        </small>

        <section className="task-card-actions">
          <strong
            className="avatar avatar-small"
            aria-label={`Assigned to ${task.assignee}`}
          >
            {task.assignee}
          </strong>

          <button
            className="advance-button"
            type="button"
            onClick={() => onAdvance(task.id)}
            disabled={task.status === "done"}
            aria-label={actionLabel}
            title={actionLabel}
          >
            {task.status === "done" ? (
              <CheckCircle2 size={17} aria-hidden="true" />
            ) : (
              <ChevronRight size={17} aria-hidden="true" />
            )}
          </button>
        </section>
      </footer>
    </article>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<Theme>("light");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDate, setCurrentDate] = useState("Today");
  const [currentDateISO, setCurrentDateISO] = useState("");
  const [greeting, setGreeting] = useState("Good day");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [draftTask, setDraftTask] = useState<DraftTask>(
    createEmptyTask(),
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem(
      "task-tracker-theme",
    ) as Theme | null;

    const systemTheme: Theme = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches
      ? "dark"
      : "light";

    const selectedTheme = savedTheme ?? systemTheme;

    setTheme(selectedTheme);
    document.documentElement.dataset.theme = selectedTheme;

    const now = new Date();
    const hour = now.getHours();

    setCurrentDateISO(now.toISOString().split("T")[0]);

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
  }, []);

  const filteredTasks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return tasks;
    }

    return tasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(query) ||
        task.project.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query)
      );
    });
  }, [searchTerm, tasks]);

  const completedTasks = tasks.filter(
    (task) => task.status === "done",
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "progress",
  ).length;

  const remainingHighPriorityTasks = tasks.filter(
    (task) =>
      task.priority === "High" && task.status !== "done",
  ).length;

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  function toggleTheme(): void {
    const newTheme: Theme =
      theme === "light" ? "dark" : "light";

    setTheme(newTheme);
    localStorage.setItem("task-tracker-theme", newTheme);
    document.documentElement.dataset.theme = newTheme;
  }

  function openTaskModal(
    status: TaskStatus = "todo",
  ): void {
    setDraftTask(createEmptyTask(status));
    setIsModalOpen(true);
  }

  function closeTaskModal(): void {
    setIsModalOpen(false);
  }

  function addTask(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    if (!draftTask.title.trim() || !draftTask.dueDate) {
      return;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: draftTask.title.trim(),
      project: draftTask.project.trim() || "Personal",
      dueDate: draftTask.dueDate,
      timeEstimate: draftTask.timeEstimate.trim() || "1h",
      priority: draftTask.priority,
      status: draftTask.status,
      assignee: "VR",
    };

    setTasks((currentTasks) => [
      newTask,
      ...currentTasks,
    ]);

    closeTaskModal();
  }

  function advanceTask(taskId: string): void {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        if (task.status === "todo") {
          return {
            ...task,
            status: "progress",
          };
        }

        if (task.status === "progress") {
          return {
            ...task,
            status: "done",
          };
        }

        return task;
      }),
    );
  }

  return (
    <main className="dashboard-shell" id="dashboard">
      <aside className="sidebar">
        <header className="sidebar-header">
          <a
            className="brand"
            href="#dashboard"
            aria-label="TaskFlow dashboard"
          >
            <figure className="brand-icon">
              <CheckCircle2 size={23} aria-hidden="true" />
            </figure>

            <strong className="brand-name">TaskFlow</strong>
          </a>
        </header>

        <nav
          className="sidebar-navigation"
          aria-label="Main navigation"
        >
          <p className="navigation-heading">Workspace</p>

          <ul>
            {navigationItems.map((item) => {
              const NavigationIcon = item.icon;

              return (
                <li key={item.label}>
                  <a
                    className={`navigation-item ${
                      item.active
                        ? "navigation-item-active"
                        : ""
                    }`}
                    href={item.href}
                    aria-current={
                      item.active ? "page" : undefined
                    }
                  >
                    <NavigationIcon
                      size={20}
                      aria-hidden="true"
                    />

                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <footer className="sidebar-footer">
          <a className="navigation-item" href="#settings">
            <Settings size={20} aria-hidden="true" />
            Settings
          </a>

          <article className="sidebar-profile">
            <strong className="avatar">VR</strong>

            <header className="profile-details">
              <strong>Vareshan</strong>
              <small>Student account</small>
            </header>

            <button
              className="profile-logout"
              type="button"
              aria-label="Log out"
            >
              <LogOut size={18} aria-hidden="true" />
            </button>
          </article>
        </footer>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <time dateTime={currentDateISO || undefined}>
            {currentDate}
          </time>

          <section className="topbar-actions">
            <label className="search-field">
              <Search size={19} aria-hidden="true" />

              <input
                type="search"
                placeholder="Search tasks or projects"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </label>

            <button
              className="icon-button notification-button"
              type="button"
              aria-label="View notifications"
            >
              <Bell size={20} aria-hidden="true" />
            </button>

            <button
              className="icon-button"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              {theme === "light" ? (
                <Moon size={20} aria-hidden="true" />
              ) : (
                <Sun size={20} aria-hidden="true" />
              )}
            </button>

            <strong
              className="avatar topbar-avatar"
              aria-label="Vareshan's profile"
            >
              VR
            </strong>
          </section>
        </header>

        <section className="content-container">
          <header className="welcome-section">
            <section>
              <p className="eyebrow">Personal workspace</p>

              <h1>{greeting}, Vareshan!</h1>

              <p>
                Organise your work, manage your deadlines and
                keep your projects moving.
              </p>
            </section>

            <button
              className="primary-button"
              type="button"
              onClick={() => openTaskModal()}
            >
              <Plus size={19} aria-hidden="true" />
              New task
            </button>
          </header>

          <ul
            className="stats-grid"
            aria-label="Task statistics"
          >
            <li>
              <article className="stat-card">
                <header className="stat-card-heading">
                  <figure className="stat-icon">
                    <ListTodo size={20} aria-hidden="true" />
                  </figure>

                  <p>Total tasks</p>
                </header>

                <strong>{tasks.length}</strong>
                <small>Across all your projects</small>
              </article>
            </li>

            <li>
              <article className="stat-card">
                <header className="stat-card-heading">
                  <figure className="stat-icon stat-icon-progress">
                    <CircleDashed
                      size={20}
                      aria-hidden="true"
                    />
                  </figure>

                  <p>In progress</p>
                </header>

                <strong>{inProgressTasks}</strong>
                <small>Tasks currently active</small>
              </article>
            </li>

            <li>
              <article className="stat-card">
                <header className="stat-card-heading">
                  <figure className="stat-icon stat-icon-completed">
                    <CheckCircle2
                      size={20}
                      aria-hidden="true"
                    />
                  </figure>

                  <p>Completed</p>
                </header>

                <strong>{completedTasks}</strong>
                <small>Tasks successfully finished</small>
              </article>
            </li>

            <li>
              <article className="stat-card">
                <header className="stat-card-heading">
                  <figure className="stat-icon stat-icon-priority">
                    <BarChart3
                      size={20}
                      aria-hidden="true"
                    />
                  </figure>

                  <p>Overall progress</p>
                </header>

                <strong>{completionPercentage}%</strong>

                <small>
                  {remainingHighPriorityTasks} high-priority
                  tasks remaining
                </small>

                <progress
                  value={completionPercentage}
                  max="100"
                  aria-label="Overall task completion"
                >
                  {completionPercentage}%
                </progress>
              </article>
            </li>
          </ul>

          <section className="board-section" id="tasks">
            <header className="board-header">
              <section>
                <p className="eyebrow">Task management</p>
                <h2>My task board</h2>

                <p>
                  Move tasks through each stage as you complete
                  your work.
                </p>
              </section>

              <menu className="board-header-actions">
                <li>
                  <small>
                    {filteredTasks.length} tasks shown
                  </small>
                </li>

                <li>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => openTaskModal()}
                  >
                    <Plus size={18} aria-hidden="true" />
                    Add task
                  </button>
                </li>
              </menu>
            </header>

            <section
              className="kanban-board"
              aria-label="Kanban task board"
            >
              {columns.map((column) => {
                const columnTasks = filteredTasks.filter(
                  (task) => task.status === column.status,
                );

                return (
                  <article
                    className={`task-column column-${column.status}`}
                    key={column.status}
                  >
                    <header className="column-header">
                      <section>
                        <header className="column-title-row">
                          <i
                            className="column-status-dot"
                            aria-hidden="true"
                          />

                          <h3>{column.title}</h3>

                          <small className="column-count">
                            {columnTasks.length}
                          </small>
                        </header>

                        <p>{column.description}</p>
                      </section>

                      <button
                        className="column-add-button"
                        type="button"
                        onClick={() =>
                          openTaskModal(column.status)
                        }
                        aria-label={`Add task to ${column.title}`}
                      >
                        <Plus size={18} aria-hidden="true" />
                      </button>
                    </header>

                    {columnTasks.length > 0 ? (
                      <ol className="task-list">
                        {columnTasks.map((task) => (
                          <li key={task.id}>
                            <TaskCard
                              task={task}
                              onAdvance={advanceTask}
                            />
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <article className="empty-column">
                        <ListTodo
                          size={24}
                          aria-hidden="true"
                        />

                        <p>No tasks found</p>

                        <button
                          type="button"
                          onClick={() =>
                            openTaskModal(column.status)
                          }
                        >
                          Add a task
                        </button>
                      </article>
                    )}
                  </article>
                );
              })}
            </section>
          </section>
        </section>
      </section>

      {isModalOpen && (
        <dialog
          className="task-dialog"
          open
          aria-labelledby="new-task-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeTaskModal();
            }
          }}
        >
          <article className="task-modal">
            <header className="modal-header">
              <section>
                <p className="eyebrow">Task details</p>
                <h2 id="new-task-title">Create a new task</h2>
              </section>

              <button
                className="icon-button"
                type="button"
                onClick={closeTaskModal}
                aria-label="Close task form"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </header>

            <form className="task-form" onSubmit={addTask}>
              <label className="form-field form-field-full">
                Task name

                <input
                  type="text"
                  placeholder="Complete dashboard UI"
                  value={draftTask.title}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      title: event.target.value,
                    }))
                  }
                  required
                  autoFocus
                />
              </label>

              <label className="form-field form-field-full">
                Project

                <input
                  type="text"
                  placeholder="Project name"
                  value={draftTask.project}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      project: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="form-field">
                Status

                <select
                  value={draftTask.status}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      status: event.target
                        .value as TaskStatus,
                    }))
                  }
                >
                  <option value="todo">To do</option>
                  <option value="progress">In progress</option>
                  <option value="done">Completed</option>
                </select>
              </label>

              <label className="form-field">
                Priority

                <select
                  value={draftTask.priority}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      priority: event.target
                        .value as TaskPriority,
                    }))
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </label>

              <label className="form-field">
                Due date

                <input
                  type="date"
                  value={draftTask.dueDate}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      dueDate: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label className="form-field">
                Time estimate

                <input
                  type="text"
                  placeholder="For example: 2h"
                  value={draftTask.timeEstimate}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      timeEstimate: event.target.value,
                    }))
                  }
                />
              </label>

              <footer className="modal-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={closeTaskModal}
                >
                  Cancel
                </button>

                <button
                  className="primary-button"
                  type="submit"
                >
                  <Plus size={18} aria-hidden="true" />
                  Create task
                </button>
              </footer>
            </form>
          </article>
        </dialog>
      )}
    </main>
  );
}
```

```text
"use client";

import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  CircleDashed,
  Clock,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sun,
  Users,
  X,
} from "lucide-react";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";
type TaskStatus = "todo" | "progress" | "done";
type TaskPriority = "Low" | "Medium" | "High";

type Task = {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  timeEstimate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: string;
};

type DraftTask = {
  title: string;
  project: string;
  dueDate: string;
  timeEstimate: string;
  priority: TaskPriority;
  status: TaskStatus;
};

const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Design dashboard wireframe",
    project: "Task Tracker",
    dueDate: "2026-08-02",
    timeEstimate: "2h 30m",
    priority: "High",
    status: "todo",
    assignee: "VR",
  },
  {
    id: "task-2",
    title: "Create reusable button component",
    project: "Task Tracker",
    dueDate: "2026-08-04",
    timeEstimate: "1h 15m",
    priority: "Medium",
    status: "todo",
    assignee: "VR",
  },
  {
    id: "task-3",
    title: "Review assignment requirements",
    project: "University",
    dueDate: "2026-08-05",
    timeEstimate: "45m",
    priority: "Low",
    status: "todo",
    assignee: "VR",
  },
  {
    id: "task-4",
    title: "Build responsive navigation",
    project: "Task Tracker",
    dueDate: "2026-08-01",
    timeEstimate: "3h",
    priority: "High",
    status: "progress",
    assignee: "VR",
  },
  {
    id: "task-5",
    title: "Connect light and dark themes",
    project: "Task Tracker",
    dueDate: "2026-08-03",
    timeEstimate: "1h",
    priority: "Medium",
    status: "progress",
    assignee: "VR",
  },
  {
    id: "task-6",
    title: "Set up the Next.js application",
    project: "Task Tracker",
    dueDate: "2026-07-31",
    timeEstimate: "2h",
    priority: "High",
    status: "done",
    assignee: "VR",
  },
  {
    id: "task-7",
    title: "Choose the application colour palette",
    project: "Task Tracker",
    dueDate: "2026-07-31",
    timeEstimate: "30m",
    priority: "Low",
    status: "done",
    assignee: "VR",
  },
];

const columns: {
  status: TaskStatus;
  title: string;
  description: string;
}[] = [
  {
    status: "todo",
    title: "To do",
    description: "Tasks that have not been started",
  },
  {
    status: "progress",
    title: "In progress",
    description: "Tasks currently being worked on",
  },
  {
    status: "done",
    title: "Completed",
    description: "Tasks that have been finished",
  },
];

const navigationItems = [
  {
    label: "Dashboard",
    href: "#dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "My tasks",
    href: "#tasks",
    icon: ListTodo,
    active: false,
  },
  {
    label: "Calendar",
    href: "#calendar",
    icon: CalendarDays,
    active: false,
  },
  {
    label: "Projects",
    href: "#projects",
    icon: FolderKanban,
    active: false,
  },
  {
    label: "Analytics",
    href: "#analytics",
    icon: BarChart3,
    active: false,
  },
  {
    label: "Team",
    href: "#team",
    icon: Users,
    active: false,
  },
];

function createEmptyTask(
  status: TaskStatus = "todo",
): DraftTask {
  return {
    title: "",
    project: "Task Tracker",
    dueDate: "",
    timeEstimate: "1h",
    priority: "Medium",
    status,
  };
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T00:00:00`));
}

function TaskStatusIcon({
  status,
}: {
  status: TaskStatus;
}) {
  if (status === "done") {
    return <CheckCircle2 size={18} aria-hidden="true" />;
  }

  if (status === "progress") {
    return <CircleDashed size={18} aria-hidden="true" />;
  }

  return <Circle size={18} aria-hidden="true" />;
}

function TaskCard({
  task,
  onAdvance,
}: {
  task: Task;
  onAdvance: (taskId: string) => void;
}) {
  const actionLabel =
    task.status === "todo"
      ? "Move task to in progress"
      : task.status === "progress"
        ? "Mark task as completed"
        : "Task has been completed";

  return (
    <article className="task-card">
      <header className="task-card-header">
        <figure
          className={`task-status-icon status-${task.status}`}
          aria-label={`Status: ${task.status}`}
        >
          <TaskStatusIcon status={task.status} />
        </figure>

        <button
          className="icon-button task-menu-button"
          type="button"
          aria-label={`Open options for ${task.title}`}
        >
          <MoreHorizontal size={19} aria-hidden="true" />
        </button>
      </header>

      <h4>{task.title}</h4>

      <p className="task-project">
        <FolderKanban size={15} aria-hidden="true" />
        {task.project}
      </p>

      <dl className="task-metadata">
        <dt>
          <CalendarDays size={15} aria-hidden="true" />
          Due date
        </dt>

        <dd>
          <time dateTime={task.dueDate}>
            {formatDate(task.dueDate)}
          </time>
        </dd>

        <dt>
          <Clock size={15} aria-hidden="true" />
          Estimate
        </dt>

        <dd>{task.timeEstimate}</dd>
      </dl>

      <footer className="task-card-footer">
        <small
          className={`priority-badge priority-${task.priority.toLowerCase()}`}
        >
          {task.priority} priority
        </small>

        <section className="task-card-actions">
          <strong
            className="avatar avatar-small"
            aria-label={`Assigned to ${task.assignee}`}
          >
            {task.assignee}
          </strong>

          <button
            className="advance-button"
            type="button"
            onClick={() => onAdvance(task.id)}
            disabled={task.status === "done"}
            aria-label={actionLabel}
            title={actionLabel}
          >
            {task.status === "done" ? (
              <CheckCircle2 size={17} aria-hidden="true" />
            ) : (
              <ChevronRight size={17} aria-hidden="true" />
            )}
          </button>
        </section>
      </footer>
    </article>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<Theme>("light");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDate, setCurrentDate] = useState("Today");
  const [currentDateISO, setCurrentDateISO] = useState("");
  const [greeting, setGreeting] = useState("Good day");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [draftTask, setDraftTask] = useState<DraftTask>(
    createEmptyTask(),
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem(
      "task-tracker-theme",
    ) as Theme | null;

    const systemTheme: Theme = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches
      ? "dark"
      : "light";

    const selectedTheme = savedTheme ?? systemTheme;

    setTheme(selectedTheme);
    document.documentElement.dataset.theme = selectedTheme;

    const now = new Date();
    const hour = now.getHours();

    setCurrentDateISO(now.toISOString().split("T")[0]);

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
  }, []);

  const filteredTasks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return tasks;
    }

    return tasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(query) ||
        task.project.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query)
      );
    });
  }, [searchTerm, tasks]);

  const completedTasks = tasks.filter(
    (task) => task.status === "done",
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "progress",
  ).length;

  const remainingHighPriorityTasks = tasks.filter(
    (task) =>
      task.priority === "High" && task.status !== "done",
  ).length;

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  function toggleTheme(): void {
    const newTheme: Theme =
      theme === "light" ? "dark" : "light";

    setTheme(newTheme);
    localStorage.setItem("task-tracker-theme", newTheme);
    document.documentElement.dataset.theme = newTheme;
  }

  function openTaskModal(
    status: TaskStatus = "todo",
  ): void {
    setDraftTask(createEmptyTask(status));
    setIsModalOpen(true);
  }

  function closeTaskModal(): void {
    setIsModalOpen(false);
  }

  function addTask(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    if (!draftTask.title.trim() || !draftTask.dueDate) {
      return;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: draftTask.title.trim(),
      project: draftTask.project.trim() || "Personal",
      dueDate: draftTask.dueDate,
      timeEstimate: draftTask.timeEstimate.trim() || "1h",
      priority: draftTask.priority,
      status: draftTask.status,
      assignee: "VR",
    };

    setTasks((currentTasks) => [
      newTask,
      ...currentTasks,
    ]);

    closeTaskModal();
  }

  function advanceTask(taskId: string): void {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        if (task.status === "todo") {
          return {
            ...task,
            status: "progress",
          };
        }

        if (task.status === "progress") {
          return {
            ...task,
            status: "done",
          };
        }

        return task;
      }),
    );
  }

  return (
    <main className="dashboard-shell" id="dashboard">
      <aside className="sidebar">
        <header className="sidebar-header">
          <a
            className="brand"
            href="#dashboard"
            aria-label="TaskFlow dashboard"
          >
            <figure className="brand-icon">
              <CheckCircle2 size={23} aria-hidden="true" />
            </figure>

            <strong className="brand-name">TaskFlow</strong>
          </a>
        </header>

        <nav
          className="sidebar-navigation"
          aria-label="Main navigation"
        >
          <p className="navigation-heading">Workspace</p>

          <ul>
            {navigationItems.map((item) => {
              const NavigationIcon = item.icon;

              return (
                <li key={item.label}>
                  <a
                    className={`navigation-item ${
                      item.active
                        ? "navigation-item-active"
                        : ""
                    }`}
                    href={item.href}
                    aria-current={
                      item.active ? "page" : undefined
                    }
                  >
                    <NavigationIcon
                      size={20}
                      aria-hidden="true"
                    />

                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <footer className="sidebar-footer">
          <a className="navigation-item" href="#settings">
            <Settings size={20} aria-hidden="true" />
            Settings
          </a>

          <article className="sidebar-profile">
            <strong className="avatar">VR</strong>

            <header className="profile-details">
              <strong>Vareshan</strong>
              <small>Student account</small>
            </header>

            <button
              className="profile-logout"
              type="button"
              aria-label="Log out"
            >
              <LogOut size={18} aria-hidden="true" />
            </button>
          </article>
        </footer>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <time dateTime={currentDateISO || undefined}>
            {currentDate}
          </time>

          <section className="topbar-actions">
            <label className="search-field">
              <Search size={19} aria-hidden="true" />

              <input
                type="search"
                placeholder="Search tasks or projects"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </label>

            <button
              className="icon-button notification-button"
              type="button"
              aria-label="View notifications"
            >
              <Bell size={20} aria-hidden="true" />
            </button>

            <button
              className="icon-button"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              {theme === "light" ? (
                <Moon size={20} aria-hidden="true" />
              ) : (
                <Sun size={20} aria-hidden="true" />
              )}
            </button>

            <strong
              className="avatar topbar-avatar"
              aria-label="Vareshan's profile"
            >
              VR
            </strong>
          </section>
        </header>

        <section className="content-container">
          <header className="welcome-section">
            <section>
              <p className="eyebrow">Personal workspace</p>

              <h1>{greeting}, Vareshan!</h1>

              <p>
                Organise your work, manage your deadlines and
                keep your projects moving.
              </p>
            </section>

            <button
              className="primary-button"
              type="button"
              onClick={() => openTaskModal()}
            >
              <Plus size={19} aria-hidden="true" />
              New task
            </button>
          </header>

          <ul
            className="stats-grid"
            aria-label="Task statistics"
          >
            <li>
              <article className="stat-card">
                <header className="stat-card-heading">
                  <figure className="stat-icon">
                    <ListTodo size={20} aria-hidden="true" />
                  </figure>

                  <p>Total tasks</p>
                </header>

                <strong>{tasks.length}</strong>
                <small>Across all your projects</small>
              </article>
            </li>

            <li>
              <article className="stat-card">
                <header className="stat-card-heading">
                  <figure className="stat-icon stat-icon-progress">
                    <CircleDashed
                      size={20}
                      aria-hidden="true"
                    />
                  </figure>

                  <p>In progress</p>
                </header>

                <strong>{inProgressTasks}</strong>
                <small>Tasks currently active</small>
              </article>
            </li>

            <li>
              <article className="stat-card">
                <header className="stat-card-heading">
                  <figure className="stat-icon stat-icon-completed">
                    <CheckCircle2
                      size={20}
                      aria-hidden="true"
                    />
                  </figure>

                  <p>Completed</p>
                </header>

                <strong>{completedTasks}</strong>
                <small>Tasks successfully finished</small>
              </article>
            </li>

            <li>
              <article className="stat-card">
                <header className="stat-card-heading">
                  <figure className="stat-icon stat-icon-priority">
                    <BarChart3
                      size={20}
                      aria-hidden="true"
                    />
                  </figure>

                  <p>Overall progress</p>
                </header>

                <strong>{completionPercentage}%</strong>

                <small>
                  {remainingHighPriorityTasks} high-priority
                  tasks remaining
                </small>

                <progress
                  value={completionPercentage}
                  max="100"
                  aria-label="Overall task completion"
                >
                  {completionPercentage}%
                </progress>
              </article>
            </li>
          </ul>

          <section className="board-section" id="tasks">
            <header className="board-header">
              <section>
                <p className="eyebrow">Task management</p>
                <h2>My task board</h2>

                <p>
                  Move tasks through each stage as you complete
                  your work.
                </p>
              </section>

              <menu className="board-header-actions">
                <li>
                  <small>
                    {filteredTasks.length} tasks shown
                  </small>
                </li>

                <li>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => openTaskModal()}
                  >
                    <Plus size={18} aria-hidden="true" />
                    Add task
                  </button>
                </li>
              </menu>
            </header>

            <section
              className="kanban-board"
              aria-label="Kanban task board"
            >
              {columns.map((column) => {
                const columnTasks = filteredTasks.filter(
                  (task) => task.status === column.status,
                );

                return (
                  <article
                    className={`task-column column-${column.status}`}
                    key={column.status}
                  >
                    <header className="column-header">
                      <section>
                        <header className="column-title-row">
                          <i
                            className="column-status-dot"
                            aria-hidden="true"
                          />

                          <h3>{column.title}</h3>

                          <small className="column-count">
                            {columnTasks.length}
                          </small>
                        </header>

                        <p>{column.description}</p>
                      </section>

                      <button
                        className="column-add-button"
                        type="button"
                        onClick={() =>
                          openTaskModal(column.status)
                        }
                        aria-label={`Add task to ${column.title}`}
                      >
                        <Plus size={18} aria-hidden="true" />
                      </button>
                    </header>

                    {columnTasks.length > 0 ? (
                      <ol className="task-list">
                        {columnTasks.map((task) => (
                          <li key={task.id}>
                            <TaskCard
                              task={task}
                              onAdvance={advanceTask}
                            />
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <article className="empty-column">
                        <ListTodo
                          size={24}
                          aria-hidden="true"
                        />

                        <p>No tasks found</p>

                        <button
                          type="button"
                          onClick={() =>
                            openTaskModal(column.status)
                          }
                        >
                          Add a task
                        </button>
                      </article>
                    )}
                  </article>
                );
              })}
            </section>
          </section>
        </section>
      </section>

      {isModalOpen && (
        <dialog
          className="task-dialog"
          open
          aria-labelledby="new-task-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeTaskModal();
            }
          }}
        >
          <article className="task-modal">
            <header className="modal-header">
              <section>
                <p className="eyebrow">Task details</p>
                <h2 id="new-task-title">Create a new task</h2>
              </section>

              <button
                className="icon-button"
                type="button"
                onClick={closeTaskModal}
                aria-label="Close task form"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </header>

            <form className="task-form" onSubmit={addTask}>
              <label className="form-field form-field-full">
                Task name

                <input
                  type="text"
                  placeholder="Complete dashboard UI"
                  value={draftTask.title}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      title: event.target.value,
                    }))
                  }
                  required
                  autoFocus
                />
              </label>

              <label className="form-field form-field-full">
                Project

                <input
                  type="text"
                  placeholder="Project name"
                  value={draftTask.project}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      project: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="form-field">
                Status

                <select
                  value={draftTask.status}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      status: event.target
                        .value as TaskStatus,
                    }))
                  }
                >
                  <option value="todo">To do</option>
                  <option value="progress">In progress</option>
                  <option value="done">Completed</option>
                </select>
              </label>

              <label className="form-field">
                Priority

                <select
                  value={draftTask.priority}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      priority: event.target
                        .value as TaskPriority,
                    }))
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </label>

              <label className="form-field">
                Due date

                <input
                  type="date"
                  value={draftTask.dueDate}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      dueDate: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label className="form-field">
                Time estimate

                <input
                  type="text"
                  placeholder="For example: 2h"
                  value={draftTask.timeEstimate}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      timeEstimate: event.target.value,
                    }))
                  }
                />
              </label>

              <footer className="modal-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={closeTaskModal}
                >
                  Cancel
                </button>

                <button
                  className="primary-button"
                  type="submit"
                >
                  <Plus size={18} aria-hidden="true" />
                  Create task
                </button>
              </footer>
            </form>
          </article>
        </dialog>
      )}
    </main>
  );
}
```

---

*Exported with [ContextSwitchAI](https://github.com)*
