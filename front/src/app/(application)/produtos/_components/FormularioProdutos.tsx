"use client"
import FormularioGenerico, { CampoFormulario } from "@/app/_components/FormularioGenerico";
import api from "@/services/api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/lib/hooks/useToast";

const CAMPOS_FORMULARIO_PRODUTOS: CampoFormulario[] = [
    {
        name: "nome",
        label: "Nome",
        type: "text",
        placeholder: "Insira",
        required: true,
        maxLength: 100
    },
    {
        name: "descricao",
        label: "Descrição",
        type: 'text-area',
        placeholder: "Insira",
        required: true,
        maxLength: 5000
    },
]

interface FormularioProdutosProps {
    onSuccess?: () => void;
    produtoId?: number;
    valoresIniciais?: { nome: string; descricao: string };
}

export default function FormularioProdutos({ onSuccess, produtoId, valoresIniciais }: FormularioProdutosProps = {}) {

    const queryClient = useQueryClient();
    const isEditando = !!produtoId;
    const { mostrarToast } = useToast();

    const submit = async (dados: Record<string, unknown>) => {
        try {
            if (isEditando) {
                const response = await api.put(`api/v1/produtos/${produtoId}`, dados,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.status === 200 || response.status === 201) {
                    mostrarToast(response.status, "Produto atualizado com sucesso!");
                    queryClient.invalidateQueries({ queryKey: ['produtos'] });
                    
                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    mostrarToast(response.status, "Erro ao atualizar produto. Verifique os dados e tente novamente.");
                }
            } else {
                const response = await api.post('api/v1/produtos', dados,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.status === 200 || response.status === 201) {
                    mostrarToast(response.status, "Produto criado com sucesso!");
                    queryClient.invalidateQueries({ queryKey: ['produtos'] });
                    
                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    mostrarToast(response.status, "Erro ao criar produto. Verifique os dados e tente novamente.");
                }
            }
        } catch (error: any) {
            console.error("Erro no submit:", error);
            const statusCode = error?.response?.status || error?.statusCode || 500;
            const mensagem = error?.response?.data?.message || error?.message || "Erro ao salvar produto. Tente novamente.";
            mostrarToast(statusCode, mensagem);
        }
    }
  return (
    <div className="flex w-full justify-center">
        <div className="w-full max-w-md">
            <FormularioGenerico
                titulo={isEditando ? "Editar Produto" : "Criar Produto"}
                campos={CAMPOS_FORMULARIO_PRODUTOS}
                valoresIniciais={valoresIniciais || { nome: "" , descricao: ""}}
                onSubmit={submit}
            />
        </div>
    </div>
  );
}
