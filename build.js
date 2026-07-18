/*
  Build step for Vercel.
  Reads SUPABASE_URL and SUPABASE_ANON_KEY from environment variables
  (set in Vercel Project Settings > Environment Variables) and writes
  them into config.js, which the static site loads in the browser.

  This keeps the actual values out of your git repository while still
  letting the static frontend read them (the anon key is safe to expose
  publicly — see README for why).
*/
const fs = require("fs");
const path = require("path");

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "[build.js] WARNING: SUPABASE_URL or SUPABASE_ANON_KEY is not set. " +
    "The deployed form will not be able to connect to Supabase until " +
    "these are set in Vercel > Project Settings > Environment Variables."
  );
}

const configContent = `// AUTO-GENERATED at build time by build.js — do not edit directly.
window.SUPABASE_URL = ${JSON.stringify(SUPABASE_URL)};
window.SUPABASE_ANON_KEY = ${JSON.stringify(SUPABASE_ANON_KEY)};
`;

fs.writeFileSync(path.join(__dirname, "config.js"), configContent);
console.log("[build.js] config.js written with values from environment variables.");
