"use client";


import FiltrosDrawer from "@/components/FiltrosDrawer";

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
  const [estado, setEstado] = useState("");
const [cidade, setCidade] = useState("");
const [modalidade, setModalidade] = useState("");
const [mostrarFiltros, setMostrarFiltros] = useState(false);

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

  const destaque = useMemo(() => {
  if (oportunidades.length === 0) return null;
  const indice = Math.floor(Math.random() * oportunidades.length);
  return oportunidades[indice];
}, [oportunidades]);

  function irParaBusca() {
    const params = new URLSearchParams();

    if (busca.trim()) params.set("busca", busca.trim());
    if (tipo) params.set("tipo", tipo);
    if (valorMaximo) params.set("valor", valorMaximo);
    if (estado) params.set("uf", estado);
    if (cidade) params.set("cidade", cidade);
    if (modalidade) params.set("modalidade", modalidade);

    const query = params.toString();

    window.location.href = query ? `/buscar?${query}` : "/buscar";
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#07111f]">
      <FiltrosDrawer
  aberto={mostrarFiltros}
  fechar={() => setMostrarFiltros(false)}
/>
<header className="sticky top-0 z-50 bg-white shadow-sm">
  <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

    <a href="/" className="flex items-center gap-3">
      <div className="w-11 h-11 bg-lime-500 rounded-xl flex items-center justify-center font-black">
        AI
      </div>

      <div>
        <h1 className="text-3xl font-black leading-none">
          imov<span className="text-lime-500">AI</span>
        </h1>

        <p className="text-[10px] font-black tracking-widest text-zinc-500">
          IMÓVEIS CAIXA
        </p>
      </div>
    </a>

    <nav className="hidden lg:flex items-center gap-8 text-sm font-black">
      <a href="/" className="text-lime-600">
        Início
      </a>

      <a href="/buscar">
        Buscar Imóveis
      </a>

      <a href="/mapa">
        Mapa
      </a>

      <a href="/favoritos">
        Favoritos
      </a>

      <a href="/dashboard">
        Dashboard
      </a>
    </nav>

    <div className="flex gap-3">
      <a
        href="/login"
        className="border border-zinc-300 px-5 py-3 rounded-xl font-black"
      >
        Entrar
      </a>

      <a
        href="/cadastro"
        className="bg-lime-500 px-5 py-3 rounded-xl font-black text-black"
      >
        Cadastrar
      </a>
    </div>

  </div>
</header>

<section className="relative">
  <div className="relative min-h-[600px] overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2000&auto=format&fit=crop"
      alt="Imóvel moderno"
      className="absolute inset-0 w-full h-full object-cover"
    />

    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/75 to-transparent" />

    <div className="relative max-w-7xl mx-auto px-6 pt-20">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 shadow-sm px-4 py-2 rounded-full text-xs font-black text-zinc-700">
          <BrainCircuit size={15} className="text-lime-500" />
          PLATAFORMA INTELIGENTE
        </div>

        <h2 className="mt-8 text-4xl md:text-6xl font-black leading-[1.08] text-[#07111f]">
          Encontre imóveis Caixa com{" "}
          <span className="text-lime-500">alto desconto</span>
          <br />
          de forma inteligente
        </h2>

        <p className="mt-7 text-zinc-600 text-lg max-w-xl">
          Pesquise imóveis da Caixa por cidade, bairro, tipo e valor.
          Salve favoritos, veja imagens reais e acesse os detalhes oficiais.
        </p>
      </div>

      {destaque && (
  <div className="hidden lg:block absolute right-16 top-8 w-[320px] bg-white rounded-[32px] shadow-2xl overflow-hidden border border-white z-30">
    <div className="p-3">
      <div className="relative h-32 rounded-[24px] overflow-hidden bg-zinc-100">
        <img
          src={destaque.imagem || "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop"}
          alt={destaque.endereco}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

        <span className="absolute top-3 left-3 bg-lime-100 text-lime-700 px-3 py-1 rounded-full text-xs font-black">
          MAIOR OPORTUNIDADE
        </span>

        <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center font-black">
          ❤
        </button>
      </div>
    </div>

    <div className="px-6 pb-6">
      <h3 className="text-xl font-black leading-tight text-[#07111f]">
        {detectarTipo(destaque.descricao)} em {destaque.cidade}
      </h3>

      <p className="mt-2 text-sm text-zinc-500">
        {destaque.uf} • Código {destaque.numero}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-zinc-200 pt-4">
        <div>
          <p className="text-xs text-zinc-500">Avaliação</p>
          <p className="text-sm text-zinc-500 line-through">
            R$ {destaque.avaliacao}
          </p>
        </div>

        <div>
          <p className="text-xs text-zinc-500">Desconto</p>
          <p className="text-lg font-black text-lime-600">
            {destaque.desconto}% OFF
          </p>
        </div>
      </div>

      <div className="mt-5 bg-lime-50 rounded-2xl p-4 border border-lime-100">
        <p className="text-sm text-lime-700">Valor de venda</p>
        <p className="text-3xl font-black text-lime-600">
          R$ {destaque.preco}
        </p>
      </div>

      <a
        href={`/imovel/${destaque.numero}`}
        className="mt-5 block text-center bg-[#07111f] text-white py-4 rounded-2xl font-black"
      >
        Ver detalhes
      </a>
    </div>
  </div>
)}
    </div>
  </div>

  <div className="max-w-7xl mx-auto px-6">
    <div className="relative z-30 -mt-16 bg-white rounded-[28px] shadow-2xl p-7">
      <div className="grid md:grid-cols-3 gap-5">
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="border border-zinc-300 rounded-xl px-5 py-4 outline-none text-zinc-700"
        >
          <option value="">Adicionar estado</option>
          <option value="SP">São Paulo</option>
          <option value="RJ">Rio de Janeiro</option>
          <option value="MG">Minas Gerais</option>
        </select>

        <select
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          className="border border-zinc-300 rounded-xl px-5 py-4 outline-none text-zinc-700"
        >
          <option value="">Adicionar cidade</option>
        </select>

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border border-zinc-300 rounded-xl px-5 py-4 outline-none text-zinc-700"
        >
          <option value="">Tipo</option>
          <option value="Casa">Casa</option>
          <option value="Apartamento">Apartamento</option>
          <option value="Terreno">Terreno</option>
          <option value="Comercial">Comercial</option>
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-5">
        <select
          value={modalidade}
          onChange={(e) => setModalidade(e.target.value)}
          className="border border-zinc-300 rounded-xl px-5 py-4 outline-none text-zinc-700"
        >
          <option value="">Modalidade</option>
          <option value="Venda Direta Online">Venda Direta</option>
          <option value="Licitação Aberta">Licitação Aberta</option>
        </select>

        <select
          value={valorMaximo}
          onChange={(e) => setValorMaximo(e.target.value)}
          className="border border-zinc-300 rounded-xl px-5 py-4 outline-none text-zinc-700"
        >
          <option value="">Preço</option>
          <option value="100000">Até R$ 100.000</option>
          <option value="500000">Até R$ 500.000</option>
          <option value="1000000">Até R$ 1.000.000</option>
        </select>

        <button
          onClick={() => setMostrarFiltros(true)}
          className="border border-zinc-300 rounded-xl px-5 py-4 font-black hover:bg-zinc-50"
        >
          ⚙ Mais filtros
        </button>
      </div>

      <button
        onClick={irParaBusca}
        className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-black transition"
      >
        Buscar imóveis
      </button>
    </div>
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