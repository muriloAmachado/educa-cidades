"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ProjetoEstatisticasMensaisResponseDto } from "@/lib/Interface/Dashboard"

type ChartBarStackedProps = {
  estatisticasMensais: ProjetoEstatisticasMensaisResponseDto[]
}

const MESES = [
  { numero: 1, nome: "Jan" },
  { numero: 2, nome: "Fev" },
  { numero: 3, nome: "Mar" },
  { numero: 4, nome: "Abr" },
  { numero: 5, nome: "Mai" },
  { numero: 6, nome: "Jun" },
  { numero: 7, nome: "Jul" },
  { numero: 8, nome: "Ago" },
  { numero: 9, nome: "Set" },
  { numero: 10, nome: "Out" },
  { numero: 11, nome: "Nov" },
  { numero: 12, nome: "Dez" },
]

const chartConfig: ChartConfig = {
  iniciados: {
    label: "Projetos iniciados",
    color: "var(--chart-1)",
  },
  finalizados: {
    label: "Projetos finalizados",
    color: "var(--chart-2)",
  },
}

export function ChartBarStacked({
  estatisticasMensais,
}: ChartBarStackedProps) {
  const chartData = MESES.map((mes) => {
    const estatistica =
      estatisticasMensais.find((item) => item.mes === mes.numero) ??
      estatisticasMensais.find(
        (item) => item.nomeMes?.slice(0, 3).toLowerCase() === mes.nome.toLowerCase()
      )

    return {
      mes: mes.nome,
      iniciados: estatistica?.projetosIniciados ?? 0,
      finalizados: estatistica?.projetosFinalizados ?? 0,
    }
  })

  const hasData = chartData.some(
    (item) => item.iniciados > 0 || item.finalizados > 0
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Taxas de início e conclusão de projetos por mês</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartContainer config={chartConfig} className="w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 12, right: 12, top: 12, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="mes"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="iniciados"
                fill="var(--color-iniciados)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="finalizados"
                fill="var(--color-finalizados)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
            Sem dados mensais registrados para o período.
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground mt-3.5">
        Atualizado com base nos projetos registrados neste ano.
      </CardFooter>
    </Card>
  )
}
