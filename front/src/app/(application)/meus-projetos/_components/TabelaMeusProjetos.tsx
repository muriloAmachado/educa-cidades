"use client"
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useQuery } from '@tanstack/react-query'
import { useRouter } from "next/navigation";
import ProjetoRequisicao from "@/server/ProjetoRequisicao";
import { ProjetoResponseDto } from "@/lib/Types/Projetos";
import { StatusBadge } from "@/lib/utils/statusBadge";

export default function TabelaMeusProjetos() {

  const router = useRouter()

  const { data, refetch } = useQuery<ProjetoResponseDto[]>({
    queryKey: ['meus-projetos'],
    queryFn: async () => {
      const response = await ProjetoRequisicao.buscarMeusProjetos();
      return response.data ?? []; 
    },
  })

  const columns: ColumnDef<ProjetoResponseDto>[] = [
  {
    accessorKey: "nome",
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
    accessorKey: "inicio",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="!p-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data Início
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = new Date(row.original.inicio);
      return <div>{data.toLocaleDateString('pt-BR')}</div>
    },
  },
  {
    accessorKey: "termino",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="!p-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data Término
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = new Date(row.original.termino);
      return <div>{data.toLocaleDateString('pt-BR')}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <StatusBadge status={row.original.status} />;
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const projeto = row.original;
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/projetos/${projeto.id}`)}
        >
          Ver Detalhes
        </Button>
      );
    },
  },
]

  const onRowClick = (projeto: ProjetoResponseDto) => {
    router.push(`/projetos/${projeto.id}`)
  }

  return (
    <div className="flex w-full">
      <DataTable
        columnDef={columns}
        data={data ?? []}
        onClickRow={onRowClick}
      />
    </div>
  )
}

