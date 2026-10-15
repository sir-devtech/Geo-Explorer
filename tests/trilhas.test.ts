import { cargaHoraria, localizarDados, niveisDaTecnologia, normalizar, tecnologiasDisponiveis } from "../src/trilhas.js";
import { carregarBase, buscarTrilha, buscarTrilhas } from "../src/trilhas.js";

describe("base de trilhas", () => {
  it("normaliza acentos e caixa", () => {
    expect(normalizar("  Intermediário ")).toBe("intermediario");
  });

  it("encontra o arquivo de dados", () => {
    expect(localizarDados().endsWith("trilhas.json")).toBe(true);
  });

  it("lista as cinco tecnologias", () => {
    expect(tecnologiasDisponiveis()).toEqual([
      "Python",
      "JavaScript",
      "React",
      "Java",
      "TypeScript",
    ]);
  });

  it("ordena os níveis do básico ao avançado", () => {
    expect(niveisDaTecnologia("java")).toEqual(["Básico", "Intermediário", "Avançado"]);
  });

  it("não confunde Java com JavaScript", () => {
    expect(buscarTrilhas("Java").every((trilha) => trilha.tecnologia === "Java")).toBe(true);
    expect(buscarTrilhas("JavaScript").every((trilha) => trilha.tecnologia === "JavaScript")).toBe(true);
  });

  it("encontra trilha sem acento no nível", () => {
    const trilha = buscarTrilha("Python", "avancado");
    expect(trilha?.nivel).toBe("Avançado");
    expect(cargaHoraria(trilha!)).toBeGreaterThan(0);
  });

  it("devolve undefined para nível inexistente", () => {
    expect(buscarTrilha("Python", "lendario")).toBeUndefined();
  });

  it("carrega módulos e desafios", () => {
    const base = carregarBase();
    expect(base.trilhas.length).toBe(15);
    expect(base.trilhas[0].modulos.length).toBeGreaterThan(0);
    expect(base.trilhas[0].desafios.length).toBeGreaterThan(0);
  });
});
