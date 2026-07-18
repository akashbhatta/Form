-- ============================================================
-- Mental Health Literacy Scale (MHLS) Research Form
-- Supabase table schema + Row Level Security (RLS) policies
-- ============================================================
-- Run this whole file once in: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- 1. Main table that stores every submitted response
create table if not exists public.responses (
  -- System fields
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),   -- date + time of submission (auto-set by DB, cannot be faked by the browser)

  -- Consent
  consent_given boolean not null,                    -- must be true, enforced below

  -- Socio-demographic fields (matches the study's sociodemographic questionnaire)
  age integer,
  gender text,                             -- Male / Female / Other / Prefer not to say
  gender_other_specify text,               -- free text, only filled if gender = 'Other'
  academic_degree text,                    -- Bachelor / Masters / Higher and above
  teaching_experience text,                -- '<10 years' / '≥10 years'
  mh_seminar_participation text,           -- Yes / No — previous participation in a mental health seminar
  mh_illness_experience text,              -- No / Yes — experience dealing with someone with a mental illness
  mh_illness_experience_specify text,      -- free text, only filled if mh_illness_experience = 'Yes'

  -- Mental Health Literacy Scale (MHLS) answers
  -- Stored as one JSON object: {"mhls_q1": 3, "mhls_q2": 4, ...}
  -- Using JSON keeps this table flexible: you can change / add / remove
  -- MHLS items later without altering the table structure.
  mhls_responses jsonb not null,

  -- Optional: raw copy of everything the form submitted, useful for debugging
  raw_payload jsonb
);

-- 2. Guardrail: never allow a row where consent was not actually given
alter table public.responses
  add constraint consent_must_be_true check (consent_given = true);

-- 3. Turn on Row Level Security (RLS). Until a policy explicitly allows an
--    action, everything is denied by default -- this is what keeps
--    responses private.
alter table public.responses enable row level security;

-- 4. Allow anyone using the public "anon" key to INSERT a new response
--    (this is required so the public form can submit), but grant NO
--    permission to SELECT / UPDATE / DELETE. This means participants,
--    or anyone with the public anon key, can only ever add a row --
--    they can never read, change, or delete existing responses.
create policy "Allow public submissions"
  on public.responses
  for insert
  to anon
  with check (true);

-- No SELECT / UPDATE / DELETE policy is created for the anon role on
-- purpose. That means those actions are blocked for the public key,
-- which is exactly what "do not show participant responses publicly" requires.

-- 5. (Optional) index to make filtering/sorting by date fast once you have
--    many responses.
create index if not exists responses_submitted_at_idx
  on public.responses (submitted_at desc);

-- ============================================================
-- HOW THE RESEARCHER/ADMIN VIEWS DATA
-- ============================================================
-- You (the project owner) view and export data through the Supabase
-- Dashboard (Table Editor or SQL Editor), which authenticates you as the
-- project owner and is NOT subject to the anon-role RLS restriction above.
-- You never need a special "admin policy" for this -- see the
-- viewing/exporting instructions in the README.
-- ============================================================
