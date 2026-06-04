import fs from "fs";
import path from "path";
import { chromium } from "playwright";

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

function parseCSVLine(line: string) {
  return line.split(";").map((item) => item.trim());
}

async function capturarImagem(page: any, url: string) {
  try {
    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 60000,
    });

    const imagens = await page.locator("img").evaluateAll((imgs: any[]) =>
      imgs
        .map((img) => img.src)
        .filter((src) => src.includes("/fotos/"))
    );

    return imagens[0] || "";
  } catch {
    return "";
  }
}

async function main() {
  const arquivoCSV = path.join(
    process.cwd(),
    "public",
    "Lista_imoveis_geral.csv"
  );

  const conteudo = fs.readFileSync(arquivoCSV, "latin1");

  const linhas = conteudo
    .split(/\r?\n/)
    .map((linha) => linha.trim())
    .filter(Boolean)
    .filter((linha) => /^\d/.test(linha));

  const imoveis: Imovel[] = linhas
    .map((linha) => {
      const colunas = parseCSVLine(linha);

      return {
        numero: colunas[0] || "",
        uf: colunas[1] || "",
        cidade: colunas[2] || "",
        bairro: colunas[3] || "",
        endereco: colunas[4] || "",
        preco: colunas[5] || "",
        avaliacao: colunas[6] || "",
        desconto: colunas[7] || "",
        financiamento: colunas[8] || "",
        descricao: colunas[9] || "",
        modalidade: colunas[10] || "",
        link: colunas[11] || "",
      };
    })
    .filter((imovel) => imovel.link.startsWith("http"));

  console.log(`Total de imóveis na lista: ${imoveis.length}`);

  const browser = await chromium.launch({
    headless: false,
  });

  const page = await browser.newPage();
  const resultado: Imovel[] = [];

  for (let i = 0; i < imoveis.length; i++) {
    const imovel = imoveis[i];

    console.log(`[${i + 1}/${imoveis.length}] ${imovel.numero} - ${imovel.cidade}/${imovel.uf}`);

    const imagem = await capturarImagem(page, imovel.link);

    resultado.push({
      ...imovel,
      imagem,
    });

    console.log(imagem ? "Imagem capturada" : "Sem imagem");
  }

  await browser.close();

  fs.writeFileSync(
    path.join(process.cwd(), "public", "imoveis.json"),
    JSON.stringify(resultado, null, 2),
    "utf-8"
  );

  console.log("Pronto! Arquivo criado: public/imoveis.json");
}

main();