import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Resultado, Trilha } from "./tipos.js";
import {
  buscarTrilha,
  buscarTrilhas,
  cargaHoraria,
  listarAgrupado,
  niveisDaTecnologia,
  normalizar,
  raizDoProjeto,
  tecnologiasDisponiveis,
} from "./trilhas.js";

export function formatarData(data: Date): string {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

export function codigoCertificado(nome: string, tecnologia: string, nivel: string): string {
  const base = `${normalizar(nome)}|${normalizar(tecnologia)}|${normalizar(nivel)}`;
  let hash = 0;

  for (const caractere of base) {
    hash = (Math.imul(hash, 31) + caractere.charCodeAt(0)) >>> 0;
  }

  const sigla = normalizar(tecnologia).slice(0, 2).toUpperCase();
  return `GEO-${sigla}-2026-${String(hash % 10000).padStart(4, "0")}`;
}

export function slug(valor: string): string {
  return normalizar(valor)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function erro(mensagem: string): Resultado {
  return { codigo: 1, saida: mensagem.endsWith("\n") ? mensagem : `${mensagem}\n` };
}

function ok(mensagem: string): Resultado {
  return { codigo: 0, saida: mensagem.endsWith("\n") ? mensagem : `${mensagem}\n` };
}

function textoTecnologias(): string {
  return tecnologiasDisponiveis().join(", ");
}

export function comandoListar(): Resultado {
  const linhas = ["Trilhas disponíveis", ""];

  for (const [tecnologia, trilhas] of listarAgrupado()) {
    linhas.push(tecnologia);
    for (const trilha of trilhas) {
      linhas.push(`  - ${trilha.nivel} (${cargaHoraria(trilha)}h) — ${trilha.descricao}`);
    }
    linhas.push("");
  }

  return ok(linhas.join("\n").trimEnd());
}

function detalharTrilha(trilha: Trilha): string[] {
  const linhas = [
    `${trilha.tecnologia} — ${trilha.nivel}`,
    trilha.descricao,
    `Carga horária: ${cargaHoraria(trilha)}h`,
    "",
    "Módulos",
  ];

  trilha.modulos.forEach((modulo, indice) => {
    linhas.push(`${indice + 1}. ${modulo.titulo} (${modulo.horas}h)`);
    for (const topico of modulo.topicos) {
      linhas.push(`   - ${topico}`);
    }
  });

  return linhas;
}

export function comandoTrilha(tecnologia?: string, nivel?: string): Resultado {
  if (!tecnologia) {
    return erro(`Informe a tecnologia. Opções: ${textoTecnologias()}.`);
  }

  const encontradas = buscarTrilhas(tecnologia);
  if (encontradas.length === 0) {
    return erro(`Tecnologia não encontrada: ${tecnologia}. Opções: ${textoTecnologias()}.`);
  }

  if (!nivel) {
    const blocos = encontradas
      .slice()
      .sort((a, b) => niveisDaTecnologia(tecnologia).indexOf(a.nivel) - niveisDaTecnologia(tecnologia).indexOf(b.nivel))
      .map((trilha) => detalharTrilha(trilha).join("\n"));
    return ok([`Plano de estudos: ${encontradas[0].tecnologia}`, "", blocos.join("\n\n")].join("\n"));
  }

  const trilha = buscarTrilha(tecnologia, nivel);
  if (!trilha) {
    const niveis = niveisDaTecnologia(tecnologia).join(", ");
    return erro(`Nível não encontrado para ${encontradas[0].tecnologia}: ${nivel}. Opções: ${niveis}.`);
  }

  return ok(["Plano de estudos", "", ...detalharTrilha(trilha)].join("\n"));
}

export function comandoDesafio(tecnologia?: string, nivel?: string): Resultado {
  if (!tecnologia) {
    return erro(`Informe a tecnologia. Opções: ${textoTecnologias()}.`);
  }

  if (!nivel) {
    const encontradas = buscarTrilhas(tecnologia);
    if (encontradas.length === 0) {
      return erro(`Tecnologia não encontrada: ${tecnologia}. Opções: ${textoTecnologias()}.`);
    }
    const niveis = niveisDaTecnologia(tecnologia).join(", ");
    return erro(`Informe o nível de ${encontradas[0].tecnologia}. Opções: ${niveis}.`);
  }

  const trilha = buscarTrilha(tecnologia, nivel);
  if (!trilha) {
    const encontradas = buscarTrilhas(tecnologia);
    if (encontradas.length === 0) {
      return erro(`Tecnologia não encontrada: ${tecnologia}. Opções: ${textoTecnologias()}.`);
    }
    const niveis = niveisDaTecnologia(tecnologia).join(", ");
    return erro(`Nível não encontrado para ${encontradas[0].tecnologia}: ${nivel}. Opções: ${niveis}.`);
  }

  const desafio = trilha.desafios[0];
  if (!desafio) {
    return erro(`Nenhum desafio cadastrado para ${trilha.tecnologia} — ${trilha.nivel}.`);
  }

  const linhas = [
    `Desafio: ${desafio.titulo}`,
    `Tecnologia: ${trilha.tecnologia}`,
    `Nível: ${trilha.nivel}`,
    "",
    "Enunciado",
    desafio.enunciado,
    "",
    "Dica",
    desafio.dica,
  ];

  return ok(linhas.join("\n"));
}

export function textoCertificado(
  nome: string,
  trilha: Trilha,
  data: Date,
): { texto: string; codigo: string } {
  const codigo = codigoCertificado(nome, trilha.tecnologia, trilha.nivel);
  const texto = [
    "# Certificado Geo-Explorer",
    "",
    `Certificamos que **${nome}** concluiu a trilha **${trilha.tecnologia}** no nível **${trilha.nivel}**.`,
    "",
    `Carga horária: ${cargaHoraria(trilha)}h`,
    `Data: ${formatarData(data)}`,
    `Código de validação: ${codigo}`,
    "",
    "Certificado fictício emitido para fins de estudo e portfólio.",
  ].join("\n");

  return { texto, codigo };
}

export function caminhoCertificado(nome: string, tecnologia: string, nivel: string): string {
  const pasta = join(raizDoProjeto(), "docs", "certificados-emitidos");
  return join(pasta, `certificado-${slug(nome)}-${slug(tecnologia)}-${slug(nivel)}.md`);
}

export function comandoCertificado(
  nome?: string,
  tecnologia?: string,
  nivel?: string,
  opcoes: { salvar?: boolean; data?: Date } = {},
): Resultado {
  if (!nome) {
    return erro("Informe o nome de quem concluiu a trilha.");
  }

  if (!tecnologia) {
    return erro(`Informe a tecnologia. Opções: ${textoTecnologias()}.`);
  }

  const nivelEscolhido = nivel ?? "Básico";
  const trilha = buscarTrilha(tecnologia, nivelEscolhido);
  if (!trilha) {
    const encontradas = buscarTrilhas(tecnologia);
    if (encontradas.length === 0) {
      return erro(`Tecnologia não encontrada: ${tecnologia}. Opções: ${textoTecnologias()}.`);
    }
    const niveis = niveisDaTecnologia(tecnologia).join(", ");
    return erro(`Nível não encontrado para ${encontradas[0].tecnologia}: ${nivelEscolhido}. Opções: ${niveis}.`);
  }

  const { texto } = textoCertificado(nome, trilha, opcoes.data ?? new Date());
  if (!opcoes.salvar) {
    return ok(texto);
  }

  const destino = caminhoCertificado(nome, trilha.tecnologia, trilha.nivel);
  mkdirSync(join(raizDoProjeto(), "docs", "certificados-emitidos"), { recursive: true });
  writeFileSync(destino, `${texto}\n`, "utf8");
  return ok(`${texto}\n\nArquivo salvo em ${destino}`);
}

export function textoAjuda(): string {
  return [
    "Geo-Explorer",
    "",
    "Comandos:",
    "  listar",
    "  trilha <tecnologia> [nivel]",
    "  desafio <tecnologia> <nivel>",
    "  certificado <nome> <tecnologia> [nivel]",
    "",
    "Flags: --tecnologia, --nivel, --nome, --salvar",
    `Tecnologias: ${textoTecnologias()}.`,
    "Níveis: Básico, Intermediário, Avançado.",
  ].join("\n");
}
