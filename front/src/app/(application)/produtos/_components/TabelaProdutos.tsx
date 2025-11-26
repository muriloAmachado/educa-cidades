"use client"
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { useQuery } from '@tanstack/react-query'
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import FormularioProdutos from "./FormularioProdutos";

export default function TabelaProdutos() {


  const router = useRouter()
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, refetch } = useQuery<Produto[]>({
    queryKey: ['produtos'],
    queryFn: async () => {
      const response = await api.get('api/v1/produtos');
      return response.data; 
    },
  })

  const handleEditarProduto = (produto: Produto) => {
    setProdutoEditando(produto);
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<Produto>[] = [
  {
    accessorKey: "codigo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="!p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Código
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.original.codigo}</div>
    ),
  },
  {
    accessorKey: "nome",
    header: ({ column }) => {
      return (
        <Button
          className="!p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.original.nome}</div>,
  },
  {
    accessorKey: "dataCriacao",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="!p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de Criação
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{new Date(row.original.dataCriacao).toLocaleDateString('pt-BR')}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Ações",
    cell: ({ row }) => {
      const produto = row.original

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 !p-0"
            onClick={(e) => {
              e.stopPropagation();
              handleEditarProduto(produto);
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
              if (confirm("Tem certeza que deseja excluir este produto?")) {
                await api.delete(`api/v1/produtos/${produto.id}`).then(
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
  const onRowClick = (produto: Produto) => {
    router.push(`produtos/${produto.id}`)
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
        if (!open) setProdutoEditando(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-educa-primary text-2xl">Editar Produto</DialogTitle>
            <DialogDescription>
              Edite os campos abaixo para atualizar o produto
            </DialogDescription>
          </DialogHeader>
          {produtoEditando && (
            <FormularioProdutos 
              produtoId={produtoEditando.id}
              valoresIniciais={{ nome: produtoEditando.nome, descricao: produtoEditando.descricao }}
              onSuccess={() => {
                setIsDialogOpen(false);
                setProdutoEditando(null);
                refetch();
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
