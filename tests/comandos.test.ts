import { existsSync, readFileSync, rmSync } from "node:fs";
import {
  caminhoCertificado,
  codigoCertificado,
  comandoCertificado,
  comandoDesafio,
  comandoListar,
  comandoTrilha,
  formatarData,
  slug,
  textoAjuda,
} from "../src/comandos.js";

const dataFixa = new Date(2026, 9, 14);

describe("comandos", () => {
  it("lista todas as tecnologias", () => {
    const resultado = comandoListar();
    expect(resultado.codigo).toBe(0);
    expect(resultado.saida).toContain("Python");
    expect(resultado.saida).toContain("TypeScript");
    expect(resultado.saida).toContain("Avançado");
  });

  it("mostra o plano completo quando o nível não vem", () => {
    const resultado = comandoTrilha("Python");
    expect(resultado.codigo).toBe(0);
    expect(resultado.saida).toContain("Básico");
    expect(resultado.saida).toContain("Intermediário");
    expect(resultado.saida).toContain("Módulos");
  });

  it("mostra um único nível", () => {
    const resultado = comandoTrilha("react", "basico");
    expect(resultado.codigo).toBe(0);
    expect(resultado.saida).toContain("React — Básico");
    expect(resultado.saida).not.toContain("Intermediário");
  });

  it("recusa tecnologia ausente na trilha", () => {
    const resultado = comandoTrilha("COBOL");
    expect(resultado.codigo).toBe(1);
    expect(resultado.saida).toContain("Python");
  });

  it("recusa nível ausente na trilha", () => {
    const resultado = comandoTrilha("Java", "lendario");
    expect(resultado.codigo).toBe(1);
    expect(resultado.saida).toContain("Básico");
  });

  it("pede a tecnologia da trilha", () => {
    expect(comandoTrilha().codigo).toBe(1);
  });

  it("gera o desafio do nível informado", () => {
    const resultado = comandoDesafio("Java", "Intermediario");
    expect(resultado.codigo).toBe(0);
    expect(resultado.saida).toContain("Catálogo de módulos");
    expect(resultado.saida).toContain("Intermediário");
  });

  it("pede tecnologia e nível no desafio", () => {
    expect(comandoDesafio().saida).toContain("Informe a tecnologia");
    expect(comandoDesafio("Python").saida).toContain("Informe o nível");
    expect(comandoDesafio("Go").codigo).toBe(1);
    expect(comandoDesafio("Go", "Básico").codigo).toBe(1);
    expect(comandoDesafio("Python", "lendario").codigo).toBe(1);
  });

  it("emite certificado com código estável", () => {
    const resultado = comandoCertificado("Ana Souza", "Python", undefined, { data: dataFixa });
    expect(resultado.codigo).toBe(0);
    expect(resultado.saida).toContain("Ana Souza");
    expect(resultado.saida).toContain("Python");
    expect(resultado.saida).toContain("Básico");
    expect(resultado.saida).toContain("14/10/2026");
    expect(resultado.saida).toContain(codigoCertificado("Ana Souza", "Python", "Básico"));
  });

  it("salva o certificado em markdown", () => {
    const destino = caminhoCertificado("Ana Souza", "Python", "Básico");
    rmSync(destino, { force: true });

    const resultado = comandoCertificado("Ana Souza", "python", "basico", {
      salvar: true,
      data: dataFixa,
    });

    expect(resultado.codigo).toBe(0);
    expect(resultado.saida).toContain(destino);
    expect(existsSync(destino)).toBe(true);
    expect(readFileSync(destino, "utf8")).toContain("Certificado Geo-Explorer");
    rmSync(destino, { force: true });
  });

  it("valida os dados do certificado", () => {
    expect(comandoCertificado().codigo).toBe(1);
    expect(comandoCertificado("Ana").codigo).toBe(1);
    expect(comandoCertificado("Ana", "Go").codigo).toBe(1);
    expect(comandoCertificado("Ana", "Java", "lendario").codigo).toBe(1);
  });

  it("formata data, slug e ajuda", () => {
    expect(formatarData(dataFixa)).toBe("14/10/2026");
    expect(slug("Ana Souza")).toBe("ana-souza");
    expect(textoAjuda()).toContain("certificado");
    expect(codigoCertificado("Ana", "Python", "Básico")).toMatch(/^GEO-PY-2026-\d{4}$/);
  });
});
