import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { comandoCertificado, comandoDesafio, comandoListar, comandoTrilha } from "./comandos.js";

function resposta(texto: string, codigo: number) {
  return {
    content: [{ type: "text" as const, text: texto.trimEnd() }],
    isError: codigo !== 0,
  };
}

export function criarServidor(): McpServer {
  const servidor = new McpServer({
    name: "geo-explorer",
    version: "1.0.0",
  });

  servidor.registerTool(
    "listar_trilhas",
    {
      description: "Lista as trilhas, níveis e cargas horárias disponíveis.",
      inputSchema: {},
    },
    async () => {
      const resultado = comandoListar();
      return resposta(resultado.saida, resultado.codigo);
    },
  );

  servidor.registerTool(
    "consultar_trilha",
    {
      description: "Apresenta o plano de estudos de uma tecnologia. O nível é opcional.",
      inputSchema: {
        tecnologia: z.string().describe("Tecnologia da trilha, por exemplo Python."),
        nivel: z.string().optional().describe("Básico, Intermediário ou Avançado."),
      },
    },
    async ({ tecnologia, nivel }) => {
      const resultado = comandoTrilha(tecnologia, nivel);
      return resposta(resultado.saida, resultado.codigo);
    },
  );

  servidor.registerTool(
    "gerar_desafio",
    {
      description: "Gera um desafio de código para a tecnologia e o nível informados.",
      inputSchema: {
        tecnologia: z.string().describe("Tecnologia do desafio."),
        nivel: z.string().describe("Nível do desafio."),
      },
    },
    async ({ tecnologia, nivel }) => {
      const resultado = comandoDesafio(tecnologia, nivel);
      return resposta(resultado.saida, resultado.codigo);
    },
  );

  servidor.registerTool(
    "emitir_certificado",
    {
      description: "Cria um certificado fictício para uma trilha concluída.",
      inputSchema: {
        nome: z.string().describe("Nome de quem concluiu a trilha."),
        tecnologia: z.string().describe("Tecnologia concluída."),
        nivel: z.string().optional().describe("Nível concluído. O padrão é Básico."),
      },
    },
    async ({ nome, tecnologia, nivel }) => {
      const resultado = comandoCertificado(nome, tecnologia, nivel, { data: new Date() });
      return resposta(resultado.saida, resultado.codigo);
    },
  );

  return servidor;
}
