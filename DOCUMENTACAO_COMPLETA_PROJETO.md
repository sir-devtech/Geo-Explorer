# Documentação do Geo-Explorer

## Visão geral

O Geo-Explorer entrega três resultados em cima da mesma base fictícia:

1. um plano de estudos da tecnologia escolhida;
2. um desafio de código no nível informado;
3. um certificado fictício de conclusão.

Um quarto comando, `listar`, mostra o catálogo antes da escolha.

## Estrutura

```text
.
├── data/
│   └── trilhas.json
├── docs/
│   └── certificados-emitidos/
├── mcp/
│   ├── README.md
│   └── server.ts
├── src/
│   ├── cli.ts
│   ├── comandos.ts
│   ├── index.ts
│   ├── mcp.ts
│   ├── trilhas.ts
│   └── tipos.ts
├── tests/
│   ├── cli.test.ts
│   ├── comandos.test.ts
│   ├── mcp.test.ts
│   └── trilhas.test.ts
├── COMANDOS_SLASH.md
├── DOCUMENTACAO_COMPLETA_PROJETO.md
├── README.md
├── RELATORIO_FINAL_TESTES.md
├── WELCOME.md
├── package.json
└── tsconfig.json
```

## Fluxo

`src/index.ts` inicia a CLI. `src/cli.ts` lê os argumentos e chama o comando. `src/comandos.ts` formata o texto. `src/trilhas.ts` lê `data/trilhas.json` e compara tecnologia e nível sem diferenciar acento ou maiúsculas.

O servidor em `mcp/server.ts` sobe o transporte stdio. As ferramentas em `src/mcp.ts` chamam as mesmas funções da CLI, então os dois caminhos usam a mesma regra.

## Base de trilhas

Cada item tem tecnologia, nível, descrição, módulos e desafios. Os módulos têm título, tópicos e horas. A carga horária do certificado é a soma das horas dos módulos.

Tecnologias: Python, JavaScript, React, Java e TypeScript.

Níveis: Básico, Intermediário e Avançado.

A busca é exata depois da normalização. Por isso `Java` não retorna `JavaScript`.

## Servidor MCP

Ferramentas:

- `listar_trilhas`
- `consultar_trilha`
- `gerar_desafio`
- `emitir_certificado`

Detalhes de execução: [mcp/README.md](mcp/README.md).

## Testes

`npm test` executa Jest com cobertura. O relatório consolidado está em [RELATORIO_FINAL_TESTES.md](RELATORIO_FINAL_TESTES.md).
