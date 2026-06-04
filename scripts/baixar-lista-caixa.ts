import fs from "fs";
import path from "path";

const estados = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO",
  "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR",
  "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO",
];

function limparLinhasCSV(texto: string) {
  return texto
    .split(/\r?\n/)
    .map((linha) => linha.trim())
    .filter(Boolean)
    .filter((linha) => /^\d/.test(linha));
}

async function baixarEstado(uf: string) {
  const url = `https://venda-imoveis.caixa.gov.br/listaweb/Lista_imoveis_${uf}.csv`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.log(`❌ ${uf} não baixou. Status: ${response.status}`);
      return [];
    }

    const buffer = await response.arrayBuffer();
    const texto = new TextDecoder("iso-8859-1").decode(buffer);
    const linhas = limparLinhasCSV(texto);

    console.log(`✅ ${uf}: ${linhas.length} imóveis`);
    return linhas;
  } catch (error) {
    console.log(`❌ Erro ao baixar ${uf}`);
    return [];
  }
}

async function main() {
  console.log("Baixando listas oficiais da Caixa...\n");

  const todasLinhas: string[] = [];

  for (const uf of estados) {
    const linhas = await baixarEstado(uf);
    todasLinhas.push(...linhas);
  }

  const cabecalho =
    "N° do imóvel;UF;Cidade;Bairro;Endereço;Preço;Valor de avaliação;Desconto;Financiamento;Descrição;Modalidade;Link de acesso";

  const arquivoSaida = path.join(
    process.cwd(),
    "public",
    "Lista_imoveis_geral.csv"
  );

  fs.writeFileSync(
    arquivoSaida,
    [cabecalho, ...todasLinhas].join("\n"),
    "utf-8"
  );

  console.log("\n✅ Lista geral criada com sucesso!");
  console.log(`Total geral: ${todasLinhas.length} imóveis`);
  console.log("Arquivo: public/Lista_imoveis_geral.csv");
}

main();