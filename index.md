## Indexing, Similarity Search, and AI Review

### Why do we index the codebase?

The AI cannot automatically know the full repository.

When a pull request comes, GitHub gives us:

- PR title
- PR description
- PR diff

But the diff only shows changed lines. Sometimes the AI also needs surrounding project context, like existing helpers, types, APIs, folder patterns, or related files.

So when the repo is connected, we index the codebase first.

Flow:

1. User connects repo.
2. App fetches relevant code files from GitHub.
3. Each file content is converted into an embedding.
4. Embeddings are stored in Pinecone with metadata like `repoId`, `path`, and `content`.

### What is an embedding?

An embedding is a numeric representation of text.

Example:

```txt
"auth.ts has Better Auth config and GitHub OAuth"
```

becomes something like:

```txt
[0.12, -0.44, 0.88, ...]
```

Similar meaning texts produce similar vectors.

So code about auth will be closer to other auth-related code. Code about repository connection will be closer to repo/webhook-related code.

### What is similarity search?

Similarity search means:

> Given one query, find stored code chunks that are closest in meaning.

Example query:

```txt
Fix webhook handling for pull request review
```

Pinecone may return files like:

```txt
app/api/webhooks/github/route.ts
module/ai/actions/index.ts
inngest/functions/review.ts
module/github/lib/github.ts
```

because those files are semantically related to the query.

### How does AI get codebase context during PR review?

When GitHub sends a PR webhook, the Inngest review function runs.

It does this:

1. Fetch PR title, description, and diff from GitHub.
2. Build a query:

```ts
const query = `${title}\n${description}`;
```

3. Convert that query into an embedding.
4. Search Pinecone for similar code chunks from the same repo:

```ts
retrieveContext(query, `${owner}/${repo}`);
```

5. Pinecone returns relevant code content.
6. That context is added to the AI prompt with the PR diff.

So the AI receives:

```txt
PR title
PR description
Relevant codebase context from Pinecone
Actual PR diff
```

### Why not just send the PR diff?

PR diff only shows what changed.

It may not show:

- existing project patterns
- helper functions
- database schema
- auth setup
- related files
- expected architecture

RAG gives the AI extra context from the existing codebase.

### Simple interview answer

> I index the repo when it is connected because the AI does not know the whole codebase by default. I store embeddings of relevant code files in Pinecone. Later, when a PR arrives, I use the PR title and description as a query, retrieve semantically similar code chunks from Pinecone, and pass those chunks along with the PR diff to the AI. This helps the AI review the PR with project context instead of only looking at the changed lines.

### Full flow

```txt
Repo connected
  -> fetch repo files
  -> create embeddings
  -> store vectors in Pinecone

PR opened/updated
  -> GitHub webhook fires
  -> Inngest review job starts
  -> fetch PR diff/title/description
  -> retrieve similar code context from Pinecone
  -> send context + diff to AI
  -> post review comment on GitHub
  -> save review in DB
```


















Yes, you can deploy with Bun. You do not need npm.

Important: Vercel supports Bun if your repo has bun.lock / bun.lockb; it runs bun install. Bun runtime is also supported on Vercel but still beta, so for this project I’d
use Bun as package manager first, and only switch runtime to Bun later if everything works.

Deploy Steps

1. Push latest code to GitHub main.
2. Go to Vercel → New Project → Import GitHub repo.
3. Framework: Next.js.
4. Package manager:
   Vercel should auto-detect Bun from bun.lock.

   Do not commit package-lock.json, because that tells Vercel npm also exists. Keep only bun.lock.

5. Build command:

bunx prisma generate && bun run build

6. Install command can be default, or explicitly:

bun install

7. Add production env variables in Vercel:

DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_APP_BASE_URL=https://your-vercel-domain.vercel.app

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_GENERATIVE_AI_API_KEY=
PINECONE_DB_API_KEY=

INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

8. Database:
   Use hosted Postgres. Good options:
   - Neon
   - Supabase Postgres
   - Vercel Postgres / Marketplace DB

   After adding DATABASE_URL, run production migration once:

DATABASE_URL="your-production-db-url" bunx prisma migrate deploy

Use migrate deploy, not migrate dev, for production.

9. GitHub OAuth settings:
   In GitHub OAuth App, set callback URL:

https://your-vercel-domain.vercel.app/api/auth/callback/github

10. Inngest:
    In Inngest Cloud, add/sync your app endpoint:

https://your-vercel-domain.vercel.app/api/inngest

11. Webhooks:
    Locally you used ngrok. In production, no ngrok needed. Your app should create GitHub webhooks with:

https://your-vercel-domain.vercel.app/api/webhooks/github

So set:

NEXT_PUBLIC_APP_BASE_URL=https://your-vercel-domain.vercel.app

Then newly connected repos will get production webhook URL.

Should You Use Bun Runtime?

For now, I recommend this:

Use Bun package manager: yes
Use Bun runtime on Vercel: optional, later

Your app uses Next.js, Prisma, Better Auth, Inngest, Octokit. Node runtime is more battle-tested. Bun install/build is fine.

If you want Bun runtime too, add vercel.json:

{
"$schema": "https://openapi.vercel.sh/vercel.json",
"bunVersion": "1.x"
}

And update scripts:

{
"scripts": {
"dev": "bun run --bun next dev",
"build": "bun run --bun next build",
"start": "next start"
}
}

But I’d deploy first without this runtime change.

Sources: Vercel supports Bun lockfiles/package manager detection and Bun runtime config, Prisma recommends migrate deploy for production, Better Auth needs production
BETTER_AUTH_URL, and Inngest production needs the /api/inngest HTTP endpoint.
Vercel package managers: https://vercel.com/docs/package-managers
Vercel Bun runtime: https://vercel.com/docs/functions/runtimes/bun
Prisma migrate deploy: https://www.prisma.io/docs/cli/migrate
Better Auth options: https://better-auth.com/docs/reference/options
Inngest serving functions: https://www.inngest.com/docs/learn/serving-inngest-functions

─ Worked for 1m 02s ────────────────────────────────
