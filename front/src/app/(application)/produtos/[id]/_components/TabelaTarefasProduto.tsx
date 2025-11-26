"use client"
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { useQuery } from '@tanstack/react-query'
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { Atividade } from "@/lib/Types/Atividade";
import { useState } from "react";
import ModalEditarAtividade from "./ModalEditarAtividade";

interface Props {
    produtoId: number
}

export default function TabelaTarefasProduto({
    produtoId
}: Props) {

  const router = useRouter()
  const [atividadeEditando, setAtividadeEditando] = useState<Atividade | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, refetch } = useQuery<Atividade[]>({
    queryKey: ['atividades-produto'],
    queryFn: async () => {
      const response = await api.get(`api/v1/produtos/${produtoId}/atividades`);
      return response.data; 
    },
  })

  const handleEditarAtividade = (atividade: Atividade) => {
    setAtividadeEditando(atividade);
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<Atividade>[] = [
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
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.original.nome}</div>
    ),
  },
  {
    accessorKey: "prioridade",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="!p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prioridade
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.original.prioridade}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Ações",
    cell: ({ row }) => {
      const atividade = row.original

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 !p-0"
            onClick={(e) => {
              e.stopPropagation();
              handleEditarAtividade(atividade);
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
              if (confirm("Tem certeza que deseja excluir esta atividade?")) {
                await api.delete(`api/v1/produtos/${produtoId}/atividades/${atividade.id}`).then(
                  () => refetch()
                )
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
  const onRowClick = (atividade: Atividade) => {
    
  }

  return (
    <>
      <div className="flex w-full">
          <DataTable
              columnDef={columns}
              data={data || []}
              //filteredBy="codigo"
              hiddenColumnsOption={false}
              onClickRow={onRowClick}
          />
      </div>
      <ModalEditarAtividade
        produtoId={produtoId}
        atividade={atividadeEditando || undefined}
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setAtividadeEditando(null);
        }}
        onSuccess={() => {
          refetch();
        }}
      />
    </>
  );
}
