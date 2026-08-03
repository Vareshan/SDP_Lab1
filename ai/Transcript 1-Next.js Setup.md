# Next.js Setup Guide

**User:** Anonymous  
**Created:** 7/31/2026 11:28:01  
**Updated:** 7/31/2026 16:36:53  
**Exported:** 8/3/2026 16:45:36  
**Link:** [https://chatgpt.com/g/g-p-6a6c6a7081f88191bedd443931229de8/c/6a6c6a86-62cc-83ea-a256-fe849094ceac](https://chatgpt.com/g/g-p-6a6c6a7081f88191bedd443931229de8/c/6a6c6a86-62cc-83ea-a256-fe849094ceac)  

## Prompt:
7/31/2026, 11:29:06 AM

Please may you run me through the steps to set up Next.js

[Attachment: lab_one.pdf]

## Response:
7/31/2026, 11:28:00 AM

> **Searching the web**
>
> [Getting Started: Installation | Next.js](https://nextjs.org/docs/app/getting-started/installation)
>
> **Setting up the project**
>
> I’m starting with a local-first Next.js app and SQLite-friendly setup. I’ll verify Node and npm, create the project, choose TypeScript, and keep the initial configuration simple before adding database features.
>
> **Set up the project**
>
> 
>
> **Checking initial configuration**
>
> I’m keeping Tailwind disabled and using CSS Modules or global CSS instead. I’ll create the app with TypeScript, the App Router, a `src` directory, and npm, then verify it locally.
>
> **Checked initial configuration**
>
> 
>
> **Searched 1 website**
>
> 
>
> Worked for 1m 39s

Absolutely. We’ll set up **only the Next.js foundation first**, make sure it runs correctly, and commit it before adding SQLite or application features.

Your lab requires a local-first Next.js and SQLite todo application, a GitHub repository, meaningful commit history, documentation, tests, and AI transcripts. `lab_one.pdf`

## 1. Check that Node.js is installed

Open **PowerShell** or the VS Code terminal and run:

```powershell
node -v
npm -v
git --version
```

Next.js currently requires at least **Node.js 20.9**. For a fresh installation, use **Node.js 24 LTS**; Node 22 LTS is also suitable. The current Node.js download page offers Node 24.18.1 LTS. ([Next.js](https://nextjs.org/docs/app/getting-started/installation?utm_source=chatgpt.com))

Your output might resemble:

```text
v24.18.1
11.16.0
git version 2.x.x
```

The exact npm and Git versions may differ.

If `node` is not recognised, install the **LTS version of Node.js**, then completely close and reopen PowerShell.

---

## 2. Create a folder for the lab

In PowerShell:

```powershell
cd $HOME\Documents
mkdir COMS3011A
cd COMS3011A
```

You should now be inside:

```text
Documents\COMS3011A
```

Check with:

```powershell
pwd
```

---

## 3. Generate the Next.js application

Run:

```powershell
npx create-next-app@latest todo-app
```

You may be asked whether it can install `create-next-app`. Enter:

```text
y
```

The current Next.js setup tool asks whether you want the recommended defaults or a custom setup. `create-next-app` is the official and easiest method for creating a Next.js project. ([Next.js](https://nextjs.org/docs/app/getting-started/installation?utm_source=chatgpt.com))

Choose these answers:

```text
Would you like to use the recommended Next.js defaults?
No, customize settings

Would you like to use TypeScript?
Yes

Which linter would you like to use?
ESLint

Would you like to use React Compiler?
No

Would you like to use Tailwind CSS?
No

Would you like your code inside a src/ directory?
Yes

Would you like to use App Router?
Yes

Would you like to customize the import alias?
No
```

### Why these choices?

- **TypeScript:** catches many mistakes before running the application.
- **ESLint:** detects suspicious or poor-quality code.
- **React Compiler - No:** avoids introducing something unnecessary for this lab.
- **Tailwind - No:** ordinary CSS is sufficient and keeps the dependency list smaller.
- **`src` directory - Yes:** keeps application code organised.
- **App Router - Yes:** this is the recommended current Next.js routing system.
- **Import alias - No:** the default `@/*` alias is sufficient.

The current recommended Next.js setup uses TypeScript, ESLint, Tailwind, App Router and Turbopack, but the setup tool permits each choice to be customised. ([Next.js](https://nextjs.org/docs/app/getting-started/installation?utm_source=chatgpt.com))

Wait until you see a success message. A new folder called `todo-app` should have been created.

---

## 4. Enter the project and run it

```powershell
cd todo-app
npm run dev
```

You should see something similar to:

```text
Local: http://localhost:3000
```

Open the displayed address in your browser:

```text
http://localhost:3000
```

The default Next.js page should appear. `npm run dev` starts the development server, and changes are displayed after you save your files. ([Next.js](https://nextjs.org/docs/app/getting-started/installation?utm_source=chatgpt.com))

Leave this terminal running while developing.

To stop the server later, press:

```text
Ctrl + C
```

---

## 5. Open the project in VS Code

Open a second PowerShell window in the project folder and run:

```powershell
code .
```

If `code` is not recognised:

1. Open Visual Studio Code.
2. Select **File → Open Folder**.
3. Open:

```text
Documents\COMS3011A\todo-app
```

---

## 6. Understand the important files

Your project should contain something similar to:

```text
todo-app/
├── public/
├── src/
│   └── app/
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── package.json
├── package-lock.json
├── tsconfig.json
├── eslint.config.mjs
└── next.config.ts
```

The important parts are:

### `src/app/page.tsx`

This is the page shown at:

```text
http://localhost:3000
```

### `src/app/layout.tsx`

This wraps all pages. It normally contains the HTML structure and site-wide metadata.

### `src/app/globals.css`

This contains styles that apply across the application.

### `package.json`

This records:

- Installed packages
- Project scripts
- Project metadata

### `package-lock.json`

This records the exact dependency versions installed by npm. Commit it to Git.

Next.js uses file-system routing, meaning files and folders inside the `app` directory determine the application’s routes. ([Next.js](https://nextjs.org/docs/app/getting-started/installation?utm_source=chatgpt.com))

---

## 7. Replace the default home page

Open:

```text
src/app/page.tsx
```

Delete its contents and replace them with:

```tsx
export default function Home() {
  return (
    <main>
      <h1>Todo Application</h1>
      <p>COMS3011A Lab 1</p>
    </main>
  );
}
```

Save the file.

The browser should automatically update and display:

```text
Todo Application
COMS3011A Lab 1
```

This confirms that:

- Node.js works
- Next.js works
- TypeScript works
- The development server works
- You know which file controls the home page

---

## 8. Check that the project builds correctly

Stop the development server with:

```text
Ctrl + C
```

Then run:

```powershell
npm run lint
npm run build
```

Both commands should finish without errors.

- `npm run lint` checks the code using ESLint.
- `npm run build` creates a production build.
- After building, `npm run start` can run the production server. ([Next.js](https://nextjs.org/docs/app/getting-started/installation?utm_source=chatgpt.com))

Restart development mode afterward:

```powershell
npm run dev
```

---

## 9. Make the first Git commit

Check whether Git was initialised:

```powershell
git status
```

If it says that this is not a Git repository, run:

```powershell
git init
```

Then make your first commit:

```powershell
git add .
git commit -m "Set up Next.js project with TypeScript and App Router"
```

That is a strong commit message because it explains exactly what changed.

Your lab’s full-mark rubric requires at least six coherent commits, informative messages and work visibly spread over more than one session. `lab_one.pdf`

A sensible future commit sequence would be:

1. `Set up Next.js project with TypeScript and App Router`
2. `Add SQLite task schema and database initialization`
3. `Implement task creation and active task list`
4. `Add task editing, status changes and sorting`
5. `Implement archiving and overdue indication`
6. `Add deterministic database tests`
7. `Document installation, database design and dependencies`

Do not create artificial empty commits. Each commit should leave the project working.

---

## 10. Connect it to GitHub

Create a new **empty GitHub repository** called something like:

```text
coms3011a-todo-app
```

Do not ask GitHub to create a README or `.gitignore`, because your local project already contains those files.

GitHub will give you a repository address. Then run:

```powershell
git branch -M main
git remote add origin YOUR_REPOSITORY_ADDRESS
git push -u origin main
```

Replace `YOUR_REPOSITORY_ADDRESS` with the address GitHub provides.

Verify it with:

```powershell
git remote -v
```

---

## Important lab notes

Your final application must retain data after a restart, so task information will later be stored in SQLite rather than an array or JSON file. Archived tasks must remain in the database, and “overdue” should be calculated from the due date and status rather than stored as a fourth status. Your tests must use a disposable test database, with at least one test covering archiving or the overdue rule. `lab_one.pdf`

Also save this conversation as part of your AI transcript. The rubric expects task-level AI usage with stated constraints, and full marks require at least one genuine example where you notice an unsuitable or incorrect suggestion and redirect the AI. `lab_one.pdf`

---

**Sources:**

- [Getting Started: Installation | Next.js](https://nextjs.org/docs/app/getting-started/installation?utm_source=chatgpt.com)

## Prompt:
7/31/2026, 11:33:21 AM

npx create-next-app@latest frontend --typescript --eslint --app --src-dir --no-tailwind --no-react-compiler --use-npm --import-alias "@/*" --disable-git

So i ran this line

## Response:
7/31/2026, 11:32:22 AM

> **Setting up Next.js**
>
> I’m treating this command as creating a TypeScript Next.js app in `frontend/`. I’m noting that Git initialization is disabled, so I’ll initialize the repository at the project root instead.
>
> **Set up Next.js**
>
> 
>
> **Searching the web**
>
> [Getting Started: Installation | Next.js](https://nextjs.org/docs/app/getting-started/installation)
>
> **Searched 1 website**
>
> 
>
> Worked for 30s

Perfect - that command is valid and sets up the project exactly as follows:

```powershell
npx create-next-app@latest frontend `
  --typescript `
  --eslint `
  --app `
  --src-dir `
  --no-tailwind `
  --no-react-compiler `
  --use-npm `
  --import-alias "@/*" `
  --disable-git
```

It created a folder named **`frontend`** containing:

- TypeScript
- ESLint
- Next.js App Router
- A `src` directory
- Regular CSS instead of Tailwind
- npm as the package manager
- The `@/*` import shortcut
- No automatically created Git repository

That matches the standard options provided by `create-next-app`. ([Next.js](https://nextjs.org/docs/app/getting-started/installation?utm_source=chatgpt.com))

## Step 1: Enter the project

Run:

```powershell
cd frontend
```

You can confirm where you are with:

```powershell
pwd
```

## Step 2: Start Next.js

Run:

```powershell
npm run dev
```

You should see something similar to:

```text
▲ Next.js
- Local: http://localhost:3000
```

Open this in your browser:

```text
http://localhost:3000
```

You should see the default Next.js page.

## Step 3: Open it in VS Code

Keep the development server running and open another terminal, then run:

```powershell
cd frontend
code .
```

Your important files will be inside:

```text
frontend/
├── src/
│   └── app/
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── public/
├── package.json
├── package-lock.json
├── tsconfig.json
└── eslint.config.mjs
```

The main homepage is:

```text
src/app/page.tsx
```

## Step 4: Replace the default homepage

Open `src/app/page.tsx`, delete everything inside it and use:

```tsx
export default function Home() {
  return (
    <main>
      <h1>Todo Application</h1>
      <p>COMS3011A Lab 1</p>
    </main>
  );
}
```

Save the file. Your browser should update automatically.

## Step 5: Check that everything works

Stop the server using:

```text
Ctrl + C
```

Then run:

```powershell
npm run lint
npm run build
```

Both should finish without errors. Restart development mode with:

```powershell
npm run dev
```

## Step 6: Set up Git

Because you used:

```text
--disable-git
```

Git was deliberately not initialised.

For the simplest submission structure, I recommend making the **`frontend` folder the GitHub repository root**, because it keeps `package.json`, the README and all required commands in one place.

While inside `frontend`, run:

```powershell
git init
git add .
git commit -m "Set up Next.js project with TypeScript and App Router"
```

Your lab places significant marks on meaningful commit history and requires the project to install and start from a clean clone using the README alone. `lab_one.pdf`

Your immediate next command should therefore be:

```powershell
cd frontend
npm run dev
```

---

**Sources:**

- [Getting Started: Installation | Next.js](https://nextjs.org/docs/app/getting-started/installation?utm_source=chatgpt.com)

## Prompt:
7/31/2026, 11:34:41 AM

okay but i dont think i need a frontend and backend to be seperate please just clarify

## Response:
7/31/2026, 11:33:40 AM

You **do not need separate frontend and backend folders** for this lab.

Next.js can handle both:

- the **frontend**: pages, forms, buttons, task list
- the **backend logic**: database queries, server actions, route handlers
- the **SQLite database**: stored locally in the same project

Your brief simply requires a local-first application using **Next.js and SQLite**; it does not require a separate backend server. `lab_one.pdf`

The word `frontend` in this command:

```powershell
npx create-next-app@latest frontend ...
```

is only the **folder name**. It does not mean the project can contain frontend code only.

Your current structure is probably:

```text
your-parent-folder/
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── ...
```

You can keep it like that, but naming the whole project `frontend` may become confusing. A better name would be:

```text
todo-app
```

or:

```text
coms3011a-lab1
```

Since you have only just created it, you can rename the folder.

### In PowerShell

First move out of the folder if you are inside it:

```powershell
cd ..
```

Then rename it:

```powershell
Rename-Item frontend todo-app
```

Enter it again:

```powershell
cd todo-app
npm run dev
```

Your final project can be one unified application:

```text
todo-app/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── actions.ts
│   │   └── api/
│   ├── components/
│   └── lib/
│       └── database.ts
├── database/
│   └── tasks.db
├── tests/
├── package.json
└── README.md
```

So yes: **one Next.js project, one repository, and SQLite inside that project** is the sensible approach for this lab.

## Prompt:
7/31/2026, 3:44:45 PM

Okay so i deleted everything, lets start from the begining, and please go step by step so i can ask questions

## Response:
7/31/2026, 3:43:39 PM

> **Searching the web**
>
> [Getting Started: Installation](https://nextjs.org/docs/app/getting-started/installation)
> [App Store](https://www.apple.com/my/app-store/)
> [Node.js Releases](https://nodejs.org/en/about/previous-releases)
> [Google - Apps on Google Play](https://play.google.com/store/apps/details?hl=en&id=com.google.android.googlequicksearchbox)
> [App Store Connect - Apple](https://apps.apple.com/us/app/app-store-connect/id1234793120)
> [Mobile app](https://en.wikipedia.org/wiki/Mobile_app)
>
> **Searched 6 websites**
>
> 
>
> Worked for 11s

We’ll do **one step at a time** and wait after each step.

## Step 1: Check the required software

Open **PowerShell** or a terminal in VS Code and run these three commands separately:

```powershell
node -v
```

```powershell
npm -v
```

```powershell
git --version
```

Next.js requires **Node.js 20.9 or newer**. Node.js 24 is currently an LTS release and is a good choice for this project. ([Next.js](https://nextjs.org/docs/app/getting-started/installation?utm_source=chatgpt.com))

Your lab will use one Next.js project containing both the user interface and the SQLite database functionality; separate frontend and backend projects are not required by the brief. `lab_one.pdf`

Paste the output of those three commands here, and we’ll continue to Step 2.

---

**Sources:**

- [Getting Started: Installation](https://nextjs.org/docs/app/getting-started/installation?utm_source=chatgpt.com)

## Prompt:
7/31/2026, 3:46:54 PM

okay done, whats next

## Response:
7/31/2026, 3:46:56 PM

> **Searching the web**
>
> [CLI: create-next-app CLI | Next.js](https://nextjs.org/docs/pages/api-reference/cli/create-next-app)
>
> **Searched 1 website**
>
> 
>
> Worked for 28s

## Step 2: Create the single Next.js project

Go to the folder where you want the project stored. For example:

```powershell
cd $HOME\Documents
```

Then run:

```powershell
npx create-next-app@latest coms3011a-lab1 --typescript --eslint --app --src-dir --no-tailwind --no-react-compiler --use-npm --import-alias "@/*"
```

This creates **one unified project** named `coms3011a-lab1`. We are deliberately not using `--disable-git`, because your lab requires a meaningful Git commit history. `lab_one.pdf`

The command uses supported `create-next-app` options for TypeScript, ESLint, the App Router, a `src` directory and npm. ([Next.js](https://nextjs.org/docs/pages/api-reference/cli/create-next-app?utm_source=chatgpt.com))

Wait while it installs. When it finishes, tell me what the final few lines say, and do not run anything else yet.

---

**Sources:**

- [CLI: create-next-app CLI | Next.js](https://nextjs.org/docs/pages/api-reference/cli/create-next-app?utm_source=chatgpt.com)

## Prompt:
7/31/2026, 3:49:47 PM

Using defaults for unprovided options:

  --ts                    TypeScript (use --js for JavaScript)
  --agents-md             AGENTS.md (use --no-agents-md for No AGENTS.md)

Creating a new Next.js app in C:\Users\vares\OneDrive\Desktop\WITS 3rd Year\SDP\Labs\Lab1\coms3011a-lab1.

Using npm.

Initializing project with template: app 


Installing dependencies:
- next
- react
- react-dom

Installing devDependencies:
- @types/node
- @types/react
- @types/react-dom
- eslint
- eslint-config-next
- typescript


added 343 packages, and audited 344 packages in 60s

140 packages are looking for funding
  run `npm fund` for details

12 high severity vulnerabilities

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.

Generating route types...
✓ Types generated successfully

Initialized a git repository.

Success! Created coms3011a-lab1 at C:\Users\vares\OneDrive\Desktop\WITS 3rd Year\SDP\Labs\Lab1\coms3011a-lab1

This is what it says

## Response:
7/31/2026, 3:49:58 PM

> **Moving to local setup**
>
> The project was created successfully, and the audit warning isn’t blocking progress. I’m keeping the existing dependency versions for now rather than forcing upgrades. Next, I’m starting the development server, then I’ll verify the starter page before adding the lab’s initial structure.
>
> **Moved to a local setup**
>
> 
>
> Worked for 12s

Great - the project was created successfully, and Git was initialized automatically.

Do **not** run:

```powershell
npm audit fix --force
```

That can introduce breaking dependency changes. We can inspect the audit warning later.

## Step 3: Start the application

Enter the project folder:

```powershell
cd .\coms3011a-lab1
```

Then start the Next.js development server:

```powershell
npm run dev
```

You should see an address similar to:

```text
http://localhost:3000
```

Open that address in your browser. You should see the default Next.js page.

This confirms that the application can install and start correctly, which is the first item in the lab’s functional walkthrough. `lab_one.pdf`

Tell me what appears in the terminal and whether the page loads.

## Prompt:
7/31/2026, 3:52:25 PM

the page loads

## Response:
7/31/2026, 3:52:33 PM

Good — the Next.js project is running correctly.

## Step 4: Open the project in VS Code

Keep the terminal running `npm run dev`.

Open a **second PowerShell window** in the project folder and run:

```powershell
code .
```

This should open the entire `coms3011a-lab1` project in VS Code.

In the left-hand Explorer panel, you should see folders and files including:

```text
src
public
package.json
package-lock.json
README.md
```

Expand:

```text
src
└── app
    ├── favicon.ico
    ├── globals.css
    ├── layout.tsx
    └── page.tsx
```

Tell me when you can see `page.tsx`, and we’ll continue.

## Prompt:
7/31/2026, 3:53:30 PM

okay i can see it

## Response:
7/31/2026, 3:53:37 PM

## Step 5: Replace the default homepage

Open:

```text
src/app/page.tsx
```

Delete everything currently inside that file and replace it with:

```tsx
export default function Home() {
  return (
    <main>
      <h1>Todo Application</h1>
      <p>COMS3011A Lab 1</p>
    </main>
  );
}
```

Save the file using:

```text
Ctrl + S
```

Because `npm run dev` is still running, the browser should update automatically.

You should now see:

```text
Todo Application
COMS3011A Lab 1
```

This is only a temporary starting page; we have not added tasks or SQLite yet. The final application will need task creation, editing, archiving, sorting and persistent SQLite storage. `lab_one.pdf`

Tell me whether the browser updates correctly.

## Prompt:
7/31/2026, 3:54:57 PM

Yes it does

## Response:
7/31/2026, 3:55:11 PM

## Step 6: Check Git before making your first commit

In the VS Code terminal, make sure you are inside:

```text
coms3011a-lab1
```

Then run:

```powershell
git status
```

This will show which files have changed since the project was created. Your lab awards marks for a clear, meaningful commit history, so we’ll commit each working stage separately. `lab_one.pdf`

Paste the `git status` output here.

## Prompt:
7/31/2026, 3:56:19 PM

On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   src/app/page.tsx

no changes added to commit (use "git add" and/or "git commit -a")

## Response:
7/31/2026, 3:56:30 PM

Perfect - Git is tracking only the homepage change.

## Step 7: Commit the homepage change

Run:

```powershell
git add src/app/page.tsx
```

Then:

```powershell
git commit -m "Replace default homepage with todo app heading"
```

This creates a clear commit for one working change, which helps meet the lab’s meaningful commit-history requirement. `lab_one.pdf`

Paste the output from the `git commit` command.

## Prompt:
7/31/2026, 3:57:27 PM

Can i git add . 
And then say that im setting up Next.js in my commit?

## Response:
7/31/2026, 3:57:38 PM

Yes, you can use:

```powershell
git add .
```

That stages **all changed files** in the current project. Right now, `git status` shows only `src/app/page.tsx`, so it is safe.

However, I would **not** use “Set up Next.js” as this commit message. `create-next-app` already created and committed the initial Next.js setup automatically; your current change is replacing the default homepage.

Use:

```powershell
git add .
git commit -m "Customize homepage for todo application"
```

That accurately describes what changed. Clear, accurate commit messages are important because the lab specifically marks the quality of your commit history. `lab_one.pdf`

## Prompt:
7/31/2026, 3:58:43 PM

warning: in the working copy of 'src/app/page.tsx', LF will be replaced by CRLF the next time Git touches it
I got this when i said git add . is it fine?

## Response:
7/31/2026, 3:58:52 PM

Yes, that warning is completely fine.

It means:

- **LF** is the usual line-ending format on Linux/macOS.
- **CRLF** is the usual format on Windows.
- Git is warning that it may convert the file to Windows-style line endings later.

It is **not an error**, and your file has been staged successfully.

Now run:

```powershell
git commit -m "Customize homepage for todo application"
```

Then paste the output here.

## Prompt:
7/31/2026, 3:59:30 PM

[master c387854] Customize homepage for todo application
 1 file changed, 4 insertions(+), 59 deletions(-)

## Response:
7/31/2026, 3:59:40 PM

Perfect — the commit worked successfully.

```text
[master c387854]
```

means:

- the commit was created on the `master` branch;
- `c387854` is the commit’s unique shortened ID;
- one file was changed;
- the default page was replaced with your four-line homepage.

## Step 8: Confirm everything is committed

Run:

```powershell
git status
```

You should ideally see:

```text
nothing to commit, working tree clean
```

Paste the output here.

## Prompt:
7/31/2026, 4:00:04 PM

Yes i got that

## Response:
7/31/2026, 4:00:14 PM

> **Choosing the next step**
>
> I’m continuing from the clean repository state. I’m choosing to rename the default branch to `main` before connecting the project to GitHub, keeping the repository setup aligned with the lab’s workflow.
>
> **Chose the next step**
>
> 
>
> Worked for 10s

Great - your working tree is clean, so the first change is safely committed.

## Step 9: Rename the Git branch to `main`

Your branch is currently called `master`. Rename it with:

```powershell
git branch -M main
```

Then check it:

```powershell
git status
```

The first line should now say:

```text
On branch main
```

This will make connecting the project to a new GitHub repository simpler. Your lab ultimately requires you to submit the GitHub repository link and maintain a meaningful commit history. `lab_one.pdf`

Tell me once it says `On branch main`.

## Prompt:
7/31/2026, 4:00:50 PM

yes done

## Response:
7/31/2026, 4:01:01 PM

> **Continuing setup steps**
>
> I’m moving to the next practical milestone: connecting the completed Next.js project to a GitHub repository. This will provide the shareable repository link required for submission and preserve the existing commits.
>
> **Continued setup steps**
>
> 
>
> Worked for 10s

## Step 10: Create the GitHub repository

Go to **GitHub** and create a new repository.

Use:

```text
Repository name: coms3011a-lab1
```

Choose either **Public** or **Private**, depending on your lecturer’s requirements.

Important: leave these options **unchecked**:

```text
Add a README file
Add .gitignore
Choose a licence
```

Your local Next.js project already contains a README and `.gitignore`, so the GitHub repository should be empty.

Then click:

```text
Create repository
```

Do not run the commands GitHub shows yet. Your lab requires the GitHub repository link as part of the submission. `lab_one.pdf`

Tell me when the empty repository has been created.

## Prompt:
7/31/2026, 4:01:52 PM

okay so i called my repository SDP_Lab1

## Response:
7/31/2026, 4:02:01 PM

That’s completely fine. Your GitHub repository can be called:

```text
SDP_Lab1
```

It does **not** need to have the same name as your local folder. Your local folder can remain:

```text
coms3011a-lab1
```

## Step 11: Copy the repository URL

On the GitHub page for `SDP_Lab1`, click the green **Code** button, select **HTTPS**, and copy the URL. It should look similar to:

```text
https://github.com/your-username/SDP_Lab1.git
```

Do not run anything yet. Paste that URL here, and we’ll connect your local project to GitHub. The repository link will eventually form part of your lab submission. `lab_one.pdf`

## Prompt:
7/31/2026, 4:02:20 PM

okay doen

## Response:
7/31/2026, 4:02:27 PM

## Step 12: Connect your local project to GitHub

In the terminal inside your `coms3011a-lab1` folder, run:

```powershell
git remote add origin YOUR_GITHUB_URL
```

Replace `YOUR_GITHUB_URL` with the HTTPS link you copied. For example:

```powershell
git remote add origin https://github.com/your-username/SDP_Lab1.git
```

Then check that it was added:

```powershell
git remote -v
```

You should see `origin` listed for both fetch and push.

Do not push yet. Paste the output of `git remote -v` here.

## Prompt:
7/31/2026, 4:03:37 PM

origin  https://github.com/Vareshan/SDP_Lab1.git (fetch)
origin  https://github.com/Vareshan/SDP_Lab1.git (push)

Okay i got that

## Response:
7/31/2026, 4:03:42 PM

Perfect - your local project is now connected to the correct GitHub repository.

## Step 13: Push your code to GitHub

Run:

```powershell
git push -u origin main
```

The `-u` links your local `main` branch to GitHub’s `main` branch, so future pushes can simply use:

```powershell
git push
```

You may be asked to sign in to GitHub in your browser.

After it finishes, refresh your `SDP_Lab1` repository page. You should see your Next.js files and commit history there. The GitHub repository link is one of the required submission items for the lab. `lab_one.pdf`

Paste the terminal output from the push.

## Prompt:
7/31/2026, 4:04:51 PM

Enumerating objects: 29, done.
Counting objects: 100% (29/29), done.
Delta compression using up to 8 threads
Compressing objects: 100% (26/26), done.
Writing objects: 100% (29/29), 61.50 KiB | 3.62 MiB/s, done.
Total 29 (delta 2), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (2/2), done.
To https://github.com/Vareshan/SDP_Lab1.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.

okay done

## Response:
7/31/2026, 4:05:04 PM

> **Choosing the next step**
>
> The initial project setup is complete and safely pushed. I’m treating the next milestone as data persistence: first I’ll confirm the repository structure, then choose a lightweight SQLite approach before adding schema or UI changes.
>
> **Chose the next step**
>
> 
>
> **Searching the web**
>
> [GitHub - WiseLibs/better-sqlite3: The fastest and simplest library for SQLite3 in Node.js. · GitHub](https://github.com/WiseLibs/better-sqlite3)
> [Getting Started: Server and Client Components | Next.js](https://nextjs.org/docs/app/getting-started/server-and-client-components)
>
> **Searched 2 websites**
>
> 
>
> Worked for 41s

Perfect - the push succeeded. Your local `main` branch is now linked to the GitHub repository.

## Step 14: Install the SQLite package

Your lab requires data to persist using SQLite, rather than storing tasks only in memory or in a JSON file. `lab_one.pdf`

If `npm run dev` is still running, stop it with:

```text
Ctrl + C
```

Then, while inside the `coms3011a-lab1` folder, run:

```powershell
npm install better-sqlite3
```

`better-sqlite3` gives Node.js a straightforward API for creating and querying a local SQLite database. ([github.com](https://github.com/WiseLibs/better-sqlite3))

Do not commit anything yet. Paste the installation output here.

---

**Sources:**

- [GitHub - WiseLibs/better-sqlite3: The fastest and simplest library for SQLite3 in Node.js. · GitHub](https://github.com/WiseLibs/better-sqlite3)

## Prompt:
7/31/2026, 4:07:08 PM

added 2 packages, and audited 346 packages in 6s

140 packages are looking for funding
  run `npm fund` for details

12 high severity vulnerabilities

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.

## Response:
7/31/2026, 4:07:10 PM

> **Searching better-sqlite3 TypeScript types official package 2026**
>
> [@types/better-sqlite3 - npm](https://www.npmjs.com/package/%40types/better-sqlite3)
> [UNPKG](https://app.unpkg.com/%40types/better-sqlite3%407.6.13/files/package.json)
> [@types/better-sqlite3 | npm.io](https://npm.io/package/%40types/better-sqlite3)
> [Releases · WiseLibs/better-sqlite3 · GitHub](https://github.com/WiseLibs/better-sqlite3/releases)
> [@types/better-sqlite3@7.6.13 - jsDocs.io](https://www.jsdocs.io/package/%40types/better-sqlite3)
> [node-sqlite3 was just deprecated](https://www.reddit.com/r/node/comments/1q1r5s1/nodesqlite3_was_just_deprecated/)
> [To Type or Not to Type? A Systematic Comparison of the Software Quality of JavaScript and TypeScript Applications on GitHub](https://arxiv.org/abs/2203.11115)
>
> **Searched 7 websites**
>
> 
>
> Worked for 13s

Great - `better-sqlite3` installed successfully.

The vulnerability message is a warning from `npm audit`; do **not** run `npm audit fix --force`, because that can introduce breaking dependency changes.

## Step 15: Install the TypeScript definitions

Because your project uses TypeScript, install the type definitions for `better-sqlite3`:

```powershell
npm install --save-dev @types/better-sqlite3
```

The `@types/better-sqlite3` package provides TypeScript definitions for the SQLite library. ([npm](https://www.npmjs.com/package/%40types/better-sqlite3?utm_source=chatgpt.com))

Later, we’ll record both packages and why we chose them in the required **Third-Party Code** documentation. `lab_one.pdf`

Run only that command and paste the output here.

---

**Sources:**

- [@types/better-sqlite3 - npm](https://www.npmjs.com/package/%40types/better-sqlite3?utm_source=chatgpt.com)

## Prompt:
7/31/2026, 4:08:22 PM

added 1 package, and audited 347 packages in 3s

140 packages are looking for funding
  run `npm fund` for details

12 high severity vulnerabilities

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.

## Response:
7/31/2026, 4:08:30 PM

Great - the TypeScript definitions installed successfully.

## Step 16: Check what changed

Run:

```powershell
git status
```

You should see changes to:

```text
package.json
package-lock.json
```

These files now record the SQLite dependency and its TypeScript definitions.

We’ll commit this as a separate, meaningful step because the lab marks the quality of your commit history. `lab_one.pdf`

Paste the `git status` output here.

## Prompt:
7/31/2026, 4:08:58 PM

yes i see that

## Response:
7/31/2026, 4:09:06 PM

## Step 17: Commit the SQLite dependencies

Stage the two changed files:

```powershell
git add package.json package-lock.json
```

Then commit them:

```powershell
git commit -m "Add SQLite database dependency"
```

This keeps the dependency installation as its own clear commit, which supports the lab’s commit-history requirement. `lab_one.pdf`

Paste the output from the commit command.

## Prompt:
7/31/2026, 4:09:55 PM

okay done

## Response:
7/31/2026, 4:10:09 PM

> **Creating the database layer**
>
> I’m implementing the next concrete step: setting up a local SQLite connection with `better-sqlite3`, adding the schema for projects and tasks, and keeping the structure compatible with the app described in the uploaded brief.
>
> **Created the database layer**
>
> 
>
> Worked for 17s

Great - the SQLite dependencies are now safely committed.

## Step 18: Create the database schema file

In VS Code, create a new folder at the project root called:

```text
database
```

Inside it, create:

```text
schema.sql
```

Your structure should now include:

```text
coms3011a-lab1/
├── database/
│   └── schema.sql
├── src/
├── package.json
└── ...
```

For now, leave `schema.sql` empty.

We’re creating a separate schema file because the rubric specifically expects a schema that clearly shows the columns and constraints used by the SQLite database. `lab_one.pdf`

Tell me once the folder and empty file exist.

## Prompt:
7/31/2026, 4:11:40 PM

okay done

## Response:
7/31/2026, 4:11:55 PM

## Step 19: Define the `tasks` table

Open:

```text
database/schema.sql
```

Paste this into the file:

```sql
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    title TEXT NOT NULL,

    description TEXT NOT NULL DEFAULT '',

    due_date TEXT NOT NULL,

    topic TEXT NOT NULL,

    status TEXT NOT NULL DEFAULT 'Todo'
        CHECK (status IN ('Todo', 'In-Progress', 'Complete')),

    archived_at TEXT DEFAULT NULL,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Then save the file.

### What each column means

- `id`: unique identifier for each task.
- `title`: the task name.
- `description`: extra details about the task.
- `due_date`: stored as text in `YYYY-MM-DD` format.
- `topic`: the task category, such as `University` or `Personal`.
- `status`: limited to the three required values.
- `archived_at`: remains `NULL` while active and stores a timestamp when archived.
- `created_at`: records when the task was created.
- `updated_at`: records when the task was last changed.

We deliberately do **not** create an `overdue` column or an `Overdue` status. Overdue will later be calculated from the due date and current status, as required by the rubric. Archived tasks also remain in the same table rather than being deleted. `lab_one.pdf`

Tell me once you have pasted and saved it.

## Prompt:
7/31/2026, 4:12:52 PM

okay so we will get back to this and make the database stuff, for now i just wanted it to be set up correctly

## Response:
7/31/2026, 4:13:07 PM

Yes - the project is now set up correctly, and we can stop before building the database.

You currently have:

- One unified **Next.js** project
- TypeScript
- ESLint
- App Router
- A `src` directory
- No Tailwind
- Git initialized with meaningful commits
- A GitHub repository connected and pushed
- `better-sqlite3` installed for later
- `@types/better-sqlite3` installed for TypeScript

That structure is suitable for the lab because Next.js can contain both the interface and the server-side SQLite logic. You do not need separate frontend and backend projects. The lab only requires a local-first application built with Next.js and SQLite. `lab_one.pdf`

You can leave the `database/schema.sql` file there, even if it is empty. Since we are not implementing the database yet, do not commit the unfinished schema.

Run this once:

```powershell
git status
```

If it lists `database/schema.sql` as untracked, that is fine. Leave it uncommitted until we properly design the database.

Your basic setup stage is complete.

## Prompt:
7/31/2026, 4:14:47 PM

okay now how can i run the program?

## Response:
7/31/2026, 4:14:56 PM

## Run the Next.js program

Open a terminal in VS Code and make sure you are inside the project folder:

```powershell
cd "C:\Users\vares\OneDrive\Desktop\WITS 3rd Year\SDP\Labs\Lab1\coms3011a-lab1"
```

Then run:

```powershell
npm run dev
```

You should see something like:

```text
Local: http://localhost:3000
```

Open this in your browser:

```text
http://localhost:3000
```

Leave the terminal running while using the application. To stop it, press:

```text
Ctrl + C
```

This runs the application locally, as required by the lab brief. `lab_one.pdf`

## Prompt:
7/31/2026, 4:15:31 PM

how can i run it without using npm run dev

## Response:
7/31/2026, 4:15:33 PM

> **Searching the web**
>
> [Getting Started: Installation | Next.js](https://nextjs.org/docs/app/getting-started/installation)
>
> **Searched 1 website**
>
> 
>
> Worked for 16s

You can run it directly with the Next.js command instead of the npm script:

```powershell
npx next dev
```

That is effectively the same as:

```powershell
npm run dev
```

because your `package.json` contains:

```json
"dev": "next dev"
```

`next dev` starts the development server with automatic page refreshing while you edit your code. ([Next.js](https://nextjs.org/docs/app/getting-started/installation?utm_source=chatgpt.com))

Then open:

```text
http://localhost:3000
```

### To run it like a finished application

First build it:

```powershell
npx next build
```

Then start the production server:

```powershell
npx next start
```

You only need to rebuild after changing the code. Next.js distinguishes development mode (`next dev`) from production mode (`next build` followed by `next start`). ([Next.js](https://nextjs.org/docs/app/getting-started/deploying?utm_source=chatgpt.com))

For now, while developing the lab, use:

```powershell
npx next dev
```

---

**Sources:**

- [Getting Started: Installation | Next.js](https://nextjs.org/docs/app/getting-started/installation?utm_source=chatgpt.com)

## Prompt:
7/31/2026, 4:16:56 PM

Okay, but i dont want to be running it in dev mode

## Response:
7/31/2026, 4:16:58 PM

> **Searching the web**
>
> [Could not find a production build | Next.js](https://nextjs.org/docs/messages/production-start-no-build-id)
>
> **Searched 1 website**
>
> 
>
> Worked for 14s

Then run it in **production mode**.

First stop the current development server with:

```text
Ctrl + C
```

Then create the production build:

```powershell
npm run build
```

Once that finishes successfully, start the production server:

```powershell
npm run start
```

Open:

```text
http://localhost:3000
```

This is **not development mode**:

- `npm run build` creates an optimized production build.
- `npm run start` runs that production build using the Next.js Node.js server. ([Next.js](https://nextjs.org/docs/app/api-reference/cli/next?utm_source=chatgpt.com))

Whenever you change your code, stop the server and build again:

```powershell
npm run build
npm run start
```

Run `npm run build` now and paste what it outputs.

---

**Sources:**

- [CLI: next CLI | Next.js](https://nextjs.org/docs/app/api-reference/cli/next?utm_source=chatgpt.com)

## Prompt:
7/31/2026, 4:35:59 PM

> coms3011a-lab1@0.1.0 build
> next build

▲ Next.js 16.2.12 (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully in 3.7s
✓ Finished TypeScript in 5.5s    
✓ Collecting page data using 5 workers in 1313ms    
✓ Generating static pages using 5 workers (4/4) in 1178ms
✓ Finalizing page optimization in 21ms    

Route (app)
┌ ○ /
└ ○ /_not-found


○  (Static)  prerendered as static content

## Response:
7/31/2026, 4:36:08 PM

Perfect — the production build completed successfully.

## Next step: start the production server

Run:

```powershell
npm run start
```

You should see something like:

```text
Local: http://localhost:3000
```

Open:

```text
http://localhost:3000
```

This is now running in **production mode**, not development mode. Leave the terminal open while using the application.

Tell me what appears after running `npm run start`.

## Prompt:
7/31/2026, 4:36:35 PM

the site launches, so its working as expected

## Response:
7/31/2026, 4:36:46 PM

Perfect — your Next.js application is now running correctly in **production mode**.

The workflow is:

```powershell
npm run build
npm run start
```

- `npm run build` creates the optimized production version.
- `npm run start` launches that built version at `http://localhost:3000`.

To stop it:

```text
Ctrl + C
```

After changing any code, rebuild before starting again:

```powershell
npm run build
npm run start
```

Your Next.js project setup is complete.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)