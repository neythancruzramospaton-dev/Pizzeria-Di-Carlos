// js/supabase-client.js
const SUPABASE_URL = "https://ffnzuqdhxvxtwaykydfj.supabase.co";
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmbnp1cWRoeHZ4dHdheWt5ZGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNTU4MDUsImV4cCI6MjA5MjYzMTgwNX0.eCmIRYWDqe5OCtxdGYwiRv-JjgL0WgXHB4PxWGnYINo";

window.db = null;

if (window.supabase?.createClient) {
  window.db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
}
