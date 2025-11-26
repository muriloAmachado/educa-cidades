"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clientes } from "@/server/modulos";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Cliente } from "@/lib/Types/Cliente";
import { useState } from "react";
import FormularioClientes from "./FormularioCliente";

export default function TabelaClientes() {
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      return await Clientes.Cliente.buscarTodos();
    },
  });

  const handleEditarCliente = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setIsDialogOpen(true);
  };

  const colunas: ColumnDef<Cliente>[] = [
    {
      accessorKey: "codigo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="!p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Codigo
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.original.codigo}</div>,
    },
    {
      accessorKey: "razaoSocial",
      header: ({ column }) => {
        return (
          <Button
            className="!p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Razão Social
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.original.razaoSocial}</div>,
    },
    {
      accessorKey: "cnpj",
      header: ({ column }) => {
        return (
          <Button
            className="!p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            CNPJ
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.original.cnpj}</div>,
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
      accessorKey: "cidade",
      header: ({ column }) => {
        return (
          <Button
            className="!p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Cidade
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.original.cidade}</div>,
    },
    {
      accessorKey: "estado",
      header: ({ column }) => {
        return (
          <Button
            className="!p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Estado
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.original.estado}</div>,
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
                handleEditarCliente(row.original);
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
                if (confirm("Tem certeza que deseja excluir este cliente?")) {
                  await Clientes.Cliente.deletar(row.original.id).then(() =>
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
          filteredBy="razaoSocial"
        />
      </div>
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setClienteEditando(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-educa-primary text-2xl">Editar Cliente</DialogTitle>
            <DialogDescription>
              Edite os campos abaixo para atualizar o cliente
            </DialogDescription>
          </DialogHeader>
          {clienteEditando && (
            <FormularioClientes 
              clienteId={clienteEditando.id}
              valoresIniciais={{
                razaoSocial: clienteEditando.razaoSocial,
                cnpj: clienteEditando.cnpj,
                email: clienteEditando.email,
                cidade: clienteEditando.cidade,
                estado: clienteEditando.estado
              }}
              onSuccess={() => {
                setIsDialogOpen(false);
                setClienteEditando(null);
                refetch();
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
