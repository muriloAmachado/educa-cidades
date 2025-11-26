export interface LoginRequisicaoDto {
  login: string;
  senha: string;
}

export interface LoginResponseDto {
  nome: string;
  perfil: string;
  tokenAcesso: {
    token: string;
    expiraEm: number;
  };
  tokenRenovacao: {
    token: string;
    expiraEm: number;
  };
}
