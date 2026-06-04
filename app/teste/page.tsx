"use client";

import { supabase } from "@/lib/supabase";

export default function Teste() {
  async function testar() {
    console.log("Supabase conectado:", supabase);
    alert("Conexão carregada. Verifique o console.");
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <button
        onClick={testar}
        className="bg-lime-500 px-8 py-4 rounded-xl font-bold"
      >
        Testar Supabase
      </button>
    </main>
  );
}