"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  BrainCircuit,
  Heart,
  Home,
  Mail,
  MapPinned,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

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
  imagem?: string;
};

function limparNumero(valor: string) {
  return (
    Number(
      String(valor || "")
        .replace("R$", "")
        .replace(/\./g, "")
        .replace(",", ".")
        .replace("%", "")
        .trim()
    ) || 0
  );
}

function detectarTipo(descricao: string) {
  const texto = String(descricao || "").toLowerCase();

  if (texto.includes("apartamento")) return "Apartamento";
  if (texto.includes("casa")) return "Casa";
  if (texto.includes("terreno")) return "Terreno";
  if (texto.includes("gleba")) return "Gleba";
  if (texto.includes("comercial") || texto.includes("loja")) return "Comercial";

  return "Imóvel";
}

export default function HomePage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("");
  const [valorMaximo, setValorMaximo] = useState("");

  useEffect(() => {
    async function carregarImoveis() {
      try {
        const response = await fetch("/imoveis.json");
        const dados = await response.json();
        setImoveis(Array.isArray(dados) ? dados : []);
      } catch {
        setImoveis([]);
      }
    }

    carregarImoveis();
  }, []);

  const oportunidades = useMemo(() => {
    return [...imoveis]
      .filter((item) => item.imagem)
      .sort((a, b) => limparNumero(b.desconto) - limparNumero(a.desconto))
      .slice(0, 4);
  }, [imoveis]);

  const destaque = oportunidades[0];

  function irParaBusca() {
    const params = new URLSearchParams();

    if (busca.trim()) params.set("busca", busca.trim());
    if (tipo) params.set("tipo", tipo);
    if (valorMaximo) params.set("valor", valorMaximo);

    const query = params.toString();

    window.location.href = query ? `/buscar?${query}` : "/buscar";
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#07111f]">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="block">
            <h1 className="text-4xl font-black leading-none">
              imov<span className="text-lime-500">AI</span>
            </h1>
            <p className="text-[10px] font-black tracking-widest text-zinc-500">
              INTELIGÊNCIA EM LEILÕES
            </p>
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-black">
            <a className="text-lime-500 border-b-2 border-lime-500 pb-2" href="/">
              Início
            </a>
            <a href="/buscar">Buscar Imóveis</a>
            <a href="/mapa">Mapa</a>
            <a href="/favoritos">Favoritos</a>
            <a href="/dashboard">Dashboard</a>
          </nav>

          <a
            href="/login"
            className="bg-lime-500 text-black px-6 py-3 rounded-xl font-black shadow-lg shadow-lime-500/20 hover:bg-lime-400 transition"
          >
            Entrar
          </a>
        </div>
      </header>

      <section className="relative max-w-7xl mx-auto px-6 pt-12">
        <div className="relative rounded-[35px] overflow-hidden min-h-[560px] bg-white">
          <img
            src={
              destaque?.imagem ||
              "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1800&auto=format&fit=crop"
            }
            className="absolute right-0 top-0 h-full w-[63%] object-cover"
            alt="Imóvel em destaque"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/5" />

          <div className="relative z-10 max-w-3xl py-14">
            <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 shadow-sm px-4 py-2 rounded-full text-xs font-black text-zinc-700">
              <BrainCircuit size={15} className="text-lime-500" />
              PLATAFORMA INTELIGENTE
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-7 text-5xl md:text-7xl font-black leading-[1.05]"
            >
              Encontre imóveis Caixa com{" "}
              <span className="text-lime-500">alto desconto</span>
              <br />
              de forma inteligente
            </motion.h2>

            <p className="mt-7 text-zinc-500 text-lg max-w-xl">
              Pesquise imóveis da Caixa por cidade, bairro, tipo e valor. Salve favoritos, veja imagens reais e acesse os detalhes oficiais.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={irParaBusca}
                className="bg-lime-500 text-black px-8 py-4 rounded-2xl font-black hover:bg-lime-400 transition"
              >
                Buscar imóveis agora
              </button>

              <a
                href="/favoritos"
                className="bg-black text-white px-8 py-4 rounded-2xl font-black text-center hover:bg-zinc-800 transition"
              >
                Ver favoritos
              </a>
            </div>
          </div>

          {destaque && (
            <div className="hidden lg:block absolute right-24 top-36 bg-white rounded-3xl shadow-2xl p-7 w-[330px] z-20">
              <span className="bg-lime-100 text-lime-700 px-3 py-1 rounded-full text-xs font-black">
                MAIOR OPORTUNIDADE
              </span>

              <h3 className="mt-5 text-2xl font-black">
                {detectarTipo(destaque.descricao)} em {destaque.cidade}
              </h3>

              <p className="mt-5 text-sm text-zinc-500">Avaliação</p>
              <p className="line-through text-zinc-500">
                R$ {destaque.avaliacao}
              </p>

              <p className="mt-4 text-sm text-zinc-500">Valor de venda</p>
              <p className="text-4xl font-black text-lime-500">
                R$ {destaque.preco}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <p className="text-sm text-zinc-500">Desconto</p>
                <span className="bg-lime-100 text-lime-700 px-3 py-1 rounded-full font-black text-sm">
                  {destaque.desconto}% OFF
                </span>
              </div>

              <a
                href={`/imovel/${destaque.numero}`}
                className="mt-6 block text-center bg-[#07111f] text-white py-4 rounded-xl font-black"
              >
                Ver detalhes
              </a>
            </div>
          )}
        </div>

        <div className="relative z-20 -mt-8 bg-white rounded-2xl shadow-2xl p-5 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 flex items-center gap-3 px-4 border border-zinc-200 rounded-xl">
            <Search className="text-zinc-500" size={20} />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") irParaBusca();
              }}
              placeholder="Cidade, bairro, estado ou código"
              className="w-full py-4 outline-none"
            />
          </div>

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border border-zinc-200 rounded-xl px-4 py-4 outline-none bg-white"
          >
            <option value="">Todos os tipos</option>
            <option value="Casa">Casa</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Terreno">Terreno</option>
            <option value="Gleba">Gleba</option>
            <option value="Comercial">Comercial</option>
          </select>

          <select
            value={valorMaximo}
            onChange={(e) => setValorMaximo(e.target.value)}
            className="border border-zinc-200 rounded-xl px-4 py-4 outline-none bg-white"
          >
            <option value="">Qualquer valor</option>
            <option value="100000">Até R$ 100 mil</option>
            <option value="200000">Até R$ 200 mil</option>
            <option value="500000">Até R$ 500 mil</option>
            <option value="1000000">Até R$ 1 milhão</option>
          </select>

          <button
            onClick={irParaBusca}
            className="bg-lime-500 rounded-xl flex items-center justify-center font-black hover:bg-lime-400 transition"
          >
            Buscar imóveis →
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-black">Oportunidades em destaque</h3>

          <a
            href="/buscar"
            className="hidden md:block bg-white border border-zinc-200 px-5 py-3 rounded-xl font-black text-sm shadow-sm"
          >
            Ver todas oportunidades →
          </a>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {oportunidades.map((item) => (
            <motion.a
              href={`/imovel/${item.numero}`}
              whileHover={{ y: -8 }}
              key={item.numero}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-zinc-100"
            >
              <div className="relative">
                {item.imagem ? (
                  <img
                    src={item.imagem}
                    className="h-48 w-full object-cover"
                    alt={item.endereco}
                    loading="lazy"
                  />
                ) : (
                  <div className="h-48 bg-zinc-200 flex items-center justify-center">
                    <p className="font-bold text-zinc-500">Sem imagem</p>
                  </div>
                )}

                <span className="absolute top-4 left-4 bg-lime-500 text-black px-3 py-1 rounded-full text-xs font-black">
                  {item.desconto}% OFF
                </span>

                <Heart className="absolute top-4 right-4 text-white" />
              </div>

              <div className="p-5">
                <h4 className="font-black">
                  {detectarTipo(item.descricao)} em {item.cidade}
                </h4>

                <p className="text-sm text-zinc-500 mt-1">
                  {item.bairro} - {item.uf}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-zinc-400">Avaliação</p>
                    <p className="line-through text-zinc-500">
                      R$ {item.avaliacao}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-400">Venda</p>
                    <p className="font-black text-lime-600">
                      R$ {item.preco}
                    </p>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="grid md:grid-cols-5 gap-4">
          <a href="/buscar" className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-lime-100 rounded-2xl flex items-center justify-center">
              <Home className="text-lime-600" />
            </div>
            <div>
              <p className="text-2xl font-black">{imoveis.length}</p>
              <p className="text-sm text-zinc-500">Imóveis carregados</p>
            </div>
          </a>

          <a href="/buscar" className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-lime-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="text-lime-600" />
            </div>
            <div>
              <p className="text-2xl font-black">+ filtros</p>
              <p className="text-sm text-zinc-500">Busca organizada</p>
            </div>
          </a>

          <a href="/buscar" className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-lime-100 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="text-lime-600" />
            </div>
            <div>
              <p className="text-2xl font-black">Caixa</p>
              <p className="text-sm text-zinc-500">Links oficiais</p>
            </div>
          </a>

          <a href="/dashboard" className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-lime-100 rounded-2xl flex items-center justify-center">
              <Users className="text-lime-600" />
            </div>
            <div>
              <p className="text-2xl font-black">Área</p>
              <p className="text-sm text-zinc-500">do usuário</p>
            </div>
          </a>

          <a href="/favoritos" className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-lime-100 rounded-2xl flex items-center justify-center">
              <Bell className="text-lime-600" />
            </div>
            <div>
              <p className="text-2xl font-black">Favoritos</p>
              <p className="text-sm text-zinc-500">salvos</p>
            </div>
          </a>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-[#07111f] rounded-[30px] text-white grid md:grid-cols-3 gap-8 p-10 items-center">
          <div>
            <div className="w-16 h-16 rounded-full border border-lime-500 flex items-center justify-center font-black text-lime-400">
              IA
            </div>

            <p className="mt-4 text-sm font-black text-zinc-300">
              Análise Inteligente
            </p>

            <h3 className="mt-2 text-4xl font-black">
              Compare oportunidades com mais segurança.
            </h3>

            <p className="mt-4 text-zinc-400">
              Use filtros, imagens reais, preço de avaliação, valor de venda e links oficiais para tomar melhores decisões.
            </p>

            <a
              href="/buscar"
              className="mt-7 inline-block bg-lime-500 text-black px-6 py-4 rounded-xl font-black"
            >
              Começar busca
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              "Maior desconto",
              "Menor preço",
              "Financiamento",
              "Cidade e bairro",
            ].map((item) => (
              <a href="/buscar" key={item} className="bg-white/10 rounded-2xl p-5">
                <p className="font-black text-lime-400">{item}</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Filtrar imóveis
                </p>
              </a>
            ))}
          </div>

          <div className="flex justify-center">
            <div className="w-64 h-64 rounded-full bg-lime-500/10 border border-lime-500/30 flex items-center justify-center">
              <div className="w-40 h-40 bg-lime-500 rounded-full flex flex-col items-center justify-center text-black">
                <p className="text-6xl font-black">9.2</p>
                <p className="font-black">Score IA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#07111f] text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
          <div>
            <h2 className="text-4xl font-black">
              imov<span className="text-lime-500">AI</span>
            </h2>
            <p className="mt-5 text-zinc-400 text-sm">
              Portal inteligente para pesquisar imóveis Caixa com imagens reais, filtros e favoritos.
            </p>
          </div>

          <div>
            <h4 className="font-black mb-4">Navegação</h4>
            <a href="/" className="block text-zinc-400">Início</a>
            <a href="/buscar" className="block text-zinc-400">Buscar imóveis</a>
            <a href="/mapa" className="block text-zinc-400">Mapa</a>
          </div>

          <div>
            <h4 className="font-black mb-4">Conta</h4>
            <a href="/login" className="block text-zinc-400">Login</a>
            <a href="/cadastro" className="block text-zinc-400">Cadastro</a>
            <a href="/favoritos" className="block text-zinc-400">Favoritos</a>
          </div>

          <div>
            <h4 className="font-black mb-4">Contato</h4>
            <p className="text-zinc-400">contato@imovaicaixa.com.br</p>
            <p className="text-zinc-400">Brasil</p>
          </div>
        </div>
      </footer>
    </main>
  );
}