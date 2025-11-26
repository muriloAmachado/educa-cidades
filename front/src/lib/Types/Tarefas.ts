import { Prioridade } from "./Prioridade";
import { Usuario } from "./Usuario";

export interface TarefaDTO{
    id: number,
    nome: string,
    descricao: string,
    prioridade: number,
    previsaoInicio: Date,
    previsaoTermino: Date
} 

export interface TarefaResponseDto{
    id: number,
    nome: string,
    descricao: string,
    prazo: Date,
    url: string,
    prioridade: keyof typeof Prioridade,
    inicio: Date,
    termino: Date,
    responsavel: Usuario,
    status: keyof typeof StatusTarefa
}

export const mapperDescricaoPrioridade: Record<keyof typeof Prioridade, Prioridade> = {
  "BAIXA": 0,
  "MEDIA": 1,
  "ALTA": 2,
}

export const mapperStatusParaNumero: Record<keyof typeof StatusTarefa, StatusTarefa> = {
  "NAO_INICIADA": 0,
  "EM_ANDAMENTO": 1,
  "PAUSADA": 2,
  "CONCLUIDA": 3,
}

export const mapperDescricaoStatus: Record<keyof typeof StatusTarefa, string> = {
  "NAO_INICIADA": "Não iniciada",
  "EM_ANDAMENTO": "Em andamento",
  "PAUSADA": "Pausada",
  "CONCLUIDA": "Concluída",
}

export enum StatusTarefa {
  NAO_INICIADA = 0,
  EM_ANDAMENTO = 1,
  PAUSADA = 2,
  CONCLUIDA = 3,
}

export interface TarefaCreateRequestDTO {
  idProjetoProduto: number | null;
  nome: string;
  descricao: string;
  url: string;
  prioridade: Prioridade;
  prazo: Date;
  idResponsavel: number | null;
  status?: StatusTarefa
}
