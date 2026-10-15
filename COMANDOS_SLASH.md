# Comandos

Os comandos da aula seguem o formato com barra. Na CLI eles são os mesmos nomes, sem depender de um editor específico.

| Aula | Terminal |
| --- | --- |
| `/trilha Python` | `npm run geo -- trilha Python` |
| `/desafio Python Basico` | `npm run geo -- desafio Python Basico` |
| `/certificado "Ana Souza" "Python"` | `npm run geo -- certificado "Ana Souza" "Python"` |
| `/listar` | `npm run geo -- listar` |

## Trilha

Mostra descrição, módulos, tópicos e carga horária.

```bash
npm run geo -- trilha Python
npm run geo -- trilha React Intermediario
```

Sem nível, a resposta inclui Básico, Intermediário e Avançado. Tecnologia desconhecida devolve a lista do que existe.

## Desafio

Exige tecnologia e nível. A resposta traz título, enunciado e uma dica. O comando não resolve o exercício.

```bash
npm run geo -- desafio Java Intermediario
```

## Certificado

Emite um certificado fictício com nome, trilha, nível, carga horária, data e código de validação. O código depende só do nome, da tecnologia e do nível, então a mesma combinação gera sempre o mesmo valor.

```bash
npm run geo -- certificado "Ana Souza" "Python"
npm run geo -- certificado "Ana Souza" "TypeScript" "Avançado" --salvar
```

Sem `--salvar`, o certificado aparece apenas no terminal. Com `--salvar`, uma cópia em Markdown vai para `docs/certificados-emitidos/`.

## Listar

```bash
npm run geo -- listar
```

Lista cada tecnologia com os três níveis e a carga horária de cada um.

## Flags

`--tecnologia`, `--nivel`, `--nome` e `--salvar` substituem os argumentos posicionais correspondentes.

```bash
npm run geo -- desafio --tecnologia=TypeScript --nivel=Basico
```
