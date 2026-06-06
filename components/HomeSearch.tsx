"use client";

import { useState } from "react";
import { Search, Settings2 } from "lucide-react";
import FiltrosDrawer from "./FiltrosDrawer";

export default function HomeSearch() {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  return (
    <>
      <FiltrosDrawer
        aberto={mostrarFiltros}
        fechar={() => setMostrarFiltros(false)}
      />

      <div className="relative z-20 -mt-8 bg-white rounded-3xl shadow-2xl p-6">

        <div className="grid md:grid-cols-3 gap-4">

          <select className="border border-zinc-200 rounded-xl px-4 py-4">
            <option>Adicionar estado</option>
          </select>

          <select className="border border-zinc-200 rounded-xl px-4 py-4">
            <option>Adicionar cidade</option>
          </select>

          <select className="border border-zinc-200 rounded-xl px-4 py-4">
            <option>Tipo</option>
            <option>Casa</option>
            <option>Apartamento</option>
            <option>Terreno</option>
            <option>Comercial</option>
          </select>

        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-4">

          <select className="border border-zinc-200 rounded-xl px-4 py-4">
            <option>Modalidade</option>
            <option>Venda Direta</option>
            <option>Licitação Aberta</option>
            <option>Leilão</option>
          </select>

          <select className="border border-zinc-200 rounded-xl px-4 py-4">
            <option>Preço</option>
            <option>Até R$ 100 mil</option>
            <option>Até R$ 200 mil</option>
            <option>Até R$ 500 mil</option>
            <option>Até R$ 1 milhão</option>
          </select>

          <button
            onClick={() => setMostrarFiltros(true)}
            className="border border-zinc-200 rounded-xl px-4 py-4 font-black flex items-center justify-center gap-2 hover:bg-zinc-50"
          >
            <Settings2 size={18} />
            Mais filtros
          </button>

        </div>

        <button
          className="mt-5 w-full bg-orange-500 hover:bg-orange-600 transition text-white rounded-xl py-4 font-black flex items-center justify-center gap-2"
        >
          <Search size={18} />
          Buscar Imóveis
        </button>

      </div>
    </>
  );
}