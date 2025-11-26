import { ResponseDto } from "@/lib/Interface/Response";
import { requisicaoBase } from "../requisicaoBase";
import { MetodosHttp } from "@/lib/constants";
import { ClienteRequestDto, ClienteResponseDto } from "@/lib/Interface/Cliente";
import { ClienteCreate } from "@/lib/Types/Cliente";

export default class ClienteRequisicao {
  private static readonly ENDPOINT: string = "/api/clientes";

  static async criar({ razaoSocial, cnpj, email, cidade, estado }: ClienteCreate): Promise<ResponseDto<void>> {
    const body = { razaoSocial, cnpj, email, cidade, estado };
    return requisicaoBase(this.ENDPOINT, MetodosHttp.POST, undefined, body);
  }

  static async buscarTodos(): Promise<ResponseDto<ClienteResponseDto[]>> {
    return requisicaoBase(`${this.ENDPOINT}`, MetodosHttp.GET);
  }

  static async buscarPorId(id: number): Promise<ResponseDto<ClienteResponseDto>> {
    return requisicaoBase(`${this.ENDPOINT}/${id}`, MetodosHttp.GET);
  }

  static async atualizar(id: number, { razaoSocial, cnpj, email, cidade, estado }: ClienteRequestDto): Promise<ResponseDto<ClienteResponseDto>> {
    const body = { razaoSocial, cnpj, email, cidade, estado };
    return requisicaoBase(`${this.ENDPOINT}/${id}`, MetodosHttp.PUT, undefined, body);
  }

  static async deletar(id: number): Promise<ResponseDto<null>> {
    return requisicaoBase(`${this.ENDPOINT}/${id}`, MetodosHttp.DELETE);
  }
}