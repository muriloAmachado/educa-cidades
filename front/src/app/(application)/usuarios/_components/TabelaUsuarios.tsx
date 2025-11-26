"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Usuario } from "@/lib/Types/Usuario";
import { Usuarios } from "@/server/modulos";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import FormularioUsuarios from "./FormularioUsuarios";

export default function TabelaUsuarios() {
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => {
      return await Usuarios.Usuario.buscarTodos();
    },
  });

  const handleEditarUsuario = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setIsDialogOpen(true);
  };

  const colunas: ColumnDef<Usuario>[] = [
    {
      accessorKey: "nome",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="!p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nome
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.original.nome}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            className="!p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            E-mail
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.original.email}</div>,
    },
    {
      accessorKey: "login",
      header: ({ column }) => {
        return (
          <Button
            className="!p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Login
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.original.login}</div>,
    },
    {
      accessorKey: "perfil",
      header: ({ column }) => {
        return (
          <Button
            className="!p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Perfil
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.original.perfil}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            className="!p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.original.status}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Ações",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 !p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleEditarUsuario(row.original);
              }}
              title="Editar"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 !p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={async (e) => {
                e.stopPropagation();
                if (confirm("Tem certeza que deseja excluir este usuário?")) {
                  await Usuarios.Usuario.excluir(row.original.id).then(() =>
                    refetch()
                  );
                }
              }}
              title="Excluir"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex w-full">
        <DataTable
          columnDef={colunas}
          data={data?.data || []}
          filteredBy="nome"
        />
      </div>
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setUsuarioEditando(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-educa-primary text-2xl">Editar Usuário</DialogTitle>
            <DialogDescription>
              Edite os campos abaixo para atualizar o usuário
            </DialogDescription>
          </DialogHeader>
          {usuarioEditando && (
            <FormularioUsuarios 
              usuarioId={usuarioEditando.id}
              valoresIniciais={{
                nome: usuarioEditando.nome,
                email: usuarioEditando.email,
                login: usuarioEditando.login,
                perfil: usuarioEditando.perfil,
                status: usuarioEditando.status
              }}
              onSuccess={() => {
                setIsDialogOpen(false);
                setUsuarioEditando(null);
                refetch();
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
