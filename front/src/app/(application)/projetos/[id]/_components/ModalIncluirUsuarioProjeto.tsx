import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProjetoRequisicao from "@/server/ProjetoRequisicao";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import UsuarioRequisicao from "@/server/Usuario/UsuarioRequisicao";

interface Props {
    projetoId: number;
}

export default function ModalIncluirUsuarioProjeto({ projetoId }: Props) {

    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    // 🔹 Lista de usuários já vinculados ao projeto
    const { data: usuariosProjeto, refetch: refetchProjeto } =
        useQuery({
            queryKey: ["usuarios-projeto", projetoId],
            queryFn: async () => {
                const resp = await ProjetoRequisicao.buscarUsuario(projetoId);
                return resp.data;
            }
        });

    // 🔹 Lista de todos os usuários do sistema
    const { data: usuariosSistema, refetch: refetchUsuarios } =
        useQuery({
            queryKey: ["usuarios-sistema"],
            queryFn: async () => {
                const resp = await UsuarioRequisicao.buscarUsuariosResumidos();
                return resp.data;
            }
        });

    async function handleAdicionar(usuarioId: number) {
        await ProjetoRequisicao.incluirUsuario(projetoId, usuarioId);
        queryClient.invalidateQueries({ queryKey: ["usuarios-projeto", projetoId] });
        refetchProjeto();
    }

    async function handleRemover(usuarioId: number) {
        await ProjetoRequisicao.removerUsuario(projetoId, usuarioId);
        queryClient.invalidateQueries({ queryKey: ["usuarios-projeto", projetoId] });
        refetchProjeto();
    }

    const usuariosNaoVinculados =
        usuariosSistema?.filter(
            u => !usuariosProjeto?.some(up => up.id === u.id)
        ) ?? [];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="secondary"
                    className="bg-educa-primary"
                >
                    <Plus className="w-5 h-5" />
                    Incluir usuário
                </Button>
            </DialogTrigger>

            <DialogContent className="min-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Gerenciar usuários do projeto</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 mt-4">
                    <div className="border rounded-md p-4">
                        <h3 className="font-semibold text-lg mb-3">Todos os usuários</h3>

                        <ul className="space-y-2">
                            {usuariosNaoVinculados.map(usuario => (
                                <li
                                    key={usuario.id}
                                    className="flex justify-between items-center p-2 border rounded-md bg-gray-50"
                                >
                                    <span>{usuario.nome}</span>

                                    <Button
                                        size="sm"
                                        variant={"outline"}
                                        onClick={() => handleAdicionar(usuario.id)}
                                    >
                                        Adicionar
                                    </Button>
                                </li>
                            ))}

                            {usuariosNaoVinculados.length === 0 && (
                                <p className="text-sm text-gray-500">Todos os usuários já estão vinculados.</p>
                            )}
                        </ul>
                    </div>

                    <div className="border rounded-md p-4">
                        <h3 className="font-semibold text-lg mb-3">Usuários vinculados</h3>

                        <ul className="space-y-2">
                            {usuariosProjeto?.map(usuario => (
                                <li 
                                    key={usuario.id}
                                    className="flex justify-between items-center p-2 border rounded-md bg-gray-50"
                                >
                                    <span>{usuario.nome}</span>

                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleRemover(usuario.id)}
                                    >
                                        Remover
                                    </Button>
                                </li>
                            ))}

                            {usuariosProjeto?.length === 0 && (
                                <p className="text-sm text-gray-500">Nenhum usuário vinculado.</p>
                            )}
                        </ul>
                    </div>
                    
                </div>
            </DialogContent>
        </Dialog>
    );
}