"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BrainCircuit,
  Building2,
  CheckCircle,
  Heart,
  Home,
  MapPin,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  X,
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
  if (texto.includes("loja")) return "Loja";
  if (texto.includes("prédio") || texto.includes("predio")) return "Prédio";
  if (texto.includes("sala")) return "Sala";
  if (texto.includes("lote")) return "Lote";

  return "Imóvel";
}

export default function HomePage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [busca, setBusca] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [tipo, setTipo] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [valorMaximo, setValorMaximo] = useState("");
  const [descontoMinimo, setDescontoMinimo] = useState("");
  const [financiamento, setFinanciamento] = useState("");
  const [abrirFiltros, setAbrirFiltros] = useState(false);

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

  const estados = useMemo(() => {
    return Array.from(new Set(imoveis.map((item) => item.uf))).filter(Boolean).sort();
  }, [imoveis]);

  const cidades = useMemo(() => {
    return Array.from(
      new Set(
        imoveis
          .filter((item) => (uf ? item.uf === uf : true))
          .map((item) => item.cidade)
      )
    )
      .filter(Boolean)
      .sort();
  }, [imoveis, uf]);

  const oportunidades = useMemo(() => {
    return [...imoveis]
      .filter((item) => item.imagem)
      .sort((a, b) => limparNumero(b.desconto) - limparNumero(a.desconto))
      .slice(0, 4);
  }, [imoveis]);

  const destaque = oportunidades[0];

  function buscar() {
    const params = new URLSearchParams();

    if (busca.trim()) params.set("busca", busca.trim());
    if (uf) params.set("uf", uf);
    if (cidade) params.set("cidade", cidade);
    if (tipo) params.set("tipo", tipo);
    if (modalidade) params.set("modalidade", modalidade);
    if (valorMaximo) params.set("valor", valorMaximo);
    if (descontoMinimo) params.set("desconto", descontoMinimo);
    if (financiamento) params.set("financiamento", financiamento);

    const query = params.toString();
    window.location.href = query ? `/buscar?${query}` : "/buscar";
  }

  function limparFiltros() {
    setBusca("");
    setUf("");
    setCidade("");
    setTipo("");
    setModalidade("");
    setValorMaximo("");
    setDescontoMinimo("");
    setFinanciamento("");
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-[#06111f]">
      {abrirFiltros && (
        <div className="fixed inset-0 z-[100] bg-black/40">
          <aside className="h-full w-full max-w-[420px] bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-zinc-200 p-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 font-black text-xl">
                <Settings2 size={20} />
                Filtros Avançados
              </div>

              <button onClick={() => setAbrirFiltros(false)}>
                <X />
              </button>
            </div>

            <div className="p-5 space-y-7">
              <div>
                <h3 className="font-black mb-3">Localização</h3>

                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={uf}
                    onChange={(e) => {
                      setUf(e.target.value);
                      setCidade("");
                    }}
                    className="border rounded-xl px-3 py-3 outline-none"
                  >
                    <option value="">Adicionar estado</option>
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>

                  <select
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="border rounded-xl px-3 py-3 outline-none"
                  >
                    <option value="">Adicionar cidade</option>
                    {cidades.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Bairro, endereço ou código"
                  className="mt-3 w-full border rounded-xl px-3 py-3 outline-none"
                />
              </div>

              <div>
                <h3 className="font-black mb-3">Preço de venda</h3>

                <select
                  value={valorMaximo}
                  onChange={(e) => setValorMaximo(e.target.value)}
                  className="w-full border rounded-xl px-3 py-3 outline-none"
                >
                  <option value="">Qualquer valor</option>
                  <option value="100000">Até R$ 100 mil</option>
                  <option value="200000">Até R$ 200 mil</option>
                  <option value="300000">Até R$ 300 mil</option>
                  <option value="500000">Até R$ 500 mil</option>
                  <option value="1000000">Até R$ 1 milhão</option>
                  <option value="2000000">Até R$ 2 milhões</option>
                  <option value="5000000">Até R$ 5 milhões</option>
                </select>
              </div>

              <div>
                <h3 className="font-black mb-3">Desconto</h3>

                <select
                  value={descontoMinimo}
                  onChange={(e) => setDescontoMinimo(e.target.value)}
                  className="w-full border rounded-xl px-3 py-3 outline-none"
                >
                  <option value="">Qualquer desconto</option>
                  <option value="20">Acima de 20%</option>
                  <option value="30">Acima de 30%</option>
                  <option value="40">Acima de 40%</option>
                  <option value="50">Acima de 50%</option>
                  <option value="60">Acima de 60%</option>
                  <option value="70">Acima de 70%</option>
                </select>
              </div>

              <div>
                <h3 className="font-black mb-3">Tipo de Imóvel</h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    "Apartamento",
                    "Casa",
                    "Comercial",
                    "Gleba",
                    "Loja",
                    "Lote",
                    "Prédio",
                    "Sala",
                    "Terreno",
                  ].map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="tipo"
                        checked={tipo === item}
                        onChange={() => setTipo(item)}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-black mb-3">Modalidade</h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {["Venda online", "Compra Direta", "Licitação aberta", "Leilão SFI"].map(
                    (item) => (
                      <label key={item} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="modalidade"
                          checked={modalidade === item}
                          onChange={() => setModalidade(item)}
                        />
                        {item}
                      </label>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-black mb-3">Condições</h3>

                <div className="grid grid-cols-1 gap-3 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={financiamento === "Sim"}
                      onChange={(e) => setFinanciamento(e.target.checked ? "Sim" : "")}
                    />
                    Aceita financiamento
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sticky bottom-0 bg-white py-5">
                <button
                  onClick={limparFiltros}
                  className="border border-zinc-300 rounded-xl py-4 font-black"
                >
                  Limpar Filtros
                </button>

                <button
                  onClick={buscar}
                  className="bg-orange-500 text-white rounded-xl py-4 font-black"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-[#07111f]/95 backdrop-blur-xl border-b border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="block">
            <h1 className="text-4xl font-black leading-none">
              imov<span className="text-lime-500">AI</span>
            </h1>
            <p className="text-[10px] font-black tracking-widest text-zinc-400">
              INTELIGÊNCIA EM LEILÕES
            </p>
          </a>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-black">
            <a href="/">Início</a>
            <a href="/buscar">Buscar Imóveis</a>
            <a href="/mapa">Mapa</a>
            <a href="/favoritos">Favoritos</a>
            <a href="/dashboard">Dashboard</a>
          </nav>

          <a
            href="/login"
            className="border border-white/30 px-6 py-3 rounded-xl font-black hover:bg-white hover:text-black transition"
          >
            Entrar
          </a>
        </div>
      </header>

      <section className="relative bg-[#07111f] text-white">
        <div className="absolute inset-0">
          <img
            src={
              destaque?.imagem ||
              "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1800&auto=format&fit=crop"
            }
            className="w-full h-full object-cover opacity-55"
            alt="Imóvel em destaque"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07111f] via-[#07111f]/80 to-[#07111f]/10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-28">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black leading-tight">
              Encontre imóveis Caixa com{" "}
              <span className="text-lime-400">descontos reais</span>
            </h2>

            <p className="mt-6 text-lg text-zinc-200">
              Pesquise imóveis por localização, preço, desconto e modalidade. Inteligência
              para encontrar as melhores oportunidades.
            </p>

            <div className="mt-8 flex flex-wrap gap-5 text-sm font-bold text-lime-300">
              <span className="flex items-center gap-2">
                <CheckCircle size={16} /> Imagens reais
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={16} /> Links oficiais
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={16} /> Atualizado diariamente
              </span>
              <span className="flex items-center gap-2">
                <BrainCircuit size={16} /> Análise com IA
              </span>
            </div>
          </div>

          <div className="mt-12 bg-white text-black rounded-3xl shadow-2xl p-6 max-w-5xl">
            <div className="grid md:grid-cols-3 gap-4">
              <select
                value={uf}
                onChange={(e) => {
                  setUf(e.target.value);
                  setCidade("");
                }}
                className="border border-zinc-200 rounded-xl px-4 py-4 outline-none"
              >
                <option value="">Adicionar estado</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>

              <select
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="border border-zinc-200 rounded-xl px-4 py-4 outline-none"
              >
                <option value="">Adicionar cidade</option>
                {cidades.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="border border-zinc-200 rounded-xl px-4 py-4 outline-none"
              >
                <option value="">Tipo</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Casa">Casa</option>
                <option value="Terreno">Terreno</option>
                <option value="Comercial">Comercial</option>
                <option value="Gleba">Gleba</option>
              </select>

              <select
                value={modalidade}
                onChange={(e) => setModalidade(e.target.value)}
                className="border border-zinc-200 rounded-xl px-4 py-4 outline-none"
              >
                <option value="">Modalidade</option>
                <option value="Venda online">Venda online</option>
                <option value="Compra Direta">Compra Direta</option>
                <option value="Licitação aberta">Licitação aberta</option>
                <option value="Leilão SFI">Leilão SFI</option>
              </select>

              <select
                value={valorMaximo}
                onChange={(e) => setValorMaximo(e.target.value)}
                className="border border-zinc-200 rounded-xl px-4 py-4 outline-none"
              >
                <option value="">Preço: R$ 0,00 - R$ 10.000.000,00</option>
                <option value="100000">Até R$ 100 mil</option>
                <option value="200000">Até R$ 200 mil</option>
                <option value="500000">Até R$ 500 mil</option>
                <option value="1000000">Até R$ 1 milhão</option>
                <option value="2000000">Até R$ 2 milhões</option>
              </select>

              <button
                onClick={() => setAbrirFiltros(true)}
                className="border border-zinc-200 rounded-xl px-4 py-4 font-black flex items-center justify-center gap-2"
              >
                <Settings2 size={18} />
                Mais filtros
              </button>
            </div>

            <button
              onClick={buscar}
              className="mt-5 w-full bg-orange-500 hover:bg-orange-600 transition text-white rounded-xl py-4 font-black flex items-center justify-center gap-2"
            >
              <Search size={18} />
              Buscar Imóveis
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-black">Oportunidades em destaque</h3>

          <a
            href="/buscar"
            className="border border-lime-500 text-lime-700 px-6 py-3 rounded-xl font-black"
          >
            Ver todas →
          </a>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {oportunidades.map((item) => (
            <a
              href={`/imovel/${item.numero}`}
              key={item.numero}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-zinc-100 hover:-translate-y-1 transition"
            >
              <div className="relative">
                <img
                  src={item.imagem}
                  className="h-48 w-full object-cover"
                  alt={item.endereco}
                  loading="lazy"
                />

                <span className="absolute top-4 left-4 bg-lime-500 text-black px-3 py-1 rounded-full text-xs font-black">
                  {item.desconto}% OFF
                </span>

                <Heart className="absolute top-4 right-4 text-white" />
              </div>

              <div className="p-5">
                <h4 className="font-black text-lg">
                  {detectarTipo(item.descricao)} em {item.cidade}
                </h4>

                <p className="text-sm text-zinc-500 mt-1">
                  {item.cidade}, {item.uf}
                </p>

                <p className="mt-4 text-2xl text-lime-600 font-black">
                  R$ {item.preco}
                </p>

                <p className="text-sm text-zinc-500">
                  Avaliação: R$ {item.avaliacao}
                </p>

                <span className="mt-4 inline-block bg-orange-100 text-orange-600 px-3 py-2 rounded-lg text-xs font-black">
                  {item.modalidade}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-4 gap-6">
          <a href="/buscar" className="bg-white rounded-2xl p-7 shadow-sm flex items-center gap-5">
            <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center">
              <Home className="text-lime-600" />
            </div>
            <div>
              <p className="text-3xl font-black">{imoveis.length}</p>
              <p className="text-zinc-500">Imóveis disponíveis</p>
            </div>
          </a>

          <a href="/mapa" className="bg-white rounded-2xl p-7 shadow-sm flex items-center gap-5">
            <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center">
              <MapPin className="text-lime-600" />
            </div>
            <div>
              <p className="text-3xl font-black">{cidades.length}</p>
              <p className="text-zinc-500">Cidades atendidas</p>
            </div>
          </a>

          <a href="/buscar" className="bg-white rounded-2xl p-7 shadow-sm flex items-center gap-5">
            <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center">
              <SlidersHorizontal className="text-lime-600" />
            </div>
            <div>
              <p className="text-3xl font-black">Até 70%</p>
              <p className="text-zinc-500">Descontos médios</p>
            </div>
          </a>

          <a href="/dashboard" className="bg-white rounded-2xl p-7 shadow-sm flex items-center gap-5">
            <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="text-lime-600" />
            </div>
            <div>
              <p className="text-3xl font-black">100%</p>
              <p className="text-zinc-500">Fontes oficiais</p>
            </div>
          </a>
        </div>
      </section>

      <footer className="bg-[#07111f] text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
          <div>
            <h2 className="text-4xl font-black">
              imov<span className="text-lime-500">AI</span>
            </h2>
            <p className="mt-4 text-zinc-400">
              Portal inteligente para imóveis Caixa com filtros avançados.
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
            <a href="/login" className="block text-zinc-400">Entrar</a>
            <a href="/cadastro" className="block text-zinc-400">Cadastrar</a>
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