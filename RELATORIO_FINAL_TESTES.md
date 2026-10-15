# Relatório final de testes

Data da execução: 14/10/2026.

Comando: `npm test`

Resultado: 4 suítes, 28 testes, todos passando.

## Cobertura

| Métrica | Resultado | Meta |
| --- | --- | --- |
| Instruções | 98,63% | 70% |
| Ramos | 90,14% | 70% |
| Funções | 100% | 70% |
| Linhas | 98,62% | 70% |

Arquivos cobertos: `src/cli.ts`, `src/comandos.ts`, `src/index.ts`, `src/mcp.ts` e `src/trilhas.ts`.

## O que os testes verificam

- A base contém Python, JavaScript, React, Java e TypeScript, nos três níveis.
- `Java` não é confundido com `JavaScript`.
- Nível sem acento, como `Intermediario`, encontra `Intermediário`.
- Trilha sem nível mostra o plano completo.
- Tecnologia ou nível inexistente devolve as opções disponíveis.
- Desafio traz enunciado e dica do nível pedido.
- Certificado inclui nome, trilha, data e código estável.
- `--salvar` grava o Markdown e o teste apaga o arquivo em seguida.
- As ferramentas MCP `listar_trilhas`, `consultar_trilha`, `gerar_desafio` e `emitir_certificado` respondem pelo transporte em memória.

## Conclusão

Os comandos devolvem o conteúdo esperado e a cobertura ficou acima da meta de 70%. O servidor MCP usa as mesmas funções da CLI, e os testes do cliente em memória cobrem esse caminho.

## Pontos fortes

- Uma única base alimenta a CLI e o MCP.
- A normalização de acento e caixa evita falha por diferença de escrita.
- O certificado é determinístico: a mesma pessoa, tecnologia e nível geram o mesmo código.

## Próximos passos

- Incluir mais de um desafio por nível e permitir escolher qual emitir.
- Acrescentar uma trilha nova sem alterar os comandos, só o JSON.
- Publicar o servidor MCP em um cliente e conferir as quatro ferramentas fora dos testes.
