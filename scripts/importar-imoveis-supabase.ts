import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const arquivo = path.join(process.cwd(), "public", "imoveis.json");
  const conteudo = fs.readFileSync(arquivo, "utf-8");
  const imoveis = JSON.parse(conteudo);

  console.log(`Importando ${imoveis.length} imóveis...`);

  for (const imovel of imoveis) {
    const { error } = await supabase.from("imoveis").upsert({
      numero: imovel.numero,
      uf: imovel.uf,
      cidade: imovel.cidade,
      bairro: imovel.bairro,
      endereco: imovel.endereco,
      preco: imovel.preco,
      avaliacao: imovel.avaliacao,
      desconto: imovel.desconto,
      financiamento: imovel.financiamento,
      descricao: imovel.descricao,
      modalidade: imovel.modalidade,
      link: imovel.link,
      imagem: imovel.imagem || "",
    });

    if (error) {
      console.log("Erro:", imovel.numero, error.message);
    } else {
      console.log("Importado:", imovel.numero);
    }
  }

  console.log("Importação finalizada.");
}

main();