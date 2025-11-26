import { toast } from "sonner";

/**
 * Hook para exibir toasts baseado no statusCode da resposta HTTP
 * @param statusCode - Código de status HTTP (200, 201 = verde, outros = vermelho)
 * @param mensagem - Mensagem a ser exibida no toast (string ou objeto que será convertido)
 */
export function useToast() {
  const mostrarToast = (statusCode: number, mensagem: string | any) => {
    // Garante que a mensagem seja sempre uma string
    let mensagemString: string;
    if (typeof mensagem === 'string') {
      mensagemString = mensagem;
    } else if (mensagem?.message) {
      mensagemString = mensagem.message;
    } else if (mensagem?.error) {
      mensagemString = mensagem.error;
    } else if (typeof mensagem === 'object') {
      mensagemString = JSON.stringify(mensagem);
    } else {
      mensagemString = String(mensagem);
    }

    const isSuccess = statusCode === 200 || statusCode === 201;
    
    if (isSuccess) {
      toast.success(mensagemString);
    } else {
      toast.error(mensagemString);
    }
  };

  return { mostrarToast };
}

