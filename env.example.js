// Project Name: Thronestead©
// File Name: env.example.js
// Version 6.13.2025.19.49
// Developer: Deathsgift66

/**
 * This file is an example template.
 * Copy it to `env.js` and insert your actual Supabase project credentials.
 * DO NOT commit real `env.js` to version control (it should be in .gitignore).
 */

// Example values used by the frontend during local development.
// Copy this file to `env.js` and replace with your real credentials.

export const SUPABASE_URL = 'https://zzqoxgytfrbptojcwrjm.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6cW94Z3l0ZnJicHRvamN3cmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1Nzk3MzYsImV4cCI6MjA2NTE1NTczNn0.mbFcI9V0ajn51SM68De5ox36VxbPEXK2WK978HZgUaE';

// Optional: Override API base URL for local development
export const API_BASE_URL = 'https://api.thronestead.com';


// Support the previous window.ENV style for backward compatibility
window.ENV = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  API_BASE_URL,
};

// Legacy global for scripts expecting window.API_BASE_URL
window.API_BASE_URL = API_BASE_URL;
