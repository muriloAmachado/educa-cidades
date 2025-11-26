import { Utils } from "@/lib/utils/utils";
import { requisicaoBase } from "../requisicaoBase";
import { LoginRequisicaoDto, LoginResponseDto } from "@/lib/Interface/Login";
import { MetodosHttp } from "@/lib/constants";
import { ResponseDto } from "@/lib/Interface/Response";

export default class LoginRequisicao {
  private static readonly ENDPOINT = "/api/login";

  static async login({ login, senha }: LoginRequisicaoDto): Promise<ResponseDto<LoginResponseDto>> {
    const { definirTokenAcesso, definirTokenRenovacao, definirRole } = Utils.Sessao;

    try {
      const body: LoginRequisicaoDto = { login, senha };
      
      const response = await requisicaoBase<LoginRequisicaoDto, LoginResponseDto>(
        this.ENDPOINT,
        MetodosHttp.POST,
        undefined,
        body
      );

      if (response.error || !response.data) {
        return {
          data: response.data,
          error: response.error ?? "Dados de resposta não encontrados",
          statusCode: response.statusCode,
        };
      }

      const { tokenAcesso, tokenRenovacao, perfil } = response.data;
      definirTokenAcesso(tokenAcesso.token, tokenAcesso.expiraEm);
      definirTokenRenovacao(tokenRenovacao.token, tokenRenovacao.expiraEm);
      definirRole(perfil, tokenRenovacao.expiraEm);

      return {
        data: response.data,
        error: null,
        statusCode: response.statusCode,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Erro desconhecido",
        statusCode: error.statusCode || 500,
      };
    }
  }
}
