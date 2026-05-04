import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { supabase } from './supabaseClient'; // Ścieżka musi być poprawna!
console.log("ccccccccccccccc");
createRoot(document.getElementById("root")!).render(<App />);
