"use client";

import { MapPinned, Search, Building2 } from "lucide-react";

const pontos = [
  {
    cidade: "Rio Branco - AC",
    imoveis: 18,
    desconto: "39%",
  },
  {
    cidade: "Cruzeiro do Sul - AC",
    imoveis: 7,
    desconto: "57%",
  },
  {
    cidade: "São Sebastião - SP",
    imoveis: 12,
    desconto: "45%",
  },
];

export default function Mapa() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#07111f]">
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-4xl font-black">
            imov<span className="text-lime-500">AI</span>
          </h1>

          <a href="/buscar" className="bg-black text-white px-6 py-3 rounded-xl font-bold">
            Buscar imóveis
          </a>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-5xl font-black">
          Mapa Inteligente
        </h2>

        <p className="mt-3 text-zinc-500">
          Visualize regiões com maior concentração de oportunidades.
        </p>

        <div className="mt-8 bg-white rounded-[28px] shadow-xl p-5 flex items-center gap-3">
          <Search className="text-zinc-500" />
          <input
            placeholder="Buscar cidade, bairro ou estado"
            className="w-full outline-none text-lg"
          />
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-[#07111f] rounded-[35px] h-[620px] relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#84cc16,transparent_35%)] opacity-20" />

            <div className="absolute top-20 left-24 bg-lime-500 text-black px-4 py-3 rounded-full font-black shadow-xl">
              Rio Branco
            </div>

            <div className="absolute top-60 right-28 bg-lime-500 text-black px-4 py-3 rounded-full font-black shadow-xl">
              Cruzeiro do Sul
            </div>

            <div className="absolute bottom-28 left-1/2 bg-lime-500 text-black px-4 py-3 rounded-full font-black shadow-xl">
              São Sebastião
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <MapPinned size={80} className="mx-auto text-lime-400" />
                <h3 className="mt-5 text-4xl font-black">
                  Mapa em desenvolvimento
                </h3>
                <p className="mt-3 text-zinc-400">
                  Depois vamos integrar Google Maps ou Mapbox.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {pontos.map((ponto, index) => (
              <div
                key={index}
                className="bg-white rounded-[25px] shadow-lg p-6 border border-zinc-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center">
                    <Building2 className="text-lime-600" />
                  </div>

                  <div>
                    <h3 className="font-black text-xl">
                      {ponto.cidade}
                    </h3>
                    <p className="text-zinc-500 text-sm">
                      Região monitorada
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="bg-zinc-100 rounded-2xl p-4">
                    <p className="text-zinc-500 text-sm">Imóveis</p>
                    <p className="text-2xl font-black">{ponto.imoveis}</p>
                  </div>

                  <div className="bg-lime-100 rounded-2xl p-4">
                    <p className="text-lime-700 text-sm">Desconto médio</p>
                    <p className="text-2xl font-black text-lime-700">
                      {ponto.desconto}
                    </p>
                  </div>
                </div>

                <a
                  href="/buscar"
                  className="mt-5 block text-center bg-black text-white py-3 rounded-xl font-bold"
                >
                  Ver imóveis
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}