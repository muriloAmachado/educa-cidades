'use client'


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjetoResponseDto } from "@/lib/Types/Projetos";
import ProjetoRequisicao from "@/server/ProjetoRequisicao";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import ModalIncluirProduto from "./ModalIncluirProduto";
import { TabelaProdutosProjeto } from "./TabelaProdutosProjeto";
import ModalIncluirUsuarioProjeto from "./ModalIncluirUsuarioProjeto";
import ChatDrawer from "@/app/_components/Comentario/ChatDrawer";
import Sessao from "@/lib/utils/Sessao";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/lib/utils/statusBadge";

export default function ViewProjeto() {

    const pathname = usePathname()
    const idProjeto = Number(pathname.split("/").pop())
    const [isExterno, setIsExterno] = useState(false);

    useEffect(() => {
        const role = Sessao.buscarRole();
        setIsExterno(role === "Externo");
    }, []);
  
    const { data, isLoading } = useQuery<ProjetoResponseDto | null>({
        queryKey: ['projeto-id'],
        queryFn: async () => {
            const response = await ProjetoRequisicao.buscarPorId(idProjeto);
            return response.data; 
        },
    })

    if (isLoading){
        return (
          <div className="flex gap-x-4 items-center justify-evenly w-full">
          </div>
      );
    }

    if(!data){
        return (
          <div className="flex gap-x-4 items-center justify-evenly w-full">
              Not Found
          </div>
      );
    }


    return (
      <>
        <div className="flex flex-col gap-y-12 justify-between items-start w-full p-6">
          <Card className="w-full border-educa-primary-200">
            <CardHeader className="bg-educa-primary-50 p-4 shadow-sm">
              <CardTitle className="text-2xl font-bold text-educa-primary mb-2">
                {data.nome}
              </CardTitle>

              <h2 className="text-lg font-semibold mb-2">
                {data.cliente.codigo} - {data.cliente.razaoSocial}
              </h2>

              <p className="mb-3 text-sm">{data.objetivo}</p>

              {/* Datas */}
                <div className="flex flex-wrap gap-4 mb-1 text-sm">
                    <div className="flex gap-1 items-center">
                    <span className="font-bold">Data de início:</span>
                    <span>{new Date(data.inicio).toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="font-bold">Data de término:</span>
                  <span>{new Date(data.termino).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
              <div className="mb-1 flex items-center gap-2">
                <span className="font-bold">Status: </span>
                <StatusBadge status={data.status} />
              </div>
            </CardHeader>
            <CardContent className="w-full flex flex-col items-end">
              {!isExterno && (
                <div className="flex gap-x-4">
                  <ModalIncluirUsuarioProjeto
                    projetoId={idProjeto}
                  />
                  <ModalIncluirProduto 
                    projetoId={idProjeto}
                  />
                </div>
              )}
              <TabelaProdutosProjeto 
                idProjeto={idProjeto}
              />
            </CardContent>
            <ChatDrawer estruturaId={idProjeto} tipo="projeto" />
          </Card>
        </div>
      </>
    );
} 
