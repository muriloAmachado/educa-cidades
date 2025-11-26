import { ResponseDto } from "@/lib/Interface/Response";
import { UsuarioCreateDto } from "@/lib/Interface/Usuario";
import { requisicaoBase } from "../requisicaoBase";
import { MetodosHttp } from "@/lib/constants";
import { Usuario, UsuarioResumo, UsuarioUpdate } from "@/lib/Types/Usuario";

export default class UsuarioRequisicao {
  private static readonly ENDPOINT: string = "/api/usuarios";

  static async criar(usuario: UsuarioCreateDto): Promise<ResponseDto<void>> {
    return requisicaoBase(
      `${this.ENDPOINT}`,
      MetodosHttp.POST,
      undefined,
      usuario
    );
  }

  static async atualizar(
    id: number,
    usuario: UsuarioUpdate
  ): Promise<ResponseDto<void>> {
    return requisicaoBase(
      `${this.ENDPOINT}/${id}`,
      MetodosHttp.PUT,
      undefined,
      usuario
    );
  }

  static async buscarTodos(): Promise<ResponseDto<Usuario[]>> {
    return requisicaoBase(`${this.ENDPOINT}`, MetodosHttp.GET);
  }

  static async excluir(id: number): Promise<ResponseDto<void>> {
    return requisicaoBase(`${this.ENDPOINT}/${id}`, MetodosHttp.DELETE);
  }

  static async buscarUsuariosResumidos(): Promise<ResponseDto<UsuarioResumo[]>> {
    return requisicaoBase(`${this.ENDPOINT}/resumo`, MetodosHttp.GET);
  }
}
