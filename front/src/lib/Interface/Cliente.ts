export interface ClienteRequestDto {
  razaoSocial: string;
  cnpj: string;
  email: string;
  cidade: string;
  estado: string;
}

export interface ClienteResponseDto {
  id: number;
  codigo: string;
  razaoSocial: string;
  cnpj: string;
  email: string;
  cidade: string;
  estado: string;
  usuarioId?: number | null;
}