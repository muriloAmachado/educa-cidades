"use client";

import FormularioGenerico, {
  CampoFormulario,
} from "@/app/_components/FormularioGenerico";
import { UsuarioCreateDto } from "@/lib/Interface/Usuario";
import { UsuarioUpdate } from "@/lib/Types/Usuario";
import { Usuarios } from "@/server/modulos";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/lib/hooks/useToast";

interface FormularioUsuariosProps {
  onSuccess?: () => void;
  usuarioId?: number;
  valoresIniciais?: {
    nome: string;
    email: string;
    login: string;
    perfil: string;
    status: string;
  };
}

export default function FormularioUsuarios({ onSuccess, usuarioId, valoresIniciais }: FormularioUsuariosProps = {}) {
  const queryClient = useQueryClient();
  const isEditando = !!usuarioId;
  const { mostrarToast } = useToast();

  const CAMPOS_FORMULARIO_USUARIOS: CampoFormulario[] = [
    {
      name: "nome",
      label: "Nome",
      type: "text",
      placeholder: "Insira o nome",
      required: true,
      maxLength: 100,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Insira o email",
      required: true,
      maxLength: 100,
    },
    ...(isEditando ? [] : [{
      name: "login",
      label: "Login",
      type: "text",
      placeholder: "Insira o login",
      required: true,
      maxLength: 50,
    } as CampoFormulario]),
    ...(isEditando ? [] : [{
      name: "senha",
      label: "Senha",
      type: "password-strong",
      placeholder: "Insira a senha (mín. 8 caracteres, maiúscula, número e especial)",
      required: true,
      maxLength: 128,
      tooltip: "A senha deve ter no mínimo 8 caracteres, contendo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
    } as CampoFormulario]),
    ...(isEditando ? [] : [{
      name: "confirmarSenha",
      label: "Confirmar Senha",
      type: "password",
      placeholder: "Confirme a senha",
      required: true,
      maxLength: 128,
    } as CampoFormulario]),
    {
      name: "perfil",
      label: "Perfil",
      type: "select",
      placeholder: "Selecione o perfil",
      required: true,
      options: [
        { value: "ADMIN", label: "Administrador" },
        { value: "BASICO", label: "Básico" },
        { value: "EXTERNO", label: "Externo" },
      ],
    },
    ...(isEditando ? [{
      name: "status",
      label: "Status",
      type: "select",
      placeholder: "Selecione o status",
      required: true,
      options: [
        { value: "ATIVO", label: "Ativo" },
        { value: "INATIVO", label: "Inativo" },
      ],
    } as CampoFormulario] : []),
  ];

  const submit = async (dados: Record<string, unknown>) => {
    try {
      if (isEditando) {
        const { nome, email, perfil, status } = dados;

        const payload: UsuarioUpdate = {
          nome: String(nome ?? ""),
          email: String(email ?? ""),
          status: String(status ?? ""),
          perfil: String(perfil ?? ""),
        };
        
        const response = await Usuarios.Usuario.atualizar(usuarioId!, payload);
        
        if (response.statusCode === 200 || response.statusCode === 201 || response.statusCode === 204) {
          mostrarToast(200, "Usuário atualizado com sucesso!");
          queryClient.invalidateQueries({ queryKey: ["usuarios"] });
          if (onSuccess) {
            onSuccess();
          }
        } else {
          mostrarToast(response.statusCode, response.error || "Erro ao atualizar usuário. Verifique os dados e tente novamente.");
        }
      } else {
        const { nome, email, login, senha, confirmarSenha, perfil } = dados;

        if (senha !== confirmarSenha) {
          mostrarToast(400, "As senhas não coincidem.");
          return;
        }

        const payload: UsuarioCreateDto = {
          nome: String(nome ?? ""),
          email: String(email ?? ""),
          login: String(login ?? ""),
          senha: String(senha ?? ""),
          perfil: String(perfil ?? ""),
        };

        const response = await Usuarios.Usuario.criar(payload);
        
        if (response.statusCode === 200 || response.statusCode === 201) {
          mostrarToast(response.statusCode, "Usuário criado com sucesso!");
          queryClient.invalidateQueries({ queryKey: ["usuarios"] });
          if (onSuccess) {
            onSuccess();
          }
        } else {
          mostrarToast(response.statusCode, response.error || "Erro ao criar usuário. Verifique os dados e tente novamente.");
        }
      }
    } catch (error: any) {
      console.error("Erro no submit:", error);
      const statusCode = error?.response?.status || error?.statusCode || 500;
      const mensagem = error?.response?.data?.message || error?.message || "Erro ao salvar usuário. Tente novamente.";
      mostrarToast(statusCode, mensagem);
    }
  };

  const valoresIniciaisForm = isEditando 
    ? {
        nome: valoresIniciais?.nome || "",
        email: valoresIniciais?.email || "",
        perfil: valoresIniciais?.perfil || "",
        status: valoresIniciais?.status || "ATIVO",
      }
    : {
        nome: "",
        email: "",
        login: "",
        senha: "",
        confirmarSenha: "",
        perfil: "",
      };

  return (
    <div className="flex w-full">
      <div className="flex w-full">
        <FormularioGenerico
          titulo={isEditando ? "Editar Usuário" : "Criar Usuário"}
          campos={CAMPOS_FORMULARIO_USUARIOS}
          valoresIniciais={valoresIniciaisForm}
          onSubmit={submit}
        />
      </div>
    </div>
  );
}
