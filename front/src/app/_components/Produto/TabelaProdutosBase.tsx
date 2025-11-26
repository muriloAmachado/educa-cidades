import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import api from "@/server/axios"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { BsThreeDots } from "react-icons/bs"

interface TabelaProdutosBaseProps {
  produtos: Produto[]
  refetch?: () => void
  onRowClick?: (produto: Produto) => void
}

export function TabelaProdutosBase({ produtos, refetch, onRowClick }: TabelaProdutosBaseProps) {
  const router = useRouter()

  const columns: ColumnDef<Produto>[] = [
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
      cell: ({ row }) => <div className="capitalize">{row.original.codigo}</div>,
    },
    {
      accessorKey: "nome",
      header: ({ column }) => (
        <Button
          className="!p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.original.nome}</div>,
    },
    {
      accessorKey: "dataCriacao",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="!p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de Criação
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">
          {new Date(row.original.dataCriacao).toLocaleDateString("pt-BR")}
        </div>
      ),
    },
    // {
    //   id: "actions",
    //   enableHiding: false,
    //   cell: ({ row }) => (
    //     <DropdownMenu>
    //       <DropdownMenuTrigger asChild>
    //         <Button variant="ghost" className="h-8 w-8 !p-2">
    //           <BsThreeDots />
    //         </Button>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent align="end">
    //         <DropdownMenuItem
    //           onClick={async (e) => {
    //             e.stopPropagation()
    //             await api.delete(`api/v1/produtos/${row.original.id}`)
    //             refetch?.()
    //           }}
    //         >
    //           Excluir
    //         </DropdownMenuItem>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   ),
    // },
  ]

  return (
    <div className="flex w-full">
      <DataTable
        columnDef={columns}
        data={produtos}
        onClickRow={onRowClick ? onRowClick : () => {}}
      />
    </div>
  )
}