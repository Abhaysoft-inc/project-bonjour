# Project Bonjour

The website of the **Programming and Tech Skills Club (PTSC)** at KNIT Sultanpur. It covers the
club's events, blog, projects and team, plus a dashboard where club members run all of it.

## What's in it

**Public site**
- Events, each with its own page and registration form (individual or team, with custom questions)
- A blog: anyone with an account can write, and posts go live once a reviewer approves them
- Member projects, the team page, and privacy and terms pages
- Sitemap, robots.txt, an RSS feed for the blog, and share images for posts

**Dashboard** (`/dashboard`, sign-in required)
- Create and edit events, and see registrations (with CSV export)
- Mark attendance at events
- Manage users, advisors and media, and see mail delivery logs
- Write posts and review other people's

## Tech stack

[Next.js 16](https://nextjs.org) (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
MongoDB with Mongoose · Cloudinary for images · hosted on Vercel

## Getting started

You need **Node.js 22.6 or newer** and a MongoDB database (a free Atlas cluster or a local
server both work).

```bash
git clone https://github.com/programming-club-knit/project-bonjour.git
cd project-bonjour
npm install
cp .env.example .env      # then fill in MONGODB_URI and AUTH_SECRET
npm run dev
```

Open <http://localhost:3000>.

To sign in to the dashboard you need an admin account. Sign up on the site, then promote that
account:

```bash
npm run create-admin -- --email you@example.com
```

To add a few sample blog posts so the blog isn't empty, run `npm run db:seed-blog`. To remove
them again, run `npm run db:seed-blog -- --remove`.

> **Tip:** don't run `npm run build` while `npm run dev` is running. Both use the `.next`
> folder, and the dev server will start reloading in a loop. Stop it first.

### Environment variables

Every variable is described in [`.env.example`](.env.example). The ones that matter most:

| Variable | Needed for |
| --- | --- |
| `MONGODB_URI` | Everything. The database connection string. |
| `AUTH_SECRET` | Sign-in cookies. At least 32 random characters. |
| `APP_URL` | Production. The site's public address, used in canonical links, the sitemap and the RSS feed. |
| `CLOUDINARY_*` | Image uploads. Optional: without them you can paste an image link instead. |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server |
| `npm run build` / `npm start` | Builds for production / serves the build |
| `npm run lint` | Runs ESLint |
| `npm run create-admin` | Creates an admin, or promotes an existing account to admin |
| `npm run db:seed-blog` | Adds (or with `--remove`, removes) the sample blog posts |
| `npm run db:backup` / `db:seed` / `db:verify` | Moves data from the old site (see below) |

## Project layout

```
src/
  app/          pages and API routes (app/api/…)
  components/   UI, split into site, dashboard, blog and auth parts
  lib/          shared code; lib/server/ only runs on the server
  models/       Mongoose schemas
scripts/        admin setup and data scripts, run with Node's built-in TypeScript support
docs/           design notes (e.g. how the blog review flow works)
```

## Deploying to Vercel

Add the variables from `.env.example` under **Project → Settings → Environment Variables**
(at least `MONGODB_URI`, `AUTH_SECRET` and `APP_URL`).

### First admin account

Vercel runs `npm run vercel-build`, which builds the site and then runs
`scripts/setup-admin.ts`. On **Production** deploys this creates the first admin from:

| Variable | When it's needed |
| --- | --- |
| `ADMIN_EMAIL` | Always, to turn this on. Leave it out and the step is skipped. |
| `ADMIN_PASSWORD` | When the account doesn't exist yet (at least 8 characters). |
| `ADMIN_MOBILE` | When the account doesn't exist yet (10 digits). |
| `ADMIN_FIRST_NAME`, `ADMIN_LAST_NAME`, `ADMIN_USERNAME` | Optional. |
| `ADMIN_RESET_PASSWORD=true` | Optional. Replaces the password of an existing account. |

This is safe to leave on for every deploy. It creates the account if it doesn't exist, makes an
existing account an approved admin, and leaves an existing admin alone (its password is **not**
reset). After the first deploy you can delete `ADMIN_PASSWORD` from Vercel.

If the settings are wrong or the database can't be reached, the build fails and lists what to
fix. Keep the Build Command empty or set to `npm run vercel-build`, or this step won't run.

To try it locally without changing anything, set the `ADMIN_*` variables in `.env` and run
`node --env-file=.env scripts/setup-admin.ts --force --dry-run`.

## Migrating data from the old site

`scripts/migrate-data.ts` backs up the original database (`ORIGINAL_DB_URI`) and copies it into
another one. It never writes to the original database. Seeding only **adds** documents that are
missing (matched by `_id`). It never replaces or deletes anything, and it logs what it inserted so
you can undo it. Without `--apply`, it's a dry run.

```bash
npm run db:backup                                    # snapshot ORIGINAL_DB_URI -> backups/
npm run db:seed                                      # dry run against MONGODB_URI
npm run db:seed -- --apply                           # write to MONGODB_URI

# production: snapshot it first, then dry run, then apply
npm run db:backup -- --source MONGODB_PROD_URI
npm run db:seed   -- --target MONGODB_PROD_URI
npm run db:seed   -- --target MONGODB_PROD_URI --apply

npm run db:verify -- --target MONGODB_PROD_URI       # compare the backup with a database
```

If an account already exists in the target under a different `_id` (same email or username), it
isn't added again. Its profile and event references are pointed at the existing account instead.
`backups/` is git-ignored because it holds personal data and password hashes. If Node can't
resolve an Atlas address, set `DNS_SERVERS=8.8.8.8,1.1.1.1`.
