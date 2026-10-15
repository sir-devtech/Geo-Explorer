# Geo-Explorer

O Geo-Explorer é uma experiência de exploração de trilhas de aprendizagem. A pessoa consulta uma trilha, recebe um desafio de código e pode gerar um certificado fictício de conclusão.

A base do projeto é fictícia e foi criada para estudo. Ela reúne Python, JavaScript, React, Java e TypeScript, cada uma com os níveis Básico, Intermediário e Avançado.

## Como executar o projeto

Requisitos: Node.js 18 ou superior.

```bash
npm install
npm run geo -- listar
```

Para subir o servidor MCP, que permite a outro cliente consultar as mesmas trilhas:

```bash
npm run mcp
```

O servidor usa o transporte stdio. A configuração para um cliente compatível está em [mcp/README.md](mcp/README.md).

## Como usar os comandos

O nível pode ser escrito com ou sem acento. `Basico` e `Básico` apontam para a mesma trilha.

```bash
npm run geo -- listar
npm run geo -- trilha Python
npm run geo -- trilha JavaScript Avançado
npm run geo -- desafio Java Intermediario
npm run geo -- certificado "Ana Souza" "Python"
npm run geo -- certificado "Ana Souza" "React" "Intermediário" --salvar
```

Também funciona com flags:

```bash
npm run geo -- desafio --tecnologia TypeScript --nivel Basico
```

| Comando | O que faz |
| --- | --- |
| `listar` | Mostra tecnologias, níveis e carga horária |
| `trilha <tecnologia> [nivel]` | Apresenta o plano de estudos. Sem nível, mostra a trilha inteira |
| `desafio <tecnologia> <nivel>` | Gera um desafio de código |
| `certificado <nome> <tecnologia> [nivel]` | Emite um certificado fictício. Sem nível, usa Básico |

`--salvar` grava o certificado em `docs/certificados-emitidos/`. Essa pasta não entra no Git.

Os detalhes de cada comando estão em [COMANDOS_SLASH.md](COMANDOS_SLASH.md).

## Como executar os testes

```bash
npm test
```

O Jest cobre a base, os comandos, a CLI e as ferramentas do servidor MCP. A meta do projeto é manter pelo menos 70% de cobertura em linhas, funções, ramos e instruções.

## Quais melhorias foram realizadas

Além do fluxo de trilha, desafio e certificado, o projeto inclui:

- o comando `listar`, para ver o catálogo antes de escolher uma trilha;
- a trilha de TypeScript, além de Python, JavaScript, React e Java;
- certificado com carga horária calculada, data e código de validação estável;
- a opção `--salvar` para exportar o certificado em Markdown;
- servidor MCP com as ferramentas `listar_trilhas`, `consultar_trilha`, `gerar_desafio` e `emitir_certificado`.

## O que foi aprendido durante o desafio

O desafio mostrou como separar dados, comandos e documentação em um projeto pequeno, mas completo. A base em JSON deixa as trilhas fáceis de revisar, e os comandos só formatam o que essa base já contém. Os testes garantem que um nível sem acento continue encontrando a trilha certa e que Java não se misture com JavaScript. O servidor MCP reaproveita os mesmos comandos, então a CLI e o cliente externo respondem a mesma coisa.
