import { ResponseDto } from "@/lib/Interface/Response";
import { TarefaCreateRequestDTO, TarefaResponseDto } from "@/lib/Types/Tarefas";
import api from "@/services/api";
import { requisicaoBase } from "./requisicaoBase";
import { MetodosHttp } from "@/lib/constants";
import { unknown } from "zod";



export default class TarefasRequisicao {
  private static readonly ENDPOINT: string = "/api/tarefas";

  static async criar(body: TarefaCreateRequestDTO): Promise<ResponseDto<void>> {
    return requisicaoBase(`${this.ENDPOINT}`, MetodosHttp.POST, undefined, body);
  }

  static async atualizar(tarefaId: number, body: TarefaCreateRequestDTO): Promise<ResponseDto<void>> {
    return requisicaoBase(`${this.ENDPOINT}/${tarefaId}`, MetodosHttp.PUT, undefined, body);
  }

  static async excluir(tarefaId: number): Promise<ResponseDto<void>> {
    return requisicaoBase(`${this.ENDPOINT}/${tarefaId}`, MetodosHttp.DELETE);
  }

  static async buscarTodos(): Promise<ResponseDto<TarefaResponseDto[]>> {
    return api.get(this.ENDPOINT).then((response) => response.data);
  }

  static async bucarTarefasPorProjetoProduto(produtoProjetoId: number): Promise<ResponseDto<TarefaResponseDto[]>> {
    return requisicaoBase(`${this.ENDPOINT}/produto/${produtoProjetoId}`, MetodosHttp.GET);
  }

  static async definirPadrao(tarefaId: number): Promise<ResponseDto<void>> {
    return requisicaoBase(`${this.ENDPOINT}/${tarefaId}/criar-atividade`, MetodosHttp.POST);
  }

}