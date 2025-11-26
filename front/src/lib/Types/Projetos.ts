import { ClienteResponseDto } from "../Interface/Cliente"
import { Prioridade } from "./Prioridade"

export interface ProjetoResponseDto {
  id: number
  nome: string
  objetivo: string
  inicio: Date
  termino: Date
  status: StatusProjetos
  dataCriacao: Date
  cliente: ClienteResponseDto
} 

export interface ProjetoRequestDto {
    nome: string,
    objetivo: string,
    inicio?: Date,
    termino?: Date,
    idCliente?: number
}

export interface ProdutoProjetoRequestDto{
    idProduto: number,
    prioridadeValue: number,
    previsaoInicio: Date,
    previsaoTermino: Date
}

export interface ProdutoProjetoResponseDTO {
  id: number;
  produto: Produto;
  prioridade: keyof typeof Prioridade;
  previsaoInicio: Date;
  previsaoTermino: Date;
}

export enum StatusProjetos {
  NAO_INICIADO = "NAO_INICIADO",
  EM_ANDAMENTO = "EM_ANDAMENTO",
  PAUSADO = "PAUSADO",
  CONCLUIDO = "CONCLUIDO"
}

export const StatusProjetoDescricao: Record<StatusProjetos, string> = {
   [StatusProjetos.NAO_INICIADO] : "Não iniciado",
  [StatusProjetos.EM_ANDAMENTO] : "Em andamento",
  [StatusProjetos.PAUSADO] : "Pausado",
  [StatusProjetos.CONCLUIDO] : "Concluído" 
}