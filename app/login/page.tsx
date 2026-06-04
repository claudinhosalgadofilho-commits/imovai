"use client";

import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function entrar() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Login realizado com sucesso!");
    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-4xl font-black">Entrar</h1>

        <div className="mt-6">
          <label>Email</label>
          <div className="flex items-center gap-3 bg-zinc-100 rounded-xl px-4 mt-2">
            <Mail />
            <input
              className="w-full py-4 bg-transparent outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <label>Senha</label>
          <div className="flex items-center gap-3 bg-zinc-100 rounded-xl px-4 mt-2">
            <Lock />
            <input
              type="password"
              className="w-full py-4 bg-transparent outline-none"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={entrar}
          className="mt-6 w-full bg-lime-500 py-4 rounded-xl font-black"
        >
          Entrar
        </button>
      </div>
    </main>
  );
}