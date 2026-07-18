# Mental Health Literacy Research Survey

A simple, mobile-friendly online form for collecting informed consent,
socio-demographic data, and Mental Health Literacy Scale (MHLS) responses,
built with plain HTML/CSS/JS, hosted on Vercel, and stored in Supabase.

---

## 1. Project structure

```
project/
├── index.html            Main page: consent → demographics → MHLS → thank you
├── style.css              All styling (mobile-responsive)
├── script.js              Form logic, validation, Supabase submission
├── mhls-questions.js      ⭐ EDIT THIS: the 35 MHLS question texts
├── config.js              Auto-generated at build time (do not hand-edit for prod)
├── build.js               Injects Vercel env vars into config.js at deploy time
├── vercel.json            Tells Vercel to run build.js before deploying
├── .env.example           Documents which environment variables are needed
├── .gitignore
├── sql/
│   └── schema.sql         ⭐ RUN THIS in Supabase SQL Editor once
└── README.md              This file
```

---

## 2. Content source

All consent text, the 6 sociodemographic questions, and all 35 MHLS items
are filled in directly from the uploaded tool ("Mental Health Literacy
among Secondary School Teachers of Dhulikhel Municipality", Aakriti
Bhatta, KU School of Medical Sciences). No placeholders remain in
`index.html` or `mhls-questions.js`.

A few notes on choices made while digitizing the PDF:

- **Consent** uses the exact "I agree" / "I disagree" choice from the
  paper form. Choosing "I disagree" ends the session immediately and
  nothing is recorded. The paper form's signature line is replaced by
  the digital consent choice itself; "Date of data collection" is
  captured automatically as `submitted_at` rather than asked as a
  question.
- **Age** is restricted to 18–80 as a sensible bound for a secondary
  school teacher population; change the `min`/`max` on the `age` input
  in `index.html` if you'd like a different range.
- **MHLS scales**: items 1–10, 13–15 use the 4-point "Very unlikely →
  Very Likely" scale; items 11–12 use "Very unhelpful → Very helpful";
  items 16–28 use the 5-point "Strongly Disagree → Strongly agree"
  scale; items 29–35 use the 5-point "Definitely Unwilling → Definitely
  willing" scale — exactly as printed in the source tool.
- **Reverse scoring**: responses are stored exactly as selected (raw
  1–4 or 1–5). The source document doesn't specify which items (if any)
  should be reverse-scored before summing — do that step in your
  analysis software (SPSS/R/Excel) using your study's scoring protocol,
  not at the point of collection.
- If you spot any wording you'd like adjusted (e.g. English vs. Nepali
  version, or additional demographic categories), edit directly in
  `mhls-questions.js` (for the 35 items) or `index.html` (for consent
  text and sociodemographic questions) — both are plain, well-commented
  files.

---

## 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com) (free tier is fine).
2. Go to **SQL Editor > New query**, paste the entire contents of
   `sql/schema.sql`, and run it. This creates the `responses` table with:
   - `id`, `submitted_at` (auto date/time), `consent_given`
   - Individual demographic columns
   - `mhls_responses` (a JSON object holding all 35 answers)
   - Row Level Security enabled, with a policy that allows the public
     `anon` key to **insert only** — it cannot read, edit, or delete
     any row. This is what keeps responses private.
3. Go to **Project Settings > API** and copy:
   - **Project URL** → this is `SUPABASE_URL`
   - **anon / public key** → this is `SUPABASE_ANON_KEY`

   Do **not** copy the `service_role` (secret) key anywhere in this
   project — it is never needed for the public form.

---

## 4. Environment variables (used by Vercel)

This project reads two environment variables at **build time** and writes
them into `config.js`, which the browser loads:

| Variable | Value |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon/public API key |

Set these in **Vercel > Project Settings > Environment Variables** (see
deployment steps below). `.env.example` documents the same two variables
for reference — it is not read automatically by Vercel; the actual values
must be entered in the Vercel dashboard (or via `vercel env add`).

> Why is it safe to put the anon key in frontend code? Because Row Level
> Security (set up in `sql/schema.sql`) restricts the anon key to
> insert-only access. Even though the key is publicly visible in the
> browser, it cannot be used to read or change existing responses.

---

## 5. Deploying to Vercel

**Option A — via GitHub (recommended)**
1. Push this project folder to a new GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import that repository.
3. When prompted for Environment Variables, add `SUPABASE_URL` and
   `SUPABASE_ANON_KEY` (from step 3 above).
4. Deploy. Vercel will automatically run `node build.js` (configured in
   `vercel.json`) before serving the site, which writes your Supabase
   credentials into `config.js` at build time.
5. Any time you push a change to GitHub, Vercel redeploys automatically.

**Option B — via Vercel CLI**
```bash
npm install -g vercel
cd project
vercel login
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel --prod
```

After deploying, open the live URL and test the full flow once yourself
(consent → background → questionnaire → submit) to confirm a row appears
in Supabase (see next section).

---

## 6. Viewing and exporting collected responses (for the researcher/admin)

You do **not** need any special code for this — use the Supabase dashboard,
which is authenticated as the project owner and bypasses the public RLS
restriction automatically:

1. Log in at [supabase.com](https://supabase.com) and open your project.
2. Go to **Table Editor > responses** to browse all submitted rows,
   including `submitted_at` and every demographic/MHLS field.
3. **To export as CSV/Excel:**
   - In Table Editor, click the **Export** button above the table
     (or use the "..." menu) → **Export table as CSV**.
   - Open the downloaded `.csv` file directly in Excel/Google Sheets.
4. **For custom exports** (e.g. flattening the `mhls_responses` JSON into
   separate columns), go to **SQL Editor** and run a query such as:
   ```sql
   select
     id,
     submitted_at,
     age,
     gender,
     education_level,
     occupation,
     marital_status,
     area_of_residence,
     monthly_income_range,
     mhls_responses ->> 'mhls_q1' as mhls_q1,
     mhls_responses ->> 'mhls_q2' as mhls_q2
     -- add one line per MHLS item you want as its own column
   from responses
   order by submitted_at desc;
   ```
   Then click **Export** on the query results to download that exact
   shape as CSV.

Participants themselves never have access to this data — the anon key
used by the public form has no read permission at all.

---

## 7. Admin-safe explanation of how data is stored

In plain terms, for anyone on your research team who isn't technical:

- Every time someone completes and submits the form, **one new row** is
  added to a table called `responses` in your Supabase project (a hosted
  Postgres database).
- Each row automatically gets a random ID and a `submitted_at` timestamp
  set by the database itself at the moment of submission — this can't be
  altered by the participant's browser.
- No name, email, or other directly identifying information is collected.
- The database is locked down with **Row Level Security**: the public
  website can only *add* new rows, never read, edit, or delete existing
  ones. Only people who log into the Supabase dashboard with your
  project's owner credentials (i.e. you / your research team) can view
  or export the data.
- You can view every response as a table, or export it to CSV to open in
  Excel/SPSS/R at any time, using the steps in section 6 above.

---

## 8. Local testing (optional)

You can open `index.html` directly, but browsers may restrict some
features when opening files directly (`file://`). It's more reliable to
serve it locally, e.g.:

```bash
npx serve project
```

Then temporarily fill in real values in `config.js` for local testing
only (don't commit them) — or run `SUPABASE_URL=... SUPABASE_ANON_KEY=... node build.js`
before serving, to generate `config.js` the same way Vercel does.
