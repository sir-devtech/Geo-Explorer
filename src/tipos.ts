export interface Modulo {
  titulo: string;
  topicos: string[];
  horas: number;
}

export interface Desafio {
  titulo: string;
  enunciado: string;
  dica: string;
}

export interface Trilha {
  tecnologia: string;
  nivel: string;
  descricao: string;
  modulos: Modulo[];
  desafios: Desafio[];
}

export interface BaseTrilhas {
  trilhas: Trilha[];
}

export interface Resultado {
  codigo: number;
  saida: string;
}
