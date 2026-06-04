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
      valor
        .replace("R$", "")
        .replace(/\./g, "")
        .replace(",", ".")
        .replace("%", "")
        .trim()
    ) || 0
  );
}

function detectarTipo(descricao: string) {
  const texto = descricao.toLowerCase();

  if (texto.includes("terreno")) return "Terreno";
  if (texto.includes("apartamento")) return "Apartamento";
  if (texto.includes("casa")) return "Casa";
  if (texto.includes("gleba")) return "Gleba";

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
        setImoveis(dados);
      } catch {
        setImoveis([]);
      }
    }

    carregarImoveis();
  }, []);

  const oportunidades = useMemo(() => {
    return [...imoveis]
      .sort((a, b) => limparNumero(b.desconto) - limparNumero(a.desconto))
      .slice(0, 4);
  }, [imoveis]);

  const destaque = oportunidades[0];

  function buscar() {
    const params = new URLSearchParams();

    if (busca) params.set("busca", busca);
    if (tipo) params.set("tipo", tipo);
    if (valorMaximo) params.set("valor", valorMaximo);

    window.location.href = `/buscar?${params.toString()}`;
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
            <a href="/buscar">Oportunidades</a>
            <a href="/dashboard">Análise IA</a>
            <a href="/favoritos">Favoritos</a>
            <a href="/dashboard">Dashboard</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="/favoritos">
              <Bell className="hidden md:block text-zinc-700" />
            </a>

            <a
              href="/login"
              className="bg-lime-500 text-black px-6 py-3 rounded-xl font-black shadow-lg shadow-lime-500/20 hover:bg-lime-400 transition"
            >
              Entrar
            </a>
          </div>
        </div>
      </header>

      <section className="relative max-w-7xl mx-auto px-6 pt-12">
        <div className="relative rounded-[35px] overflow-hidden min-h-[520px] bg-white">
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
              Encontre imóveis com{" "}
              <span className="text-lime-500">alto desconto</span>
              <br />
              com Inteligência Artificial
            </motion.h2>

            <p className="mt-7 text-zinc-500 text-lg max-w-xl">
              O imovAI organiza imóveis da Caixa, mostra imagens reais, filtros
              inteligentes, favoritos e oportunidades para investidores.
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
              <a href="/dashboard" className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center">
                  <BrainCircuit className="text-lime-600" />
                </div>
                <div>
                  <p className="font-black text-sm">Análise IA</p>
                  <p className="text-xs text-zinc-500">Score visual</p>
                </div>
              </a>

              <a href="/mapa" className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center">
                  <MapPinned className="text-lime-600" />
                </div>
                <div>
                  <p className="font-black text-sm">Mapa Inteligente</p>
                  <p className="text-xs text-zinc-500">Regiões monitoradas</p>
                </div>
              </a>

              <a href="/favoritos" className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center">
                  <Bell className="text-lime-600" />
                </div>
                <div>
                  <p className="font-black text-sm">Favoritos</p>
                  <p className="text-xs text-zinc-500">Salvos na conta</p>
                </div>
              </a>
            </div>
          </div>

          {destaque && (
            <div className="hidden lg:block absolute right-24 top-36 bg-white rounded-3xl shadow-2xl p-7 w-[330px] z-20">
              <span className="bg-lime-100 text-lime-700 px-3 py-1 rounded-full text-xs font-black">
                OPORTUNIDADE EM DESTAQUE
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
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Digite cidade, bairro ou estado"
            className="md:col-span-2 bg-white border-r border-zinc-200 px-5 py-4 outline-none"
          />

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="bg-white px-4 py-4 outline-none"
          >
            <option value="">Tipo de imóvel</option>
            <option value="Casa">Casa</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Terreno">Terreno</option>
            <option value="Gleba">Gleba</option>
          </select>

          <select
            value={valorMaximo}
            onChange={(e) => setValorMaximo(e.target.value)}
            className="bg-white px-4 py-4 outline-none"
          >
            <option value="">Valor máximo</option>
            <option value="200000">Até R$ 200 mil</option>
            <option value="500000">Até R$ 500 mil</option>
            <option value="1000000">Até R$ 1 milhão</option>
          </select>

          <button
            onClick={buscar}
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
            <motion.div
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
                  />
                ) : (
                  <div className="h-48 w-full bg-zinc-200 flex items-center justify-center">
                    <p className="text-zinc-500 font-bold">Sem imagem</p>
                  </div>
                )}

                <span className="absolute top-4 left-4 bg-lime-500 text-black px-3 py-1 rounded-full text-xs font-black">
                  {item.desconto}% OFF
                </span>

                <a href={`/imovel/${item.numero}`}>
                  <Heart className="absolute top-4 right-4 text-white" />
                </a>
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
                    <p className="font-black text-lime-600">R$ {item.preco}</p>
                  </div>
                </div>

                <a
                  href={`/imovel/${item.numero}`}
                  className="mt-5 block text-center bg-black text-white py-3 rounded-xl font-bold"
                >
                  Ver detalhes
                </a>
              </div>
            </motion.div>
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
              <p className="text-2xl font-black">70%</p>
              <p className="text-sm text-zinc-500">Maior desconto</p>
            </div>
          </a>

          <a href="/buscar" className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-lime-100 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="text-lime-600" />
            </div>
            <div>
              <p className="text-2xl font-black">100%</p>
              <p className="text-sm text-zinc-500">Links Caixa</p>
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
              <p className="text-sm text-zinc-500">na nuvem</p>
            </div>
          </a>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-[#07111f] rounded-[30px] overflow-hidden text-white grid md:grid-cols-3 gap-8 p-10 items-center">
          <div>
            <div className="w-16 h-16 rounded-full border border-lime-500 flex items-center justify-center font-black text-lime-400">
              IA
            </div>

            <p className="mt-4 text-sm font-black text-zinc-300">
              Análise Inteligente
            </p>

            <h3 className="mt-2 text-4xl font-black">
              A IA analisa, você decide melhor.
            </h3>

            <p className="mt-4 text-zinc-400">
              Cada imóvel pode receber score visual, risco, liquidez e potencial
              de oportunidade para sua assessoria.
            </p>

            <a
              href="/dashboard"
              className="mt-7 inline-block bg-lime-500 text-black px-6 py-4 rounded-xl font-black"
            >
              Acessar análise IA
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              "Score de Oportunidade",
              "Risco Jurídico",
              "Potencial de Valorização",
              "Retorno sobre Investimento",
            ].map((item) => (
              <a href="/buscar" key={item} className="bg-white/10 rounded-2xl p-5">
                <p className="font-black text-lime-400">{item}</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Ver imóveis analisados
                </p>
              </a>
            ))}
          </div>

          <div className="flex justify-center">
            <div className="w-64 h-64 rounded-full bg-lime-500/10 border border-lime-500/30 flex items-center justify-center shadow-[0_0_80px_rgba(132,204,22,.35)]">
              <div className="w-40 h-40 bg-lime-500 rounded-full flex flex-col items-center justify-center text-black">
                <p className="text-6xl font-black">9.2</p>
                <p className="font-black">Score imovAI</p>
                <p className="text-xs font-bold">Excelente</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-12">
        <h3 className="text-3xl font-black">Mapa Inteligente</h3>
        <p className="text-zinc-500 mt-2">
          Explore regiões com maior concentração de oportunidades.
        </p>

        <div className="mt-6 grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
            {["SP", "RJ", "MG", "AC"].map((estado) => (
              <a
                key={estado}
                href={`/buscar?uf=${estado}`}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-black">Estado {estado}</p>
                  <p className="text-sm text-zinc-500">
                    Ver imóveis disponíveis
                  </p>
                </div>
                <span className="text-sm font-black text-lime-600">→</span>
              </a>
            ))}
          </div>

          <a
            href="/mapa"
            className="md:col-span-3 rounded-2xl overflow-hidden relative h-[330px] bg-blue-100 shadow-sm block"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#84cc16,transparent_35%)] opacity-25" />

            <div className="absolute top-16 left-40 bg-lime-500 w-12 h-12 rounded-full flex items-center justify-center font-black">
              12
            </div>

            <div className="absolute top-36 left-1/2 bg-lime-500 w-12 h-12 rounded-full flex items-center justify-center font-black">
              15
            </div>

            <div className="absolute top-20 right-56 bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center font-black">
              19
            </div>

            <div className="absolute right-8 top-8 bg-white rounded-2xl shadow-xl p-6 w-56">
              <p className="font-black">Mapa do imovAI</p>
              <p className="text-6xl font-black mt-3">{imoveis.length}</p>
              <p className="text-zinc-500">imóveis carregados</p>

              <span className="mt-5 block text-center bg-lime-500 py-3 rounded-xl font-black">
                Abrir mapa
              </span>
            </div>
          </a>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-12">
        <h3 className="text-2xl font-black mb-6">O que nossos usuários dizem</h3>

        <div className="grid md:grid-cols-3 gap-6">
          {["Ricardo Almeida", "Juliana Martins", "Carlos Eduardo"].map((nome) => (
            <div key={nome} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between">
                <div>
                  <p className="font-black">{nome}</p>
                  <p className="text-sm text-zinc-500">Investidor</p>
                </div>

                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>

              <p className="mt-5 text-sm text-zinc-600">
                “Encontrei oportunidades com desconto e consegui analisar melhor
                antes de investir.”
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-[#07111f] rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <Mail />
            </div>

            <div>
              <p className="text-xl font-black">
                Não perca nenhuma oportunidade!
              </p>
              <p className="text-zinc-400">
                Receba alertas dos melhores imóveis diretamente no seu e-mail.
              </p>
            </div>
          </div>

          <div className="flex w-full md:w-auto bg-white rounded-xl overflow-hidden">
            <input
              placeholder="Seu melhor e-mail"
              className="px-5 py-4 text-black outline-none w-full md:w-80"
            />

            <a
              href="/cadastro"
              className="bg-lime-500 text-black px-6 font-black flex items-center"
            >
              Receber alertas
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#07111f] text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-5 gap-10">
          <div>
            <h2 className="text-4xl font-black">
              imov<span className="text-lime-500">AI</span>
            </h2>
            <p className="mt-5 text-zinc-400 text-sm">
              Plataforma inteligente para organizar oportunidades da Caixa,
              imagens reais, favoritos e análise visual.
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
            <a href="/dashboard" className="block text-zinc-400">Dashboard</a>
          </div>

          <div>
            <h4 className="font-black mb-4">Sistema</h4>
            <a href="/favoritos" className="block text-zinc-400">Favoritos</a>
            <a href="/buscar" className="block text-zinc-400">Oportunidades</a>
            <a href="/dashboard" className="block text-zinc-400">Análise IA</a>
          </div>

          <div>
            <h4 className="font-black mb-4">Contato</h4>
            <p className="text-zinc-400">contato@imovai.com.br</p>
            <p className="text-zinc-400">São Sebastião - SP</p>
          </div>
        </div>
      </footer>
    </main>
  );
}