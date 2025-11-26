import { DashboardResponseDto } from "@/lib/Interface/Dashboard";
import { ResponseDto } from "@/lib/Interface/Response";
import { MetodosHttp } from "@/lib/constants";
import { requisicaoBase } from "../requisicaoBase";

export default class DashboardRequisicao {
  private static readonly ENDPOINT: string = "/api/dashboard";

  static async buscarDashboard(): Promise<ResponseDto<DashboardResponseDto>> {
    return requisicaoBase(`${this.ENDPOINT}`, MetodosHttp.GET);
  }
}

