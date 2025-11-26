"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { AlertTriangle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartPieSeparatorNone, ChartStatusDistribution } from "./chart-pie"
import DashboardRequisicao from "@/server/Dashboard/DashboardRequisicao"
import { DashboardResponseDto } from "@/lib/Interface/Dashboard"
import { ChartBarStacked } from "./chart-bar"

export function DashboardContent() {
  const {
    data,
    error,
    isLoading,
  } = useQuery<DashboardResponseDto>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await DashboardRequisicao.buscarDashboard()
      if (response.error || !response.data) {
        throw new Error(
          typeof response.error === "string"
            ? response.error
            : "Não foi possível carregar os dados do dashboard."
        )
      }
      return response.data
    },
    staleTime: 1000 * 60,
  })

  const statusDistribution = useMemo<ChartStatusDistribution[]>(
    () => [
      {
        key: "naoIniciados",
        label: "Não iniciados",
        value: data?.projetosNaoIniciados ?? 0,
      },
      {
        key: "pausados",
        label: "Pausados",
        value: data?.projetosPausados ?? 0,
      },
      {
        key: "finalizados",
        label: "Finalizados",
        value: data?.projetosFinalizados ?? 0,
      },
      {
        key: "atrasados",
        label: "Atrasados",
        value: data?.projetosAtrasados ?? 0,
      },
    ],
    [data]
  )

  const highlights = useMemo(
    () => [
      {
        label: "Total de projetos",
        value: data?.totalProjetos ?? 0,
      },
      { label: "Não iniciados", value: data?.projetosNaoIniciados ?? 0 },
      { label: "Pausados", value: data?.projetosPausados ?? 0 },
      { label: "Finalizados", value: data?.projetosFinalizados ?? 0 },
      { label: "Atrasados", value: data?.projetosAtrasados ?? 0 },
      {
        label: "Média de conclusão de projeto (dias)",
        value: data?.mediaTempoConclusaoProjetoDias ?? 0,
      },
    ],
    [data]
  )

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto justify-center items-center min-h-screen">
      {error ? (
        <Card className="border-destructive bg-destructive/5">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="text-destructive" />
            <div>
              <CardTitle className="text-destructive">
                Não foi possível carregar os dados do dashboard
              </CardTitle>
              <p className="text-sm text-destructive/80">
                {error.message ?? "Por favor, tente novamente."}
              </p>
            </div>
          </CardHeader>
        </Card>
      ) : null}

        {/* todo: cards de informação no dashboard? */}
      {/*<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">*/}
      {/*  {highlights.map((item) => (*/}
      {/*    <Card key={item.label}>*/}
      {/*      <CardHeader className="pb-2">*/}
      {/*        <CardTitle className="text-sm text-muted-foreground">*/}
      {/*          {item.label}*/}
      {/*        </CardTitle>*/}
      {/*      </CardHeader>*/}
      {/*      <CardContent>*/}
      {/*        {isLoading ? (*/}
      {/*          <Skeleton className="h-8 w-20" />*/}
      {/*        ) : (*/}
      {/*          <p className="text-2xl font-semibold">*/}
      {/*            {new Intl.NumberFormat("pt-BR").format(item.value)}*/}
      {/*          </p>*/}
      {/*        )}*/}
      {/*      </CardContent>*/}
      {/*    </Card>*/}
      {/*  ))}*/}
      {/*</div>*/}

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartPieSeparatorNone
          distribution={statusDistribution}
          totalProjetos={data?.totalProjetos ?? 0}
          mediaTempoConclusaoDias={data?.mediaTempoConclusaoProjetoDias ?? null}
        />
        <ChartBarStacked
          estatisticasMensais={data?.projetoEstatisticasMensais ?? []}
        />
      </div>
    </div>
  )
}

