import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { criarServidor } from "../src/mcp.js";

async function chamar(nome: string, argumentos: Record<string, string> = {}) {
  const servidor = criarServidor();
  const cliente = new Client({ name: "teste", version: "1.0.0" });
  const [transporteCliente, transporteServidor] = InMemoryTransport.createLinkedPair();

  await Promise.all([cliente.connect(transporteCliente), servidor.connect(transporteServidor)]);
  const resultado = await cliente.callTool({ name: nome, arguments: argumentos });
  await cliente.close();
  await servidor.close();
  return resultado;
}

describe("servidor MCP", () => {
  it("lista trilhas", async () => {
    const resultado = await chamar("listar_trilhas");
    expect(JSON.stringify(resultado)).toContain("Python");
  });

  it("consulta trilha, gera desafio e emite certificado", async () => {
    const trilha = await chamar("consultar_trilha", { tecnologia: "TypeScript", nivel: "Básico" });
    const desafio = await chamar("gerar_desafio", { tecnologia: "TypeScript", nivel: "Básico" });
    const certificado = await chamar("emitir_certificado", {
      nome: "Ana Souza",
      tecnologia: "TypeScript",
    });

    expect(JSON.stringify(trilha)).toContain("TypeScript — Básico");
    expect(JSON.stringify(desafio)).toContain("Tipo Trilha");
    expect(JSON.stringify(certificado)).toContain("Ana Souza");
  });

  it("sinaliza erro quando a tecnologia não existe", async () => {
    const resultado = await chamar("consultar_trilha", { tecnologia: "COBOL" });
    expect(resultado.isError).toBe(true);
  });
});
