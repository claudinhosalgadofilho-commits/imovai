"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

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

const QUANTIDADE_POR_PAGINA = 30;

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

  return "Outros";
}

export default function Buscar() {
  const searchParams = useSearchParams();

  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [busca, setBusca] = useState("");
  const [buscaDigitada, setBuscaDigitada] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [tipo, setTipo] = useState("");
  const [valorMaximo, setValorMaximo] = useState("");
  const [descontoMinimo, setDescontoMinimo] = useState("");
  const [financiamento, setFinanciamento] = useState("");
  const [ordenar, setOrdenar] = useState("maior-desconto");
  const [limite, setLimite] = useState(QUANTIDADE_POR_PAGINA);

  useEffect(() => {
    const buscaUrl = searchParams.get("busca") || "";
    setBusca(buscaUrl);
    setBuscaDigitada(buscaUrl);
    setUf(searchParams.get("uf") || "");
    setCidade(searchParams.get("cidade") || "");
    setTipo(searchParams.get("tipo") || "");
    setValorMaximo(searchParams.get("valor") || "");
  }, [searchParams]);

  useEffect(() => {
    async function carregarImoveis() {
      const response = await fetch("/imoveis.json");
      const dados = await response.json();
      setImoveis(dados);
    }

    carregarImoveis();
  }, []);

  useEffect(() => {
    const tempo = setTimeout(() => {
      setBusca(buscaDigitada);
      setLimite(QUANTIDADE_POR_PAGINA);
    }, 400);

    return () => clearTimeout(tempo);
  }, [buscaDigitada]);

  useEffect(() => {
    setLimite(QUANTIDADE_POR_PAGINA);
  }, [uf, cidade, bairro, tipo, valorMaximo, descontoMinimo, financiamento, ordenar]);

  const estados = useMemo(() => {
    return Array.from(new Set(imoveis.map((item) => item.uf)))
      .filter(Boolean)
      .sort();
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

  const bairros = useMemo(() => {
    return Array.from(
      new Set(
        imoveis
          .filter((item) => (uf ? item.uf === uf : true))
          .filter((item) => (cidade ? item.cidade === cidade : true))
          .map((item) => item.bairro)
      )
    )
      .filter(Boolean)
      .sort();
  }, [imoveis, uf, cidade]);

  const imoveisFiltrados = useMemo(() => {
    let resultado = imoveis.filter((imovel) => {
      const textoBusca = `
        ${imovel.numero}
        ${imovel.uf}
        ${imovel.cidade}
        ${imovel.bairro}
        ${imovel.endereco}
        ${imovel.descricao}
        ${imovel.modalidade}
      `.toLowerCase();

      const passaBusca = textoBusca.includes(busca.toLowerCase());
      const passaUf = uf ? imovel.uf === uf : true;
      const passaCidade = cidade ? imovel.cidade === cidade : true;
      const passaBairro = bairro ? imovel.bairro === bairro : true;
      const passaTipo = tipo ? detectarTipo(imovel.descricao) === tipo : true;

      const preco = limparNumero(imovel.preco);
      const passaValor = valorMaximo ? preco <= Number(valorMaximo) : true;

      const desconto = limparNumero(imovel.desconto);
      const passaDesconto = descontoMinimo
        ? desconto >= Number(descontoMinimo)
        : true;

      const financiamentoTexto = String(imovel.financiamento || "").toLowerCase();

      const passaFinanciamento = financiamento
        ? financiamentoTexto.includes(financiamento.toLowerCase())
        : true;

      return (
        passaBusca &&
        passaUf &&
        passaCidade &&
        passaBairro &&
        passaTipo &&
        passaValor &&
        passaDesconto &&
        passaFinanciamento
      );
    });

    resultado = [...resultado];

    if (ordenar === "maior-desconto") {
      resultado.sort((a, b) => limparNumero(b.desconto) - limparNumero(a.desconto));
    }

    if (ordenar === "menor-preco") {
      resultado.sort((a, b) => limparNumero(a.preco) - limparNumero(b.preco));
    }

    if (ordenar === "maior-preco") {
      resultado.sort((a, b) => limparNumero(b.preco) - limparNumero(a.preco));
    }

    if (ordenar === "cidade") {
      resultado.sort((a, b) => a.cidade.localeCompare(b.cidade));
    }

    return resultado;
  }, [
    imoveis,
    busca,
    uf,
    cidade,
    bairro,
    tipo,
    valorMaximo,
    descontoMinimo,
    financiamento,
    ordenar,
  ]);

  const imoveisVisiveis = imoveisFiltrados.slice(0, limite);

  function limparFiltros() {
    setBusca("");
    setBuscaDigitada("");
    setUf("");
    setCidade("");
    setBairro("");
    setTipo("");
    setValorMaximo("");
    setDescontoMinimo("");
    setFinanciamento("");
    setOrdenar("maior-desconto");
    setLimite(QUANTIDADE_POR_PAGINA);
    window.history.replaceState(null, "", "/buscar");
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#07111f]">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <a href="/" className="block">
            <h1 className="text-4xl font-black leading-none">
              imov<span className="text-lime-500">AI</span>
            </h1>
            <p className="text-[10px] font-black tracking-widest text-zinc-500">
              BUSCA INTELIGENTE CAIXA
            </p>
          </a>

          <nav className="hidden md:flex gap-6 text-sm font-black">
            <a href="/">Início</a>
            <a href="/mapa">Mapa</a>
            <a href="/favoritos">Favoritos</a>
            <a href="/dashboard">Dashboard</a>
          </nav>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <h2 className="text-5xl font-black">Buscar Imóveis Caixa</h2>
            <p className="mt-3 text-zinc-500">
              Busca otimizada com carregamento por página para não travar.
            </p>
          </div>

          <button
            onClick={limparFiltros}
            className="flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-2xl font-black"
          >
            <X size={18} />
            Limpar filtros
          </button>
        </div>

        <div className="mt-8 bg-white rounded-[30px] shadow-xl p-6">
          <div className="flex items-center gap-3 bg-zinc-100 rounded-2xl px-4 mb-5">
            <Search className="text-zinc-500" />

            <input
              value={buscaDigitada}
              onChange={(e) => setBuscaDigitada(e.target.value)}
              placeholder="Buscar por código, cidade, bairro, endereço ou descrição"
              className="w-full bg-transparent py-4 outline-none"
            />
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <select
              value={uf}
              onChange={(e) => {
                setUf(e.target.value);
                setCidade("");
                setBairro("");
              }}
              className="bg-zinc-100 rounded-2xl px-4 py-4 outline-none"
            >
              <option value="">Todos os estados</option>
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>

            <select
              value={cidade}
              onChange={(e) => {
                setCidade(e.target.value);
                setBairro("");
              }}
              className="bg-zinc-100 rounded-2xl px-4 py-4 outline-none"
            >
              <option value="">Todas as cidades</option>
              {cidades.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              className="bg-zinc-100 rounded-2xl px-4 py-4 outline-none"
            >
              <option value="">Todos os bairros</option>
              {bairros.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="bg-zinc-100 rounded-2xl px-4 py-4 outline-none"
            >
              <option value="">Todos os tipos</option>
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Terreno">Terreno</option>
              <option value="Gleba">Gleba</option>
              <option value="Comercial">Comercial</option>
              <option value="Outros">Outros</option>
            </select>

            <select
              value={valorMaximo}
              onChange={(e) => setValorMaximo(e.target.value)}
              className="bg-zinc-100 rounded-2xl px-4 py-4 outline-none"
            >
              <option value="">Qualquer valor</option>
              <option value="100000">Até R$ 100 mil</option>
              <option value="200000">Até R$ 200 mil</option>
              <option value="300000">Até R$ 300 mil</option>
              <option value="500000">Até R$ 500 mil</option>
              <option value="1000000">Até R$ 1 milhão</option>
              <option value="2000000">Até R$ 2 milhões</option>
            </select>

            <select
              value={descontoMinimo}
              onChange={(e) => setDescontoMinimo(e.target.value)}
              className="bg-zinc-100 rounded-2xl px-4 py-4 outline-none"
            >
              <option value="">Qualquer desconto</option>
              <option value="20">Acima de 20%</option>
              <option value="30">Acima de 30%</option>
              <option value="40">Acima de 40%</option>
              <option value="50">Acima de 50%</option>
              <option value="60">Acima de 60%</option>
              <option value="70">Acima de 70%</option>
            </select>

            <select
              value={financiamento}
              onChange={(e) => setFinanciamento(e.target.value)}
              className="bg-zinc-100 rounded-2xl px-4 py-4 outline-none"
            >
              <option value="">Financiamento</option>
              <option value="Sim">Aceita financiamento</option>
              <option value="Não">Não aceita financiamento</option>
            </select>

            <select
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value)}
              className="bg-zinc-100 rounded-2xl px-4 py-4 outline-none"
            >
              <option value="maior-desconto">Maior desconto</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
              <option value="cidade">Cidade A-Z</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-zinc-500">
            Mostrando{" "}
            <span className="font-black text-black">{imoveisVisiveis.length}</span>{" "}
            de{" "}
            <span className="font-black text-black">
              {imoveisFiltrados.length}
            </span>{" "}
            imóveis encontrados.
          </p>

          <p className="text-sm text-zinc-500">
            Total carregado: {imoveis.length}
          </p>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {imoveisVisiveis.map((imovel) => (
            <div
              key={imovel.numero}
              className="bg-white rounded-[25px] shadow-lg overflow-hidden border border-zinc-100"
            >
              <div className="relative h-56 bg-zinc-200">
                {imovel.imagem ? (
                  <img
                    src={imovel.imagem}
                    alt={imovel.endereco}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <span className="font-bold text-zinc-500">Sem imagem</span>
                  </div>
                )}

                <span className="absolute top-4 left-4 bg-lime-500 text-black px-3 py-1 rounded-full text-xs font-black">
                  {imovel.desconto}% OFF
                </span>

                <span className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-black">
                  {imovel.uf}
                </span>
              </div>

              <div className="p-5">
                <p className="text-xs text-zinc-500 font-black">
                  Código: {imovel.numero}
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  {detectarTipo(imovel.descricao)} em {imovel.cidade}
                </h3>

                <p className="text-zinc-500 text-sm">
                  {imovel.bairro} - {imovel.uf}
                </p>

                <p className="mt-4 text-sm text-zinc-500 line-clamp-2">
                  {imovel.endereco}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-zinc-400">Avaliação</p>
                    <p className="line-through text-zinc-500">
                      R$ {imovel.avaliacao}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-400">Venda</p>
                    <p className="font-black text-lime-600">
                      R$ {imovel.preco}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="bg-zinc-100 rounded-full px-3 py-1 text-xs font-bold">
                    {detectarTipo(imovel.descricao)}
                  </span>

                  <span className="bg-zinc-100 rounded-full px-3 py-1 text-xs font-bold">
                    {imovel.modalidade}
                  </span>
                </div>

                <a
                  href={`/imovel/${imovel.numero}`}
                  className="mt-5 block text-center bg-black text-white py-3 rounded-xl font-bold"
                >
                  Ver detalhes
                </a>
              </div>
            </div>
          ))}
        </div>

        {limite < imoveisFiltrados.length && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setLimite((atual) => atual + QUANTIDADE_POR_PAGINA)}
              className="bg-lime-500 text-black px-8 py-4 rounded-2xl font-black"
            >
              Carregar mais imóveis
            </button>
          </div>
        )}

        {imoveisFiltrados.length === 0 && (
          <div className="mt-10 bg-white rounded-[30px] shadow-xl p-10 text-center">
            <p className="text-2xl font-black">Nenhum imóvel encontrado.</p>

            <p className="mt-3 text-zinc-500">
              Tente limpar os filtros ou buscar por outra cidade.
            </p>

            <button
              onClick={limparFiltros}
              className="mt-6 bg-lime-500 text-black px-8 py-4 rounded-2xl font-black"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>
    </main>
  );
}