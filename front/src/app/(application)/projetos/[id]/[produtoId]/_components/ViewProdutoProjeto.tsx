'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TabelaTarefasProduto from "@/app/(application)/produtos/[id]/_components/TabelaTarefasProduto";
import PrdutoProjetoRequisicao from "@/server/ProdutoProjetoRequisicao";
import { ProdutoProjetoResponseDTO } from "@/lib/Types/Projetos";
import { useQuery } from "@tanstack/react-query";
import ModalIncluirTarefa from "@/app/(application)/produtos/[id]/_components/ModalIncluirTarefa";
import { useParams } from "next/navigation";
import ModalIncluirTarefaProdutoProjeto from "./ModalIncluirTarefaProdutoPojeto";
import TabelaTarefasProdutoProjeto from "./TabelaTarefasProdutoProjeto";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import RelatorioRequisicao from "@/server/RelatorioRequisicao";

export default function ViewProdutoProjeto() {
  
    const params = useParams();
    const id = Number(params.id);
    const produtoId = Number(params.produtoId);

    const [openModal, setOpenModal] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['produto-projeto', id, produtoId],
        queryFn: async () => {
          const response = await PrdutoProjetoRequisicao.buscarPorProjetoProduto(id, produtoId);
          return response.data ?? null;
        },
        enabled: !!id && !!produtoId,
    });

    if (!data || isLoading){
        return (
            <></>
        )
    }

    const baixarRelatorio = async (id: number) => {
      try {
        console.log(id)
        const blob = await RelatorioRequisicao.baixar(id);

        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank", "noopener,noreferrer");
        setTimeout(() => window.URL.revokeObjectURL(url), 10000);
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <>
        <div className="flex flex-col gap-y-12 justify-between items-start w-full p-6">
          <Card className="w-full border-educa-primary-200">
            <CardHeader className="bg-educa-primary-50 py-2">
              <CardTitle className="text-educa-primary mb-2">{`Produto: ${data.produto.codigo} - ${data.produto.nome}`}</CardTitle>
              <CardDescription className="flex flex-col gap-y-1">
                <span>{`Descrição: ${data.produto.descricao}`}</span>
                <span>{`Data de previsão incial: ${data.previsaoInicio ? new Date(data.previsaoInicio).toLocaleDateString('pt-BR') : "-"}`}</span>
                <span>{`Data de previsão final: ${data.previsaoTermino ? new Date(data.previsaoTermino).toLocaleDateString('pt-BR') : "-"}`}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full flex flex-col items-end">
              <CardContent className="w-full flex justify-end items-end gap-4">
                <Button variant="outline" onClick={() => baixarRelatorio(data.id)}>
                  <Download /> Baixar relatório
                </Button>

                <Button variant="secondary" onClick={() => setOpenModal(true)}>
                  <Plus /> Adicionar tarefa
                </Button>
              </CardContent>
              <TabelaTarefasProdutoProjeto 
                produtoProjetoId={data.id}
                projetoId={id}
              />
            </CardContent>
          </Card>
        </div>
        <ModalIncluirTarefaProdutoProjeto
          open={openModal}
          setOpen={setOpenModal}
          produtoProjetoId={data.id}
          projetoId={id}
        />
      </>
    );
} 
