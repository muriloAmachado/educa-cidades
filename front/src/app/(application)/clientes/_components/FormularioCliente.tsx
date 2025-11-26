"use client";

import FormularioGenerico, {
  CampoFormulario,
} from "@/app/_components/FormularioGenerico";
import { useCidades, useEstados } from "@/hooks/useLocalidade";
import { Clientes } from "@/server/modulos";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useToast } from "@/lib/hooks/useToast";
import { limparDocumento } from "@/lib/utils/validadores";

interface FormularioClientesProps {
  onSuccess?: () => void;
  clienteId?: number;
  valoresIniciais?: {
    razaoSocial: string;
    cnpj: string;
    email: string;
    cidade: string;
    estado: string;
  };
}

export default function FormularioClientes({ onSuccess, clienteId, valoresIniciais }: FormularioClientesProps = {}) {
  const queryClient = useQueryClient();
  const { data: estados = [] } = useEstados();
  const [estadoSelecionado, setEstadoSelecionado] = useState<string | undefined>(valoresIniciais?.estado);
  const { data: cidades = [] } = useCidades(estadoSelecionado);
  const isEditando = !!clienteId;
  const { mostrarToast } = useToast();

  useEffect(() => {
    if (valoresIniciais?.estado) {
      setEstadoSelecionado(valoresIniciais.estado);
    }
  }, [valoresIniciais?.estado]);

  const CAMPOS_FORMULARIO_CLIENTES: CampoFormulario[] = [
    {
      name: "razaoSocial",
      label: "Razão Social",
      type: "text",
      placeholder: "Insira a razão social",
      required: true,
      maxLength: 300,
    },
    {
      name: "cnpj",
      label: "CNPJ",
      type: "cnpj",
      placeholder: "Insira o CNPJ",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Insira o email",
      required: true,
      maxLength: 100,
      tooltip: "Usaremos este email para informar o cliente sobre novas solicitações de documentos ou interações.",
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      placeholder: "Selecione o estado",
      required: true,
      options: estados,
      largura: "half",
    },
    {
      name: "cidade",
      label: "Cidade",
      type: "select",
      placeholder: "Selecione a cidade",
      required: true,
      options: cidades,
      largura: "half",
    },
  ];

  const submit = async (dados: Record<string, any>) => {
    try {
      const { razaoSocial, cnpj, email, cidade, estado } = dados;
      
      // Remove máscara do CNPJ antes de enviar
      const cnpjLimpo = limparDocumento(String(cnpj || ""));

      if (isEditando) {
        const response = await Clientes.Cliente.atualizar(clienteId!, { razaoSocial, cnpj: cnpjLimpo, email, cidade, estado });
        
        if (response.statusCode === 200 || response.statusCode === 201 || response.statusCode === 204) {
          mostrarToast(200, "Cliente atualizado com sucesso!");
          queryClient.invalidateQueries({ queryKey: ["clientes"] });
          if (onSuccess) {
            onSuccess();
          }
        } else {
          mostrarToast(response.statusCode, response.error || "Erro ao atualizar cliente. Verifique os dados e tente novamente.");
        }
      } else {
        const response = await Clientes.Cliente.criar({ razaoSocial, cnpj: cnpjLimpo, email, cidade, estado });
        
        if (response.statusCode === 200 || response.statusCode === 201) {
          mostrarToast(response.statusCode, "Cliente criado com sucesso!");
          queryClient.invalidateQueries({ queryKey: ["clientes"] });
          if (onSuccess) {
            onSuccess();
          }
        } else {
          mostrarToast(response.statusCode, response.error || "Erro ao criar cliente. Verifique os dados e tente novamente.");
        }
      }
    } catch (error: any) {
      console.error("Erro no submit:", error);
      const statusCode = error?.response?.status || error?.statusCode || 500;
      const mensagem = error?.response?.data?.message || error?.message || "Erro ao salvar cliente. Tente novamente.";
      mostrarToast(statusCode, mensagem);
    }
  };

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-md">
        <FormularioGenerico
          titulo={isEditando ? "Editar Cliente" : "Criar Cliente"}
          campos={CAMPOS_FORMULARIO_CLIENTES}
          valoresIniciais={valoresIniciais || {}}
          onSubmit={submit}
          acoesExtras={{
            estado: setEstadoSelecionado,
          }}
        />
      </div>
    </div>
  );
}
