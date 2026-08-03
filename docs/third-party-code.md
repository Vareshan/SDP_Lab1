# Third-Party Code

## Overview

TaskFlow is built using open-source libraries and packages installed through the Node Package Manager (`npm`).

The exact installed versions are recorded in `package.json` and locked in `package-lock.json`.

## Application Dependencies

| Package | Purpose and reason for selection |
|---|---|
| `next` | Provides the web application framework, routing, API routes and production build system. It was selected because the project requires a Next.js application with both frontend and backend functionality. |
| `react` | Provides the component-based user interface used by TaskFlow. It was selected because it integrates directly with Next.js and supports reusable, state-driven UI components. |
| `react-dom` | Connects React components to the browser DOM. It is required for React applications running in a web browser. |
| `@prisma/client` | Provides the generated database client used by the API routes to read and modify users and tasks. It was selected because it provides type-safe database access. |
| `lucide-react` | Provides the icons used throughout the TaskFlow interface. It was selected because it offers accessible, consistent and lightweight React icons. |

## Development Dependencies

| Package | Purpose and reason for selection |
|---|---|
| `prisma` | Provides the Prisma command-line tools used to generate the Prisma client and synchronise the database schema with SQLite. |
| `typescript` | Adds static type checking to the project. It was selected to reduce runtime errors and make the application code easier to maintain. |
| `eslint` | Analyses the source code for common programming errors and style problems. It was selected to improve code quality and consistency. |
| `eslint-config-next` | Provides the official ESLint rules recommended for Next.js projects. |
| `@types/node` | Provides TypeScript type definitions for Node.js APIs used by the application and supporting scripts. |
| `@types/react` | Provides TypeScript type definitions for React. |
| `@types/react-dom` | Provides TypeScript type definitions for React DOM. |

## Database Technology

### SQLite

TaskFlow uses SQLite as its database.

SQLite was selected because TaskFlow is a local-first application and does not require a separately installed or hosted database server. The database is stored as a local file and is created automatically when the project is started.

### Prisma ORM

Prisma is used as the Object-Relational Mapper between the Next.js API routes and SQLite.

Prisma was selected because it provides:

- A clear database schema.
- Type-safe database queries.
- Automatic Prisma Client generation.
- Simple local database setup.
- Easy synchronisation through `prisma db push`.

## Testing

The project uses Node.js to execute the automated test runner through:

```bash
npm test
```

The command runs:

```bash
node scripts/run-tests.mjs
```

The test runner groups the project tests behind one command, as required by the project specification.

## Styling

TaskFlow primarily uses custom CSS stored in the project source files. No third-party user-interface component library is used for the layout or visual design.

## Package Version Reproducibility

`package-lock.json` must remain committed to the repository.

This file records the exact dependency versions used by the project so that running:

```bash
npm install
```

from a clean clone installs the same package versions.