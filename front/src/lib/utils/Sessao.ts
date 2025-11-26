import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  email: string;
  nome: string;
  roles: string[];
  iat: number;
  exp: number;
}

export default class Sessao {
  static limparTodos = () => {
    if (typeof document === "undefined") return;

    const cookies = ["auth-token", "refresh-token", "user-role"];

    cookies.forEach((cookie) => {
      document.cookie = `${cookie}=; Max-Age=0; path=/`;
    });
  };

  static buscarTodos = () => {
    if (typeof document === "undefined") {
      return {};
    }

    const cookies = document.cookie
      .split("; ")
      .reduce((acc: Record<string, string>, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = value;
        return acc;
      }, {});
    return cookies;
  };

  static definirTokenAcesso = (token: string, expSegundos: number) => {
    if (token) {
      document.cookie = `auth-token=${token}; path=/; max-age=${expSegundos}`;
    }
  };

  static definirTokenRenovacao = (token: string, expSegundos: number) => {
    if (token) {
      document.cookie = `refresh-token=${token}; path=/; max-age=${expSegundos}`;
    }
  };

  static definirRole = (role: string, expSegundos: number) => {
    if (role) {
      document.cookie = `user-role=${role}; path=/; max-age=${expSegundos}`;
    }
  };

  static buscarTokenAcesso = () => {
    return this.buscarTodos()["auth-token"] || null;
  };

  static buscarTokenRenovacao = () => {
    return this.buscarTodos()["refresh-token"] || null;
  };

  static buscarRole = () => {
    return this.buscarTodos()["user-role"] || null;
  };

  static decodificarToken = (): JwtPayload | null => {
    try {
      const token = this.buscarTokenAcesso();
      if (!token) return null;
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      return null;
    }
  };

  static buscarEmailUsuario = (): string | null => {
    const payload = this.decodificarToken();
    return payload?.email || null;
  };

  static buscarNomeUsuario = (): string | null => {
    const payload = this.decodificarToken();
    return payload?.nome || null;
  };

  static buscarIdUsuario = (): string | null => {
    const payload = this.decodificarToken();
    return payload?.sub || null;
  };
}
