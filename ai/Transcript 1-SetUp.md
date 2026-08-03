# Raj's SDP - Next.js Setup Guide

> **Platform:** chatgpt  ·  **Messages:** 7  ·  **Exported:** August 3, 2026

---

### Turn 1 — 👤 You

lab_one.pdfPDFPlease may you run me through the steps to set up Next.js

---

### Turn 2 — 🤖 Assistant

Absolutely. We’ll set up only the Next.js foundation first, make sure it runs correctly, and commit it before adding SQLite or application features.
Your lab requires a local-first Next.js and SQLite todo application, a GitHub repository, meaningful commit history, documentation, tests, and AI transcripts. 
1. Check that Node.js is installed
Open PowerShell or the VS Code terminal and run:

Next.js currently requires at least Node.js 20.9. For a fresh installation, use Node.js 24 LTS; Node 22 LTS is also suitable. The current Node.js download page offers Node 24.18.1 LTS. Next.js+2Node.js+2
Your output might resemble:

The exact npm and Git versions may differ.
If node is not recognised, install the LTS version of Node.js, then completely close and reopen PowerShell.

2. Create a folder for the lab
In PowerShell:

You should now be inside:

Check with:

3. Generate the Next.js application
Run:

You may be asked whether it can install create-next-app. Enter:

The current Next.js setup tool asks whether you want the recommended defaults or a custom setup. create-next-app is the official and easiest method for creating a Next.js project. Next.js+1
Choose these answers:

Why these choices?

TypeScript: catches many mistakes before running the application.

ESLint: detects suspicious or poor-quality code.

React Compiler — No: avoids introducing something unnecessary for this lab.

Tailwind — No: ordinary CSS is sufficient and keeps the dependency list smaller.

src directory — Yes: keeps application code organised.

App Router — Yes: this is the recommended current Next.js routing system.

Import alias — No: the default @/* alias is sufficient.

The current recommended Next.js setup uses TypeScript, ESLint, Tailwind, App Router and Turbopack, but the setup tool permits each choice to be customised. Next.js+1
Wait until you see a success message. A new folder called todo-app should have been created.

4. Enter the project and run it

You should see something similar to:

Open the displayed address in your browser:

The default Next.js page should appear. npm run dev starts the development server, and changes are displayed after you save your files. Next.js
Leave this terminal running while developing.
To stop the server later, press:

5. Open the project in VS Code
Open a second PowerShell window in the project folder and run:

If code is not recognised:

Open Visual Studio Code.

Select File → Open Folder.

Open:

6. Understand the important files
Your project should contain something similar to:

The important parts are:
src/app/page.tsx
This is the page shown at:

src/app/layout.tsx
This wraps all pages. It normally contains the HTML structure and site-wide metadata.
src/app/globals.css
This contains styles that apply across the application.
package.json
This records:

Installed packages

Project scripts

Project metadata

package-lock.json
This records the exact dependency versions installed by npm. Commit it to Git.
Next.js uses file-system routing, meaning files and folders inside the app directory determine the application’s routes. Next.js+1

7. Replace the default home page
Open:

Delete its contents and replace them with:

Save the file.
The browser should automatically update and display:

This confirms that:

Node.js works

Next.js works

TypeScript works

The development server works

You know which file controls the home page

8. Check that the project builds correctly
Stop the development server with:

Then run:

Both commands should finish without errors.

npm run lint checks the code using ESLint.

npm run build creates a production build.

After building, npm run start can run the production server. Next.js+1

Restart development mode afterward:

9. Make the first Git commit
Check whether Git was initialised:

If it says that this is not a Git repository, run:

Then make your first commit:

That is a strong commit message because it explains exactly what changed.
Your lab’s full-mark rubric requires at least six coherent commits, informative messages and work visibly spread over more than one session. 
A sensible future commit sequence would be:

Set up Next.js project with TypeScript and App Router

Add SQLite task schema and database initialization

Implement task creation and active task list

Add task editing, status changes and sorting

Implement archiving and overdue indication

Add deterministic database tests

Document installation, database design and dependencies

Do not create artificial empty commits. Each commit should leave the project working.

10. Connect it to GitHub
Create a new empty GitHub repository called something like:

Do not ask GitHub to create a README or .gitignore, because your local project already contains those files.
GitHub will give you a repository address. Then run:

Replace YOUR_REPOSITORY_ADDRESS with the address GitHub provides.
Verify it with:

Important lab notes
Your final application must retain data after a restart, so task information will later be stored in SQLite rather than an array or JSON file. Archived tasks must remain in the database, and “overdue” should be calculated from the due date and status rather than stored as a fourth status. Your tests must use a disposable test database, with at least one test covering archiving or the overdue rule. 
Also save this conversation as part of your AI transcript. The rubric expects task-level AI usage with stated constraints, and full marks require at least one genuine example where you notice an unsuitable or incorrect suggestion and redirect the AI.

```text
node -v
npm -v
git --version
```

```text
node -v
npm -v
git --version
```

```v24.18.1
11.16.0
git version 2.x.x
```

```v24.18.1
11.16.0
git version 2.x.x
```

```text
cd $HOME\Documents
mkdir COMS3011A
cd COMS3011A
```

```text
cd $HOME\Documents
mkdir COMS3011A
cd COMS3011A
```

```text
npx create-next-app@latest todo-app
```

```text
npx create-next-app@latest todo-app
```

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

```text
cd todo-app
npm run dev
```

```text
cd todo-app
npm run dev
```

```text
Local: http://localhost:3000
```

```text
Local: http://localhost:3000
```

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

```text
export default function Home() {
  return (
    <main>
      <h1>Todo Application</h1>
      <p>COMS3011A Lab 1</p>
    </main>
  );
}
```

```text
export default function Home() {
  return (
    <main>
      <h1>Todo Application</h1>
      <p>COMS3011A Lab 1</p>
    </main>
  );
}
```

```text
Todo Application
COMS3011A Lab 1
```

```text
Todo Application
COMS3011A Lab 1
```

```text
npm run lint
npm run build
```

```text
npm run lint
npm run build
```

```text
git add .
git commit -m "Set up Next.js project with TypeScript and App Router"
```

```text
git add .
git commit -m "Set up Next.js project with TypeScript and App Router"
```

```text
git branch -M main
git remote add origin YOUR_REPOSITORY_ADDRESS
git push -u origin main
```

```text
git branch -M main
git remote add origin YOUR_REPOSITORY_ADDRESS
git push -u origin main
```

---

### Turn 3 — 🤖 Assistant

Then run it in production mode.
First stop the current development server with:

Then create the production build:

Once that finishes successfully, start the production server:

Open:

This is not development mode:

npm run build creates an optimized production build.

npm run start runs that production build using the Next.js Node.js server. Next.js+1

Whenever you change your code, stop the server and build again:

Run npm run build now and paste what it outputs.

```text
npm run build
npm run start
```

```text
npm run build
npm run start
```

---

### Turn 4 — 👤 You

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

---

### Turn 5 — 🤖 Assistant

Perfect — the production build completed successfully.
Next step: start the production server
Run:

You should see something like:

Open:

This is now running in production mode, not development mode. Leave the terminal open while using the application.
Tell me what appears after running npm run start.

```text
Local: http://localhost:3000
```

```text
Local: http://localhost:3000
```

---

### Turn 6 — 👤 You

the site launches, so its working as expected

---

### Turn 7 — 🤖 Assistant

Perfect — your Next.js application is now running correctly in production mode.
The workflow is:

npm run build creates the optimized production version.

npm run start launches that built version at http://localhost:3000.

To stop it:

After changing any code, rebuild before starting again:

Your Next.js project setup is complete.

```text
npm run build
npm run start
```

```text
npm run build
npm run start
```

```text
npm run build
npm run start
```

```text
npm run build
npm run start
```

---

*Exported with [ContextSwitchAI](https://github.com)*
