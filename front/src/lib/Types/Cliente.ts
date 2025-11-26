export interface Cliente {
  id: number;
  codigo: string;
  razaoSocial: string;
  cnpj: string;
  email: string;
  cidade: string;
  estado: string;
}

export interface ClienteCreate {
  razaoSocial: string;
  cnpj: string;
  email: string;
  cidade: string;
  estado: string;
}