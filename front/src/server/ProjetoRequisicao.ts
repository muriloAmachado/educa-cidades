import { ResponseDto } from "@/lib/Interface/Response";
import { MetodosHttp } from "@/lib/constants";
import { ProdutoProjetoRequestDto, ProdutoProjetoResponseDTO, ProjetoRequestDto, ProjetoResponseDto } from "@/lib/Types/Projetos";
import { requisicaoBase } from "./requisicaoBase";
import { Usuario, UsuarioResumo } from "@/lib/Types/Usuario";

export default class ProjetoRequisicao {
  private static readonly ENDPOINT: string = "/api/v1/projetos";

  static async criar(projeto: ProjetoRequestDto): Promise<ResponseDto<void>> {
    
    const body = {
        idCliente: projeto.idCliente,
        nome: projeto.nome,
        inicio: projeto.inicio,
        termino: projeto.termino,
        objetivo: projeto.objetivo
    }

    return requisicaoBase(this.ENDPOINT, MetodosHttp.POST, undefined, body);
  }

  static async excluirProjeto(projetoId: number): Promise<ResponseDto<void>>{
    return requisicaoBase(`${this.ENDPOINT}/${projetoId}`, MetodosHttp.DELETE)
  }

  static async buscarTodos(): Promise<ResponseDto<ProjetoResponseDto[]>> {
    return requisicaoBase(`${this.ENDPOINT}`, MetodosHttp.GET);
  }

  static async buscarProdutos(id: number): Promise<ResponseDto<ProdutoProjetoResponseDTO[]>> {
    return requisicaoBase(`${this.ENDPOINT}/${id}/produtos`, MetodosHttp.GET);
  }

  static async incluirProduto(projetoId: number, produto: ProdutoProjetoRequestDto): Promise<ResponseDto<void>>{
    return requisicaoBase(`${this.ENDPOINT}/${projetoId}`, MetodosHttp.POST, undefined, produto)
  }

  static async excluirProduto(projetoId: number, produtoId: number): Promise<ResponseDto<void>>{
    return requisicaoBase(`${this.ENDPOINT}/${projetoId}/produtos/${produtoId}`, MetodosHttp.DELETE)
  }

  static async buscarPorId(id: number): Promise<ResponseDto<ProjetoResponseDto>> {
    return requisicaoBase(`${this.ENDPOINT}/${id}`, MetodosHttp.GET);
  }

  static async atualizar(id: number, { nome, objetivo }: { nome: string; objetivo: string }): Promise<ResponseDto<ProjetoResponseDto>> {
    const body = { nome, objetivo };
    return requisicaoBase(`${this.ENDPOINT}/${id}`, MetodosHttp.PUT, undefined, body);
  }

  static async deletar(id: number): Promise<ResponseDto<null>> {
    return requisicaoBase(`${this.ENDPOINT}/${id}`, MetodosHttp.DELETE);
  }

  static async buscarMeusProjetos(): Promise<ResponseDto<ProjetoResponseDto[]>> {
    return requisicaoBase(`${this.ENDPOINT}/meus-projetos`, MetodosHttp.GET);
  }

  static async buscarUsuario(projetoId: number): Promise<ResponseDto<UsuarioResumo[]>> {
    return requisicaoBase(`${this.ENDPOINT}/${projetoId}/usuarios`, MetodosHttp.GET);
  }

  static async incluirUsuario(projetoId: number, usuarioId: number): Promise<ResponseDto<void>>{
    return requisicaoBase(`${this.ENDPOINT}/${projetoId}/responsaveis/${usuarioId}`, MetodosHttp.POST)
  }

  static async removerUsuario(projetoId: number, usuarioId: number): Promise<ResponseDto<void>>{
    return requisicaoBase(`${this.ENDPOINT}/${projetoId}/responsaveis/${usuarioId}`, MetodosHttp.DELETE)
  }
}