import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { criarServidor } from "../src/mcp.js";

const servidor = criarServidor();
const transporte = new StdioServerTransport();
await servidor.connect(transporte);
