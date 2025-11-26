import { Prioridade } from "./Prioridade";

export interface Atividade {
    id: number,
    nome: string,
    descricao: string,
    prioridade: Prioridade
}