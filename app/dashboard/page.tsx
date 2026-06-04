"use client";

import { useEffect, useState } from "react";
import { Building2, Heart, TrendingUp, Bell, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [usuario, setUsuario] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function verificarLogin() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      setUsuario(data.user);
      setCarregando(false);
    }

    verificarLogin();
  }, []);

  async function sair() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (carregando) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <p className="text-2xl font-black">Carregando dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#07111f]">
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black">
              imov<span className="text-lime-500">AI</span>
            </h1>

            <p className="text-zinc-500">
              Logado como: {usuario?.email}
            </p>
          </div>

          <button
            onClick={sair}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-5xl font-black">
          Painel Administrativo
        </h2>

        <p className="mt-3 text-zinc-500">
          Acompanhe oportunidades e métricas do sistema.
        </p>

        <div className="mt-10 grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-[30px] shadow-xl p-6">
            <div className="w-14 h-14 rounded-2xl bg-lime-100 flex items-center justify-center">
              <Building2 className="text-lime-600" />
            </div>

            <p className="mt-6 text-zinc-500">Imóveis cadastrados</p>
            <h3 className="mt-2 text-4xl font-black">12.847</h3>
          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-6">
            <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center">
              <Heart className="text-pink-500" />
            </div>

            <p className="mt-6 text-zinc-500">Favoritos salvos</p>
            <h3 className="mt-2 text-4xl font-black">248</h3>
          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <TrendingUp className="text-blue-600" />
            </div>

            <p className="mt-6 text-zinc-500">Oportunidades IA</p>
            <h3 className="mt-2 text-4xl font-black">1.274</h3>
          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-6">
            <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">
              <Bell className="text-yellow-500" />
            </div>

            <p className="mt-6 text-zinc-500">Novos hoje</p>
            <h3 className="mt-2 text-4xl font-black">247</h3>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-[30px] shadow-xl p-8">
          <h3 className="text-3xl font-black">
            Área privada do usuário
          </h3>

          <p className="mt-3 text-zinc-500">
            Aqui vamos colocar favoritos na nuvem, alertas personalizados, plano premium e histórico de imóveis vistos.
          </p>

          <div className="mt-6 flex gap-4">
            <a
              href="/buscar"
              className="bg-lime-500 text-black px-6 py-3 rounded-xl font-black"
            >
              Buscar imóveis
            </a>

            <a
              href="/favoritos"
              className="bg-black text-white px-6 py-3 rounded-xl font-black"
            >
              Ver favoritos
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}