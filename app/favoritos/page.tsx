"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Favorito = {
  id: string;
  numero_imovel: string;
  cidade: string;
  uf: string;
  bairro: string;
  endereco: string;
  preco: string;
  avaliacao: string;
  desconto: string;
  link: string;
};

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  async function carregarFavoritos() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("favoritos")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      alert("Erro ao carregar favoritos: " + error.message);
      setCarregando(false);
      return;
    }

    setFavoritos(data || []);
    setCarregando(false);
  }

  async function removerFavorito(id: string) {
    const { error } = await supabase
      .from("favoritos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao remover: " + error.message);
      return;
    }

    carregarFavoritos();
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
        <p className="text-2xl font-black">Carregando favoritos...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#07111f]">
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-4xl font-black">
            imov<span className="text-lime-500">AI</span>
          </h1>

          <a href="/buscar" className="font-bold">
            Buscar imóveis
          </a>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-5xl font-black">Meus Favoritos</h2>

        <p className="mt-3 text-zinc-500">
          Imóveis salvos na sua conta.
        </p>

        {favoritos.length === 0 ? (
          <div className="mt-10 bg-white rounded-[30px] shadow-xl p-10 text-center">
            <p className="text-2xl font-black">
              Nenhum imóvel favorito ainda.
            </p>

            <a
              href="/buscar"
              className="mt-6 inline-block bg-lime-500 text-black px-8 py-4 rounded-2xl font-black"
            >
              Buscar oportunidades
            </a>
          </div>
        ) : (
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {favoritos.map((imovel) => (
              <div
                key={imovel.id}
                className="bg-white rounded-[25px] shadow-lg p-6"
              >
                <span className="bg-lime-500 text-black px-3 py-1 rounded-full text-xs font-black">
                  {imovel.desconto}% OFF
                </span>

                <h3 className="mt-4 text-2xl font-black">
                  Imóvel em {imovel.cidade}
                </h3>

                <p className="text-zinc-500">
                  {imovel.bairro} - {imovel.uf}
                </p>

                <p className="mt-4 text-sm text-zinc-500">
                  {imovel.endereco}
                </p>

                <p className="mt-4 text-sm text-zinc-400">
                  Valor de venda
                </p>

                <p className="text-3xl font-black text-lime-600">
                  R$ {imovel.preco}
                </p>

                <a
                  href={`/imovel/${imovel.numero_imovel}`}
                  className="mt-5 block text-center bg-black text-white py-3 rounded-xl font-bold"
                >
                  Ver detalhes
                </a>

                <button
                  onClick={() => removerFavorito(imovel.id)}
                  className="mt-3 w-full border border-zinc-300 py-3 rounded-xl font-bold"
                >
                  Remover favorito
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}