# Servidor MCP

O arquivo `server.ts` expõe o Geo-Explorer para clientes compatíveis com o Model Context Protocol, pelo transporte stdio.

Ferramentas:

- `listar_trilhas`
- `consultar_trilha`
- `gerar_desafio`
- `emitir_certificado`

Exemplo de configuração no cliente:

```json
{
  "mcpServers": {
    "geo-explorer": {
      "command": "npx",
      "args": ["tsx", "mcp/server.ts"]
    }
  }
}
```

Execute o comando a partir da raiz deste repositório, depois de `npm install`.
