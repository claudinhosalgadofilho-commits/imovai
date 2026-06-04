"use client";

import { useState } from "react";
import { Lock, Mail, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function criarConta() {
    if (!nome || !email || !senha) {
      alert("Preencha nome, email e senha.");
      return;
    }

    setCarregando(true);

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome },
      },
    });

    setCarregando(false);

    if (error) {
      alert("Erro: " + error.message);
      return;
    }

    alert("Conta criada! Verifique seu e-mail para confirmar.");
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-white rounded-[35px] shadow-2xl p-10">
        <h1 className="text-5xl font-black">Criar conta</h1>

        <p className="mt-3 text-zinc-500">
          Cadastre-se para salvar imóveis e receber alertas.
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <label className="font-bold">Nome</label>
            <div className="mt-2 flex items-center gap-3 bg-zinc-100 rounded-2xl px-4">
              <User className="text-zinc-500" />
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="bg-transparent w-full py-4 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold">Email</label>
            <div className="mt-2 flex items-center gap-3 bg-zinc-100 rounded-2xl px-4">
              <Mail className="text-zinc-500" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Seu email"
                className="bg-transparent w-full py-4 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold">Senha</label>
            <div className="mt-2 flex items-center gap-3 bg-zinc-100 rounded-2xl px-4">
              <Lock className="text-zinc-500" />
              <input
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                type="password"
                placeholder="Crie uma senha"
                className="bg-transparent w-full py-4 outline-none"
              />
            </div>
          </div>
        </div>

        <button
          onClick={criarConta}
          disabled={carregando}
          className="mt-8 w-full bg-lime-500 text-black py-4 rounded-2xl font-black text-lg"
        >
          {carregando ? "Criando conta..." : "Criar minha conta"}
        </button>

        <a href="/login" className="mt-6 block text-center font-bold text-zinc-600">
          Já tenho conta
        </a>
      </div>
    </main>
  );
}