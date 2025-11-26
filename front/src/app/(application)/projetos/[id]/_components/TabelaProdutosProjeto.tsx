import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { ProdutoProjetoResponseDTO } from "@/lib/Types/Projetos"
import { PrioridadeBadge } from "@/lib/utils/statusBadge"
import api from "@/server/axios"
import ProjetoRequisicao from "@/server/ProjetoRequisicao"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface TabelaProdutosProjeto {
    idProjeto: number
}

export function TabelaProdutosProjeto ({
    idProjeto,
 }: TabelaProdutosProjeto) {
    const router = useRouter()
    const queryClient = useQueryClient();


    const { data } = useQuery<ProdutoProjetoResponseDTO[]>({
      queryKey: ['produtos-projeto'],
      queryFn: async () => {
          const response = await ProjetoRequisicao.buscarProdutos(idProjeto);
          return response.data ?? []; 
      },
    })

    const onRowClick = (produto: ProdutoProjetoResponseDTO) => {
        router.push(`${idProjeto}/${produto.produto.id}`)
    }

  const columns: ColumnDef<ProdutoProjetoResponseDTO>[] = [
    {
      accessorKey: "codigo",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="!p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Código
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="capitalize">{row.original.produto?.codigo ?? ""}</div>,
    },
    {
      accessorKey: "nome-produto",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="!p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Produto
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="capitalize">{row.original.produto?.nome ?? ""}</div>,
    },
    {
      accessorKey: "data-inicio",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="!p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de Início
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">
          {new Date(row.original.previsaoInicio).toLocaleDateString("pt-BR")}
        </div>
      ),
    },
    {
      accessorKey: "data-termino",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="!p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de Término
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">
          {new Date(row.original.previsaoTermino).toLocaleDateString("pt-BR")}
        </div>
      ),
    },
    {
      accessorKey: "prioridade",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="!p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prioridade
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <PrioridadeBadge prioridade={row.original.prioridade}/>,
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 !p-0"
            onClick={async (e) => {
              e.stopPropagation();
              // TODO: Implementar edição de produto no projeto
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
              if (confirm("Tem certeza que deseja remover este produto do projeto?")) {
                await ProjetoRequisicao.excluirProduto(idProjeto, row.original.produto.id)
                queryClient.invalidateQueries({queryKey: ['produtos-projeto']});
              }
            }}
            title="Remover"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

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