"use client"
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2, FileInput } from "lucide-react";
import { useQuery } from '@tanstack/react-query'
import { useState } from "react";
import TarefasRequisicao from "@/server/TarefasRequisicao";
import { TarefaResponseDto } from "@/lib/Types/Tarefas";
import ModalIncluirTarefaProdutoProjeto from "./ModalIncluirTarefaProdutoPojeto";
import { PrioridadeBadge, StatusBadge, StatusTarefaBadge } from "@/lib/utils/statusBadge";
import Gantt from "./GraficoTarefas";

interface Props {
  produtoProjetoId: number
  projetoId: number
}

export default function TabelaTarefasProdutoProjeto({
  produtoProjetoId,
  projetoId
}: Props) {

  const [tarefaEditando, setTarefaEditando] = useState<TarefaResponseDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, refetch } = useQuery<TarefaResponseDto[]>({
    queryKey: ['tarefas-projeto-produto'],
    queryFn: async () => {
      const response = await TarefasRequisicao.bucarTarefasPorProjetoProduto(produtoProjetoId);
      console.log(response.data)
      return response.data ?? [];
    },
  })

  const handleEditarAtividade = (tarefa: TarefaResponseDto) => {
    setTarefaEditando(tarefa);
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<TarefaResponseDto>[] = [
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
      cell: ({ row }) => <PrioridadeBadge prioridade={row.original.prioridade} />,
    },
    {
      accessorKey: "responsavel",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="!p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Responsável
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.original.responsavel.nome}</div>,
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
      cell: ({ row }) => <StatusTarefaBadge status={row.original.status} />,
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
                await TarefasRequisicao.excluir(row.original.id).then(() => refetch())
              }}
              title="Excluir"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 !p-0"
              onClick={async (e) => {
                e.stopPropagation();
                await TarefasRequisicao.definirPadrao(row.original.id).then(() => refetch());
              }}
              title="Definir como padrão"
            >
              <FileInput className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <Gantt
        tarefas={data ?? []}
      />
      <div className="flex flex-col w-full">
        <h1 className="text-xl font-bold">
          Tarefas
        </h1>
        <DataTable
          columnDef={columns}
          data={data || []}
          //filteredBy="codigo"
          hiddenColumnsOption={false}
          onClickRow={() => { }}
        />
      </div>
      <ModalIncluirTarefaProdutoProjeto
        produtoProjetoId={produtoProjetoId}
        projetoId={projetoId}
        tarefaEditada={tarefaEditando || undefined}
        open={isDialogOpen}
        setOpen={(open) => {
          setIsDialogOpen(open);
          if (!open) setTarefaEditando(null);
        }}
      />
    </>
  );
}
