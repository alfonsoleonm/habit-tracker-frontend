# habit-tracker — frontend

Black minimalist habit tracker built with Angular 17+.

---

## Step 1 — Run locally

```bash
npm install
npm start
```

Opens at http://localhost:4200 with mock data.

---

## Step 2 — Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial habit tracker frontend"
```

Create a new empty repo on github.com (no README, no .gitignore), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/habit-tracker.git
git branch -M main
git push -u origin main
```

---

## Step 3 — Deploy to Vercel

```bash
npm i -g vercel
vercel
```

When prompted:
- Framework preset: Angular
- Build command: npm run build:prod
- Output directory: dist/habit-tracker-frontend/browser

Every future `git push main` triggers an automatic redeploy.

---

## Step 4 — Connect the backend (later)

Once your Lambda backend is deployed, paste the Function URL into:

```
src/environments/environment.prod.ts
```

```ts
export const environment = {
  production: true,
  apiUrl: 'https://YOUR_LAMBDA_URL.lambda-url.us-east-1.on.aws'
};
```

Then replace the TODO mock methods in `src/app/services/habits.ts` with real fetch calls.

---

## Project structure

```
src/app/
  pages/
    calendar/        ← main grid view (checkboxes by day)
    month-creator/   ← create a new month + add custom habits
    stats/           ← completion rates + streaks
  shared/
    navbar/
  services/
    habits.ts        ← data layer (swap mock for real API here)
    auth.ts          ← Cognito JWT stub
  environments/
    environment.ts       ← local dev
    environment.prod.ts  ← production (add Lambda URL here)
```
