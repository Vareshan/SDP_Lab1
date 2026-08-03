# Running TaskFlow

## Requirements

The following software is required:

| Software | Version |
|---|---|
| Node.js | v24.14.1 |
| npm | Installed with Node.js |
| Git | Any recent version |

No external database server is required because TaskFlow uses a local SQLite database.

To check the installed versions, run:

```bash
node --version
npm --version
git --version
```

## Starting from a Clean Clone

### 1. Clone the repository

```bash
git clone https://github.com/Vareshan/SDP_Lab1.git
```

### 2. Enter the repository

```bash
cd SDP_Lab1
```

### 3. Install the packages

```bash
npm install
```

This installs the exact package versions recorded in `package-lock.json`.

### 4. Start the development server

```bash
npm run dev
```

The `predev` script automatically runs the database setup before the Next.js development server starts.

The database setup command:

1. Creates or updates the local SQLite database.
2. Creates the `User` and `Task` tables.
3. Generates the Prisma Client.

Once the server has started, open:

```text
http://localhost:3000
```

in a web browser.

## Running the Automated Tests

Run all automated tests using:

```bash
npm test
```

This command executes:

```bash
node scripts/run-tests.mjs
```

All project tests are therefore accessible through one documented command.

## Checking Code Quality

Run ESLint using:

```bash
npm run lint
```

The command reports TypeScript, React and Next.js linting problems.

## Running a Production Build

### 1. Build the application

```bash
npm run build
```

The `prebuild` script automatically prepares the database and generates the Prisma Client before the production build begins.

### 2. Start the production server

```bash
npm start
```

The production application will be available at:

```text
http://localhost:3000
```

## Manual Database Setup

Database setup normally runs automatically before development and production builds.

It can also be run manually using:

```bash
npm run db:setup
```

This executes:

```bash
prisma db push && prisma generate
```

`prisma db push` synchronises the SQLite database with the Prisma schema.

`prisma generate` generates the Prisma Client used by the Next.js API routes.

## Available npm Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Sets up the database and starts the development server. |
| `npm run build` | Sets up the database and creates an optimised production build. |
| `npm start` | Starts the previously built production application. |
| `npm test` | Runs all automated project tests. |
| `npm run lint` | Runs ESLint over the project source code. |
| `npm run db:setup` | Synchronises the database schema and generates Prisma Client. |

## Relevant package.json Scripts

The repository contains the following scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "node scripts/run-tests.mjs",
    "db:setup": "prisma db push && prisma generate",
    "predev": "npm run db:setup",
    "prebuild": "npm run db:setup",
    "lint": "eslint"
  }
}
```

The `predev` and `prebuild` scripts are npm lifecycle scripts. They run automatically before `dev` and `build`, so a developer does not need to enter separate Prisma commands after cloning the repository.

## Local Database

TaskFlow stores its data in a local SQLite database:

```text
prisma/dev.db
```

Each cloned copy of the repository creates its own database. This means that users do not share tasks with other installations.

## Resetting the Local Database

To reset all locally stored users and tasks:

1. Stop the running application.
2. Delete:

```text
prisma/dev.db
```

3. Recreate the database:

```bash
npm run db:setup
```

Deleting this file permanently removes the locally stored user and tasks.

## Clean-Clone Command Summary

The complete command sequence required to run TaskFlow from a clean clone is:

```bash
git clone https://github.com/Vareshan/SDP_Lab1.git
cd SDP_Lab1
npm install
npm run dev
```

The complete command sequence required to test TaskFlow is:

```bash
npm install
npm test
```

The complete command sequence required to run the production version is:

```bash
npm install
npm run build
npm start
```
## AI Declaration
-The preceding document was generated with: OpenAI[ChatGPT-5.6 Sol]