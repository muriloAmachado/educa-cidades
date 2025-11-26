import { MetodosHttp } from "@/lib/constants";
import { ResponseDto } from "@/lib/Interface/Response";
import { requisicaoBase } from "./requisicaoBase";
import { ProdutoProjetoResponseDTO } from "@/lib/Types/Projetos";

export default class PrdutoProjetoRequisicao {
  private static readonly ENDPOINT: string = "/api/v1/produto-projeto";

  static async buscarPorProjetoProduto(projetoid: number, produtoId: number): Promise<ResponseDto<ProdutoProjetoResponseDTO>> {

    return requisicaoBase(`${this.ENDPOINT}/${projetoid}/produto/${produtoId}`, MetodosHttp.GET);
  }
}