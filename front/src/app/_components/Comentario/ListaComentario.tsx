"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Pencil, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Sessao from "@/lib/utils/Sessao";

export interface Usuario {
  id: number;
  nome: string;
  login: string;
}

export interface ComentarioResponseDTO {
  id: number;
  texto: string;
  usuario: Usuario | null;
  visibilidade: "VISIVEL" | "OCULTO";
  dataCriacao: string;
}

export interface ComentarioRequestDTO {
  texto: string;
  usuarioId: number;
  tarefaId: number | null;
  projetoId: number | null;
}

interface ListaComentarioProps {
  estruturaId: number;
  tipo: "tarefa" | "projeto";
  setNaoLidas?: (n: number) => void;
}

export default function ListaComentario({
  estruturaId,
  tipo,
  setNaoLidas,
}: ListaComentarioProps) {
  const [comentarios, setComentarios] = useState<ComentarioResponseDTO[]>([]);
  const [texto, setTexto] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [hoverId, setHoverId] = useState<number | null>(null);

  const usuarioId = Number(Sessao.buscarIdUsuario());
  const role = Sessao.buscarRole();
  const isAdmin = role !== "Externo";

  const auth = {
    headers: { Authorization: `Bearer ${Sessao.buscarTokenAcesso()}` },
  };

  // ============================
  // CARREGAR COMENTÁRIOS
  // ============================
  const carregar = async () => {
    try {
      const url =
        tipo === "projeto"
          ? `http://localhost:8080/api/comentario/projeto/${estruturaId}/comentarios`
          : `http://localhost:8080/api/comentario/tarefa/${estruturaId}/comentarios`;

      const res = await axios.get<ComentarioResponseDTO[]>(url, auth);

      const comentariosComUsuario = res.data.map((c) => {
        console.log("Comentário recebido:", c);
        return {
          ...c,
          visibilidade: c.visibilidade ?? "VISIVEL",
          usuario: c.usuario ?? { id: 0, nome: "Usuário desconhecido", login: "" },
        };
      });

      setComentarios(comentariosComUsuario);

      // Notificações
      if (setNaoLidas) {
        const count = comentariosComUsuario.filter(
          (c) => c.usuario && c.usuario.id !== usuarioId && c.visibilidade === "VISIVEL"
        ).length;
        setNaoLidas(count);
      }
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    }
  };

  // ============================
  // CRIAR
  // ============================
  const criar = async () => {
    if (!texto.trim()) return;

    const dto: ComentarioRequestDTO = {
      texto: texto.trim(),
      usuarioId,
      tarefaId: tipo === "tarefa" ? estruturaId : null,
      projetoId: tipo === "projeto" ? estruturaId : null,
    };

    try {
      const res = await axios.post<ComentarioResponseDTO>(
        "http://localhost:8080/api/comentario",
        dto,
        auth
      );

      let comentarioCriado = res.data;

      if (role === "Externo" ) {
        const resPatch = await axios.patch<ComentarioResponseDTO>(
          `http://localhost:8080/api/comentario/${comentarioCriado.id}`,
          {},
          auth
        );
        comentarioCriado = resPatch.data;
      }

      const comentarioNormalizado = {
        ...comentarioCriado,
        visibilidade: comentarioCriado.visibilidade ?? "VISIVEL",
        usuario: comentarioCriado.usuario ?? {
          id: 0,
          nome: "Usuário desconhecido",
          login: "",
        },
      };

      setComentarios((prev) => [...prev, comentarioNormalizado]);
      setTexto("");
      
      if (setNaoLidas) {
        const count = [...comentarios, comentarioNormalizado].filter(
          (c) => c.usuario?.id !== usuarioId && c.visibilidade === "VISIVEL"
        ).length;
        setNaoLidas(count);
      }

    } catch (error) {
      console.error("Erro ao criar comentário:", error);
    }
  };

  // ============================
  // ATUALIZAR
  // ============================
  const atualizar = async (id: number) => {
    const comentario = comentarios.find((c) => c.id === id);
    if (!comentario) return;

    if (!isAdmin && comentario.usuario?.id !== usuarioId) return;

    const dto: ComentarioRequestDTO = {
      texto,
      usuarioId,
      tarefaId: tipo === "tarefa" ? estruturaId : null,
      projetoId: tipo === "projeto" ? estruturaId : null,
    };

    try {
      await axios.put(`http://localhost:8080/api/comentario/${id}`, dto, auth);
      setEditandoId(null);
      setTexto("");
      carregar();
    } catch (error) {
      console.error("Erro ao atualizar comentário:", error);
    }
  };

  // ============================
  // EXCLUIR
  // ============================
  const deletar = async (id: number) => {
    const comentario = comentarios.find((c) => c.id === id);
    if (!comentario) return;

    if (!isAdmin && comentario.usuario?.id !== usuarioId) return;

    try {
      await axios.delete(`http://localhost:8080/api/comentario/${id}`, auth);
      carregar();
    } catch (error) {
      console.error("Erro ao deletar comentário:", error);
    }
  };

  // ============================
  // ALTERAR VISIBILIDADE (ADMIN)
  // ============================
  const alterarVisibilidade = async (id: number) => {
    if (!isAdmin) return;

    try {
      const res = await axios.patch<ComentarioResponseDTO>(
        `http://localhost:8080/api/comentario/${id}`,
        {},
        auth
      );

      console.log("Resposta PATCH visibilidade:", res.data); // LOG

      const comentarioAtualizado = {
        ...res.data,
        visibilidade: res.data.visibilidade ?? "VISIVEL",
        usuario: res.data.usuario ?? { id: 0, nome: "Usuário desconhecido", login: "" },
      };

      setComentarios((prev) =>
        prev.map((c) => (c.id === id ? comentarioAtualizado : c))
      );
    } catch (error) {
      console.error("Erro ao alterar visibilidade:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      editandoId ? atualizar(editandoId) : criar();
    }
  };

  const formatarDataHora = (data?: string) => {
    if (!data) return "Data inválida";
    const d = new Date(data);
    if (isNaN(d.getTime())) return "Data inválida";
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* LISTA */}
      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2">
        {comentarios.map((c) => {
          const isMine = c.usuario?.id === usuarioId;
          const podeEditarOuDeletar = isAdmin || isMine;
          const isEditando = editandoId === c.id;

          if (!isAdmin && c.visibilidade === "OCULTO") return null;

          return (
            <div
              key={c.id}
              className={`flex flex-col max-w-[70%] ${
                isMine ? "self-end items-end" : "self-start items-start"
              }`}
              onClick={() => setHoverId(c.id === hoverId ? null : c.id)}
            >
              <span
                className={`text-[13px] font-semibold mb-1 ${
                  isMine ? "text-educa-primary-600" : "text-gray-700"
                }`}
              >
                {c.usuario?.nome || "Usuário desconhecido"} •{" "}
                {formatarDataHora(c.dataCriacao)}
              </span>

              <div
                className={`p-3 rounded-xl break-words cursor-pointer ${
                  isMine
                    ? "bg-educa-primary text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {isEditando ? (
                  <Textarea
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                ) : (
                  c.texto
                )}
              </div>

              {hoverId === c.id && !isEditando && (
                <div className="flex gap-2 mt-1">
                  {podeEditarOuDeletar && (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditandoId(c.id);
                          setTexto(c.texto);
                          setHoverId(null);
                        }}
                      >
                        <Pencil className="w-4 h-4 text-educa-primary-600" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deletar(c.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </>
                  )}
                
                  {isAdmin && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => alterarVisibilidade(c.id)}
                    >
                      {c.visibilidade === "OCULTO" ? (
                        <EyeOff className="w-4 h-4 text-secondary-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="border-t p-2 bg-white flex gap-2">
        <Textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Digite sua mensagem..."
          className="flex-1 min-h-[50px] rounded-xl"
        />
        <Button
          onClick={editandoId ? () => atualizar(editandoId) : criar}
          className="rounded-xl bg-educa-primary text-white"
        >
          Enviar
        </Button>
      </div>
    </div>
  );
}
