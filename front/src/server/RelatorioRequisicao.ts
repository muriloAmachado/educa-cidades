import { MetodosHttp } from "@/lib/constants";
import { requisicaoDownload } from "./requisicaoBase";

export default class ProjetoRequisicao {
  private static readonly ENDPOINT: string = "/api/relatorios";

  static async baixar(id: number): Promise<Blob> {
    return requisicaoDownload(`${this.ENDPOINT}/${id}`, MetodosHttp.GET);
  }
}