"use client";

type Props = {
  aberto: boolean;
  fechar: () => void;
};

export default function FiltrosDrawer({
  aberto,
  fechar,
}: Props) {
  if (!aberto) return null;

  return (
    <>
      {/* Fundo escuro */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={fechar}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[420px] max-w-[95vw] bg-white z-50 overflow-y-auto shadow-2xl">

        <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between">
          <h2 className="text-xl font-black">
            Filtros Avançados
          </h2>

          <button
            onClick={fechar}
            className="text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-6">

          {/* Localização */}
          <div>
            <h3 className="font-black mb-3">
              Localização
            </h3>

            <div className="space-y-3">
              <select className="w-full border rounded-xl px-4 py-3">
                <option>Selecionar estado</option>
              </select>

              <select className="w-full border rounded-xl px-4 py-3">
                <option>Selecionar cidade</option>
              </select>

              <input
                placeholder="Bairro"
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>
          </div>

          {/* Preço */}
          <div>
            <h3 className="font-black mb-3">
              Preço de venda
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Valor mínimo"
                className="border rounded-xl px-4 py-3"
              />

              <input
                placeholder="Valor máximo"
                className="border rounded-xl px-4 py-3"
              />
            </div>
          </div>

          {/* Desconto */}
          <div>
            <h3 className="font-black mb-3">
              Desconto
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Mínimo %"
                className="border rounded-xl px-4 py-3"
              />

              <input
                placeholder="Máximo %"
                className="border rounded-xl px-4 py-3"
              />
            </div>
          </div>

          {/* Tipo */}
          <div>
            <h3 className="font-black mb-3">
              Tipo de imóvel
            </h3>

            <div className="grid grid-cols-2 gap-2 text-sm">

              <label>
                <input type="checkbox" /> Casa
              </label>

              <label>
                <input type="checkbox" /> Apartamento
              </label>

              <label>
                <input type="checkbox" /> Terreno
              </label>

              <label>
                <input type="checkbox" /> Comercial
              </label>

              <label>
                <input type="checkbox" /> Gleba
              </label>

              <label>
                <input type="checkbox" /> Rural
              </label>

            </div>
          </div>

          {/* Modalidade */}
          <div>
            <h3 className="font-black mb-3">
              Modalidade
            </h3>

            <div className="space-y-2 text-sm">

              <label className="block">
                <input type="checkbox" /> Venda Direta
              </label>

              <label className="block">
                <input type="checkbox" /> Licitação Aberta
              </label>

              <label className="block">
                <input type="checkbox" /> 1º Leilão
              </label>

              <label className="block">
                <input type="checkbox" /> 2º Leilão
              </label>

            </div>
          </div>

          {/* Condições */}
          <div>
            <h3 className="font-black mb-3">
              Condições
            </h3>

            <div className="space-y-2 text-sm">

              <label className="block">
                <input type="checkbox" /> Aceita FGTS
              </label>

              <label className="block">
                <input type="checkbox" /> Aceita Financiamento
              </label>

            </div>
          </div>

          {/* Área */}
          <div>
            <h3 className="font-black mb-3">
              Área
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Área mínima"
                className="border rounded-xl px-4 py-3"
              />

              <input
                placeholder="Área máxima"
                className="border rounded-xl px-4 py-3"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="grid grid-cols-2 gap-3 pt-4">

            <button
              className="border rounded-xl py-3 font-bold"
            >
              Limpar filtros
            </button>

            <button
              className="bg-orange-500 text-white rounded-xl py-3 font-bold"
            >
              Aplicar filtros
            </button>

          </div>

        </div>
      </div>
    </>
  );
}