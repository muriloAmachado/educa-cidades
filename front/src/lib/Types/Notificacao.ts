export interface NotificacaoUI {
  id: number;
  nome: string;
  texto: string;
  prazo?: string;
  projeto: string;
}

export interface NotificacaoProjeto {
  id: number;
  nome: string;
  objetivo: string;
  termino: string;
}

export interface NotificacaoTarefa {
  id: number;
  nome: string;
  descricao: string;
  prazo: string;
  projeto: {
    nome: string;
  };
}

export interface NotificacaoProduto {
  id: number;
  previsaoTermino: string;
  produto: {
    nome: string;
    descricao: string;
  };
  projeto: {
    nome: string;
  };
}
