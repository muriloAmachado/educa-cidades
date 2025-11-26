export interface Usuario {
  id: number;
  nome: string;
  email: string;
  login: string;
  perfil: string;
  status: string;
}

export interface UsuarioResumo {
  id: number;
  nome: string;
}

export interface UsuarioUpdate {
  nome: string;
  email: string;
  login?: string;
  perfil: string;
  status: string;
}
