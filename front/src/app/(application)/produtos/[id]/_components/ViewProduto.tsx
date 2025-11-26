'use client'
import TabelaTarefasProduto from "./TabelaTarefasProduto";
import ModalIncluirTarefa from "./ModalIncluirTarefa";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Sessao from "@/lib/utils/Sessao";

interface PageProps {
  produto: Produto
}


export default function ViewProduto({produto}: PageProps) {
  const [isExterno, setIsExterno] = useState(false);

  useEffect(() => {
    const role = Sessao.buscarRole();
    setIsExterno(role === "Externo");
  }, []);

    return (
      <>
        <div className="flex flex-col gap-y-12 justify-between items-start w-full p-6">
          <Card className="w-full border-educa-primary-200">
            <CardHeader className="bg-educa-primary-50 py-2">
              <CardTitle className="text-educa-primary mb-2">{`Produto: ${produto.codigo} - ${produto.nome}`}</CardTitle>
              <CardDescription className="flex flex-col gap-y-1">
                <span>{`Descrição: ${produto.descricao}`}</span>
                <span>{`Data de criação: ${new Date(produto.dataCriacao).toLocaleDateString('pt-BR')}`}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full flex flex-col items-end">
              {!isExterno && (
                <ModalIncluirTarefa 
                  produtoId={produto.id}
                />
              )}
              <TabelaTarefasProduto 
                produtoId={produto.id}
                />
            </CardContent>
          </Card>
        </div>
      </>
    );
} 
