"use client"
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from "next/navigation";
import ProjetoRequisicao from "@/server/ProjetoRequisicao";
import { ProjetoResponseDto } from "@/lib/Types/Projetos";
import { StatusBadge } from "@/lib/utils/statusBadge";
import { useState } from "react";
import FormularioProjeto from "./FormularioProjeto";

export default function TabelaProjetos() {

  const router = useRouter()
  const queryClient = useQueryClient();
  const [projetoEditando, setProjetoEditando] = useState<ProjetoResponseDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, refetch } = useQuery<ProjetoResponseDto[]>({
    queryKey: ['projetos'],
    queryFn: async () => {
      const response = await ProjetoRequisicao.buscarTodos();
      return response.data ?? []; 
    },
  })

  const handleEditarProjeto = (projeto: ProjetoResponseDto) => {
    setProjetoEditando(projeto);
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<ProjetoResponseDto>[] = [
  {
    accessorKey: "codigo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="!p-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.original.nome}</div>
    ),
  },
  {
    accessorKey: "dataInicio",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="!p-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de Inicio
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{new Date(row.original.inicio).toLocaleDateString('pt-BR')}</div>,
  },
  {
    accessorKey: "dataTermino",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="!p-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de Término
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{new Date(row.original.termino).toLocaleDateString('pt-BR')}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="!p-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Ações",
    cell: ({ row }) => {
      const projeto = row.original

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 !p-0"
            onClick={(e) => {
              e.stopPropagation();
              handleEditarProjeto(projeto);
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
              e.stopPropagation()
              if (confirm("Tem certeza que deseja excluir este projeto?")) {
                await ProjetoRequisicao.excluirProjeto(projeto.id)
                queryClient.invalidateQueries({queryKey: ['projetos']});
              }
            }}
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]
  const onRowClick = (projeto: ProjetoResponseDto) => {
    router.push(`projetos/${projeto.id}`)
  }

  return (
    <>
      <div className="flex w-full">
          <DataTable
              columnDef={columns}
              data={data || []}
              //filteredBy="codigo"
              onClickRow={onRowClick}
          />
      </div>
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setProjetoEditando(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-educa-primary text-2xl">Editar Projeto</DialogTitle>
            <DialogDescription>
              Edite os campos abaixo para atualizar o projeto
            </DialogDescription>
          </DialogHeader>
          {projetoEditando && (
            <FormularioProjeto 
              projetoId={projetoEditando.id}
              valoresIniciais={{
                nome: projetoEditando.nome,
                objetivo: projetoEditando.objetivo
              }}
              onSuccess={() => {
                setIsDialogOpen(false);
                setProjetoEditando(null);
                refetch();
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
