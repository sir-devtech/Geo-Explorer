import {
  comandoCertificado,
  comandoDesafio,
  comandoListar,
  comandoTrilha,
  textoAjuda,
} from "./comandos.js";
import type { Resultado } from "./tipos.js";

export interface Opcoes {
  comando: string;
  tecnologia?: string;
  nivel?: string;
  nome?: string;
  salvar: boolean;
}

function valorDaFlag(atual: string, nome: string, args: string[], indice: { i: number }): string | undefined {
  if (atual === nome) {
    const valor = args[indice.i + 1];
    if (valor === undefined || valor.startsWith("--")) {
      throw new Error(`Informe um valor para ${nome}.`);
    }
    indice.i += 1;
    return valor;
  }

  const prefixo = `${nome}=`;
  if (atual.startsWith(prefixo)) {
    const valor = atual.slice(prefixo.length);
    if (!valor) {
      throw new Error(`Informe um valor para ${nome}.`);
    }
    return valor;
  }

  return undefined;
}

export function interpretar(args: string[]): Opcoes {
  const posicionais: string[] = [];
  let tecnologia: string | undefined;
  let nivel: string | undefined;
  let nome: string | undefined;
  let salvar = false;
  const indice = { i: 0 };

  for (indice.i = 0; indice.i < args.length; indice.i += 1) {
    const atual = args[indice.i];
    if (atual === "--salvar") {
      salvar = true;
      continue;
    }

    const tecnologiaFlag = valorDaFlag(atual, "--tecnologia", args, indice);
    if (tecnologiaFlag !== undefined) {
      tecnologia = tecnologiaFlag;
      continue;
    }

    const nivelFlag = valorDaFlag(atual, "--nivel", args, indice);
    if (nivelFlag !== undefined) {
      nivel = nivelFlag;
      continue;
    }

    const nomeFlag = valorDaFlag(atual, "--nome", args, indice);
    if (nomeFlag !== undefined) {
      nome = nomeFlag;
      continue;
    }

    if (atual.startsWith("--")) {
      throw new Error(`Flag desconhecida: ${atual}.`);
    }

    posicionais.push(atual);
  }

  if (posicionais.length === 0) {
    throw new Error("Informe um comando.");
  }

  const comando = posicionais[0].replace(/^\//, "").toLowerCase();
  const resto = posicionais.slice(1);

  if (comando === "trilha" || comando === "desafio") {
    tecnologia ??= resto[0];
    nivel ??= resto[1];
    if (resto.length > 2) {
      throw new Error(`Argumentos demais para ${comando}.`);
    }
  } else if (comando === "certificado") {
    nome ??= resto[0];
    tecnologia ??= resto[1];
    nivel ??= resto[2];
    if (resto.length > 3) {
      throw new Error("Argumentos demais para certificado.");
    }
  } else if (comando === "listar") {
    if (resto.length > 0) {
      throw new Error("O comando listar não recebe argumentos.");
    }
  } else if (comando !== "ajuda" && comando !== "help") {
    throw new Error(`Comando desconhecido: ${comando}.`);
  }

  return { comando, tecnologia, nivel, nome, salvar };
}

export function executar(args: string[], data: Date = new Date()): Resultado {
  try {
    const opcoes = interpretar(args);

    if (opcoes.comando === "ajuda" || opcoes.comando === "help") {
      return { codigo: 0, saida: `${textoAjuda()}\n` };
    }

    if (opcoes.comando === "listar") {
      return comandoListar();
    }

    if (opcoes.comando === "trilha") {
      return comandoTrilha(opcoes.tecnologia, opcoes.nivel);
    }

    if (opcoes.comando === "desafio") {
      return comandoDesafio(opcoes.tecnologia, opcoes.nivel);
    }

    return comandoCertificado(opcoes.nome, opcoes.tecnologia, opcoes.nivel, {
      salvar: opcoes.salvar,
      data,
    });
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : "Falha ao executar o comando.";
    return { codigo: 1, saida: `${mensagem}\n\n${textoAjuda()}\n` };
  }
}
