"use client";

import { useEffect, useState, use } from "react";
import { ArrowLeft, ExternalLink, MessageCircle, Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";
type Imovel = {
  numero: string;
  uf: string;
  cidade: string;
  bairro: string;
  endereco: string;
  preco: string;
  avaliacao: string;
  desconto: string;
  financiamento: string;
  descricao: string;
  modalidade: string;
  link: string;
};

function parseCSVLine(line: string) {
  return line.split(";").map((item) => item.trim());
}

export default function ImovelPage({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = use(params);
  const [imovel, setImovel] = useState<Imovel | null>(null);

  useEffect(() => {
    async function carregarCSV() {
      const response = await fetch("/Lista_imoveis_geral.csv");
      const buffer = await response.arrayBuffer();
      const texto = new TextDecoder("iso-8859-1").decode(buffer);

      const linhas = texto
        .split("\n")
        .map((linha) => linha.trim())
        .filter(Boolean);

      const dados = linhas
        .filter((linha) => /^\d/.test(linha.trim()))
        .map((linha) => {
          const colunas = parseCSVLine(linha);

          return {
            numero: colunas[0]?.trim() || "",
            uf: colunas[1]?.trim() || "",
            cidade: colunas[2]?.trim() || "",
            bairro: colunas[3]?.trim() || "",
            endereco: colunas[4]?.trim() || "",
            preco: colunas[5]?.trim() || "",
            avaliacao: colunas[6]?.trim() || "",
            desconto: colunas[7]?.trim() || "",
            financiamento: colunas[8]?.trim() || "",
            descricao: colunas[9]?.trim() || "",
            modalidade: colunas[10]?.trim() || "",
            link: colunas[11]?.trim() || "",
          };
        });

      const encontrado = dados.find(
        (item) => item.numero.trim() === numero.trim()
      );

      setImovel(encontrado || null);
    }

    carregarCSV();
  }, [numero]);

async function salvarFavorito() {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    alert("Faça login para salvar favoritos.");
    window.location.href = "/login";
    return;
  }

  const { error } = await supabase.from("favoritos").insert({
    user_id: data.user.id,
    numero_imovel: imovel?.numero,
    cidade: imovel?.cidade,
    uf: imovel?.uf,
    bairro: imovel?.bairro,
    endereco: imovel?.endereco,
    preco: imovel?.preco,
    avaliacao: imovel?.avaliacao,
    desconto: imovel?.desconto,
    link: imovel?.link,
  });

  if (error) {
    alert("Erro ao salvar favorito: " + error.message);
    return;
  }

  alert("Imóvel salvo nos favoritos!");
}

  if (!imovel) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold">Imóvel não encontrado.</p>
          <a href="/buscar" className="mt-4 inline-block bg-black text-white px-6 py-3 rounded-xl">
            Voltar para busca
          </a>
        </div>
      </main>
    );
  }

  const whatsapp = `https://wa.me/5569999424835?text=Tenho interesse no imóvel ${imovel.numero} em ${imovel.cidade}`;

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#07111f]">
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-4xl font-black">
            imov<span className="text-lime-500">AI</span>
          </h1>

          <a href="/buscar" className="flex items-center gap-2 font-bold">
            <ArrowLeft size={18} />
            Voltar
          </a>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
        <div className="h-[520px] rounded-[35px] bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center shadow-xl">
          <span className="text-zinc-500 font-bold">
            Imagem real será adicionada na próxima etapa
          </span>
        </div>

        <div className="bg-white rounded-[35px] shadow-xl p-8">
          <span className="bg-lime-500 text-black px-4 py-2 rounded-full text-sm font-black">
            {imovel.desconto}% OFF
          </span>

          <h2 className="mt-6 text-4xl font-black">
            Imóvel em {imovel.cidade}
          </h2>

          <p className="mt-2 text-zinc-500">
            Código Caixa: {imovel.numero}
          </p>

          <p className="mt-6 text-zinc-600">
            {imovel.endereco}
          </p>

          <p className="text-zinc-500">
            {imovel.bairro} - {imovel.cidade}/{imovel.uf}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-5">
            <div className="bg-zinc-100 rounded-2xl p-5">
              <p className="text-sm text-zinc-500">Valor de avaliação</p>
              <p className="mt-1 text-xl font-black line-through text-zinc-500">
                R$ {imovel.avaliacao}
              </p>
            </div>

            <div className="bg-lime-100 rounded-2xl p-5">
              <p className="text-sm text-lime-700">Valor de venda</p>
              <p className="mt-1 text-2xl font-black text-lime-700">
                R$ {imovel.preco}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-zinc-100 rounded-2xl p-5">
            <p className="font-black">Descrição</p>
            <p className="mt-2 text-zinc-600">{imovel.descricao}</p>
          </div>
          <div className="mt-6 bg-[#07111f] text-white rounded-3xl p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-lime-400 font-black">
        Análise imovAI
      </p>

      <h3 className="text-2xl font-black mt-1">
        Score de oportunidade
      </h3>
    </div>

    <div className="w-24 h-24 rounded-full bg-lime-500 text-black flex flex-col items-center justify-center">
      <p className="text-3xl font-black">
        8.7
      </p>
      <p className="text-xs font-bold">
        /10
      </p>
    </div>
  </div>

  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-white/10 rounded-2xl p-4">
      <p className="text-zinc-400 text-sm">
        Potencial
      </p>
      <p className="font-black text-lime-400">
        Alto
      </p>
    </div>

    <div className="bg-white/10 rounded-2xl p-4">
      <p className="text-zinc-400 text-sm">
        Risco
      </p>
      <p className="font-black text-yellow-400">
        Moderado
      </p>
    </div>

    <div className="bg-white/10 rounded-2xl p-4">
      <p className="text-zinc-400 text-sm">
        Liquidez
      </p>
      <p className="font-black text-lime-400">
        Boa
      </p>
    </div>
  </div>

  <p className="mt-5 text-zinc-300 text-sm">
    A IA identificou este imóvel como uma possível oportunidade com base no desconto, valor de venda, localização e modalidade de compra.
  </p>
</div>

<button
  onClick={salvarFavorito}
  className="mt-6 w-full flex items-center justify-center gap-2 border border-zinc-300 py-4 rounded-2xl font-black hover:bg-zinc-100 transition"
>
  <Heart size={20} />
  Salvar favorito
</button>
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <a
              href={imovel.link}
              target="_blank"
              className="flex items-center justify-center gap-2 bg-black text-white py-4 rounded-2xl font-black"
            >
              Ver na Caixa
              <ExternalLink size={18} />
            </a>

            <a
              href={whatsapp}
              target="_blank"
              className="flex items-center justify-center gap-2 bg-lime-500 text-black py-4 rounded-2xl font-black"
            >
              Quero assessoria
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}