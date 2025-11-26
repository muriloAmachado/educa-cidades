import { AxiosRequestConfig } from "axios";
import api from "@/server/axios";
import { ResponseDto } from "@/lib/Interface/Response";
import { Utils } from "@/lib/utils/utils";

const BASE_PATH = "http://localhost:8080";

export async function requisicaoBase<T, E>(
  endpoint: string,
  method: AxiosRequestConfig["method"],
  params?: Record<string, string>,
  body?: T
): Promise<ResponseDto<E>> {
  const url = `${BASE_PATH}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const tokenAcesso = Utils.Sessao.buscarTokenAcesso();
  if (tokenAcesso) {
    headers["Authorization"] = `Bearer ${tokenAcesso}`;
  }

  try {
    const response = await api({
      url,
      method,
      headers,
      withCredentials: true,
      params,
      data: body,
    });

    return { data: response.data, error: null, statusCode: response.status };
  } catch (error: any) {
    const status = error.response?.status || 500;

    if (status === 401) {
      const renovado = await renovarToken();

      if (renovado) {
        const novoTokenAcesso = Utils.Sessao.buscarTokenAcesso();

        if (novoTokenAcesso) {
          headers["Authorization"] = `Bearer ${novoTokenAcesso}`;
          const retryResponse = await api({
            url,
            method,
            headers,
            withCredentials: true,
            params,
            data: body,
          });
          return { data: retryResponse.data, error: null, statusCode: retryResponse.status };
        }
      }

      Utils.Sessao.limparTodos();
      return { data: null, error: "Sessão expirada. Faça login novamente.", statusCode: 401 };
    }

    // Converte o erro para string se for um objeto
    let errorMessage: string;
    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else {
        errorMessage = JSON.stringify(error.response.data);
      }
    } else {
      errorMessage = error.message || "Erro desconhecido";
    }

    return { data: null, error: errorMessage, statusCode: error.response?.status || 500 };
  }
}

async function renovarToken(): Promise<boolean> {
  const tokenRenovacao = Utils.Sessao.buscarTokenRenovacao();
  if (!tokenRenovacao) return false;

  try {
    const response = await api.post(`${BASE_PATH}/api/token`, {
      tokenRenovacao: tokenRenovacao,
    });

    const novoTokenAcesso = response.data?.token;
    const expiraEm = response.data?.expiraEm;
    if (!novoTokenAcesso) return false;

    Utils.Sessao.definirTokenAcesso(novoTokenAcesso, expiraEm);
    return true;
  } catch {
    return false;
  }
}

export async function requisicaoDownload(
  endpoint: string,
  method: AxiosRequestConfig["method"],
  body?: any
): Promise<Blob> {
  const url = `${BASE_PATH}${endpoint}`;

  const headers: Record<string, string> = {};

  const tokenAcesso = Utils.Sessao.buscarTokenAcesso();
  if (tokenAcesso) {
    headers["Authorization"] = `Bearer ${tokenAcesso}`;
  }

  const config: AxiosRequestConfig = {
    url,
    method,
    headers,
    responseType: "blob"
  };

  const response = await api(config);
  return response.data;
}

