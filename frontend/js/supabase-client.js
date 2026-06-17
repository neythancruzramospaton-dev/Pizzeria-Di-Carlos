// js/supabase-client.js
// Inicializar la conexión con el proyecto de la Pizzería Dí Carlos

const SUPABASE_URL = "https://ffnzuqdhxvxtwaykydfj.supabase.co";
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmbnp1cWRoeHZ4dHdheWt5ZGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNTU4MDUsImV4cCI6MjA5MjYzMTgwNX0.eCmIRYWDqe5OCtxdGYwiRv-JjgL0WgXHB4PxWGnYINo";
var db = null;

if (window.supabase?.createClient) {
  db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
} else {
  console.error("No se cargó la librería CDN de Supabase.");
}
