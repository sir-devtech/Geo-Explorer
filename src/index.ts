import { pathToFileURL } from "node:url";
import { executar } from "./cli.js";

export function main(argv: string[]): number {
  const resultado = executar(argv);
  const saida = resultado.saida.endsWith("\n") ? resultado.saida : `${resultado.saida}\n`;
  process.stdout.write(saida);
  return resultado.codigo;
}

const entrada = process.argv[1];
if (entrada && import.meta.url === pathToFileURL(entrada).href) {
  process.exitCode = main(process.argv.slice(2));
}
