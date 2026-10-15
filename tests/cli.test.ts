import { existsSync, rmSync } from "node:fs";
import { caminhoCertificado } from "../src/comandos.js";
import { executar } from "../src/cli.js";
import { main } from "../src/index.js";

const dataFixa = new Date(2026, 9, 14);

describe("cli", () => {
  it("aceita o formato posicional da aula", () => {
    expect(executar(["trilha", "Python"], dataFixa).saida).toContain("Plano de estudos");
    expect(executar(["desafio", "Python", "Basico"], dataFixa).saida).toContain("Calculadora de médias");
    expect(executar(["certificado", "Ana Souza", "Python"], dataFixa).saida).toContain("Ana Souza");
  });

  it("aceita barra e flags", () => {
    const resultado = executar(
      [" /trilha".trim(), "--tecnologia=JavaScript", "--nivel", "Avançado"],
      dataFixa,
    );
    expect(resultado.codigo).toBe(0);
    expect(resultado.saida).toContain("JavaScript — Avançado");
  });

  it("salva pela flag --salvar", () => {
    const destino = caminhoCertificado("Ana Souza", "React", "Básico");
    rmSync(destino, { force: true });
    const resultado = executar(
      ["certificado", "--nome", "Ana Souza", "--tecnologia", "React", "--salvar"],
      dataFixa,
    );
    expect(resultado.codigo).toBe(0);
    expect(existsSync(destino)).toBe(true);
    rmSync(destino, { force: true });
  });

  it("explica comandos ausentes ou inválidos", () => {
    expect(executar([], dataFixa).codigo).toBe(1);
    expect(executar(["ajuda"], dataFixa).saida).toContain("Geo-Explorer");
    expect(executar(["help"], dataFixa).codigo).toBe(0);
    expect(executar(["deploy"], dataFixa).saida).toContain("Comando desconhecido");
    expect(executar(["listar", "Python"], dataFixa).codigo).toBe(1);
    expect(executar(["trilha", "Python", "Básico", "extra"], dataFixa).codigo).toBe(1);
    expect(executar(["certificado", "A", "Python", "Básico", "extra"], dataFixa).codigo).toBe(1);
    expect(executar(["trilha", "--tecnologia"], dataFixa).saida).toContain("Informe um valor");
    expect(executar(["trilha", "--tecnologia="], dataFixa).saida).toContain("Informe um valor");
    expect(executar(["trilha", "--repositorio", "x"], dataFixa).saida).toContain("Flag desconhecida");
  });

  it("escreve a saída pelo ponto de entrada", () => {
    const original = process.stdout.write;
    let chamado = false;
    process.stdout.write = ((chunk: string | Uint8Array) => {
      chamado = String(chunk).includes("Python");
      return true;
    }) as typeof process.stdout.write;

    try {
      expect(main(["listar"])).toBe(0);
      expect(chamado).toBe(true);
    } finally {
      process.stdout.write = original;
    }
  });
});
