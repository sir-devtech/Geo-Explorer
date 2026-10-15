import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { BaseTrilhas, Trilha } from "./tipos.js";

const ORDEM_NIVEIS = ["basico", "intermediario", "avancado"];

export function normalizar(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function localizarDados(): string {
  const aqui = dirname(fileURLToPath(import.meta.url));
  const candidatos = [
    join(aqui, "..", "data", "trilhas.json"),
    join(aqui, "..", "..", "data", "trilhas.json"),
    join(process.cwd(), "data", "trilhas.json"),
  ];

  for (const caminho of candidatos) {
    if (existsSync(caminho)) {
      return caminho;
    }
  }

  throw new Error("Base de trilhas não encontrada em data/trilhas.json.");
}

export function carregarBase(): BaseTrilhas {
  const conteudo = readFileSync(localizarDados(), "utf8");
  return JSON.parse(conteudo) as BaseTrilhas;
}

export function raizDoProjeto(): string {
  return dirname(dirname(localizarDados()));
}

export function tecnologiasDisponiveis(base: BaseTrilhas = carregarBase()): string[] {
  const vistas = new Set<string>();
  const nomes: string[] = [];

  for (const trilha of base.trilhas) {
    const chave = normalizar(trilha.tecnologia);
    if (!vistas.has(chave)) {
      vistas.add(chave);
      nomes.push(trilha.tecnologia);
    }
  }

  return nomes;
}

export function niveisDaTecnologia(
  tecnologia: string,
  base: BaseTrilhas = carregarBase(),
): string[] {
  const chave = normalizar(tecnologia);
  const niveis = base.trilhas
    .filter((trilha) => normalizar(trilha.tecnologia) === chave)
    .map((trilha) => trilha.nivel);

  return [...niveis].sort((a, b) => {
    const posicaoA = ORDEM_NIVEIS.indexOf(normalizar(a));
    const posicaoB = ORDEM_NIVEIS.indexOf(normalizar(b));
    return posicaoA - posicaoB;
  });
}

export function buscarTrilhas(
  tecnologia: string,
  base: BaseTrilhas = carregarBase(),
): Trilha[] {
  const chave = normalizar(tecnologia);
  return base.trilhas.filter((trilha) => normalizar(trilha.tecnologia) === chave);
}

export function buscarTrilha(
  tecnologia: string,
  nivel: string,
  base: BaseTrilhas = carregarBase(),
): Trilha | undefined {
  const chaveNivel = normalizar(nivel);
  return buscarTrilhas(tecnologia, base).find(
    (trilha) => normalizar(trilha.nivel) === chaveNivel,
  );
}

export function cargaHoraria(trilha: Trilha): number {
  return trilha.modulos.reduce((total, modulo) => total + modulo.horas, 0);
}

export function listarAgrupado(base: BaseTrilhas = carregarBase()): Map<string, Trilha[]> {
  const grupos = new Map<string, Trilha[]>();

  for (const nome of tecnologiasDisponiveis(base)) {
    const trilhas = buscarTrilhas(nome, base).sort((a, b) => {
      return ORDEM_NIVEIS.indexOf(normalizar(a.nivel)) - ORDEM_NIVEIS.indexOf(normalizar(b.nivel));
    });
    grupos.set(nome, trilhas);
  }

  return grupos;
}
