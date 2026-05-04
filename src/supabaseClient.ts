import { createClient } from '@supabase/supabase-js';
// Jeśli używasz TypeScripta i masz wygenerowane typy:
// import { Database } from './types/supabase'; 

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Dodaj to sprawdzenie, żeby od razu widzieć w konsoli, czy zmienne działają
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("BŁĄD: Brak zmiennych środowiskowych Supabase!");
}
console.log("TEST ENV:", import.meta.env.VITE_SUPABASE_URL);
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
    }
});
