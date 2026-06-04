const url = "https://venda-imoveis.caixa.gov.br/listaweb/Lista_imoveis_SP.csv";

async function main() {
  const response = await fetch(url);
  const texto = await response.text();

  console.log("STATUS:", response.status);
  console.log("INÍCIO DO ARQUIVO:");
  console.log(texto.slice(0, 1000));
}

main();