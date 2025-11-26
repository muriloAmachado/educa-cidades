"use client"

import { Pie, PieChart } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export type ChartStatusDistribution = {
  key: string
  label: string
  value: number
}

type ChartPieSeparatorNoneProps = {
  distribution: ChartStatusDistribution[]
  totalProjetos: number
  mediaTempoConclusaoDias?: number | null
}

const STATUS_COLORS: Record<string, string> = {
  naoIniciados: "var(--chart-1)",
  pausados: "var(--chart-2)",
  finalizados: "var(--chart-3)",
  atrasados: "var(--chart-4)",
}

export function ChartPieSeparatorNone({
  distribution,
  totalProjetos,
  mediaTempoConclusaoDias,
}: ChartPieSeparatorNoneProps) {
  const chartConfig = distribution.reduce<ChartConfig>(
    (config, item) => ({
      ...config,
      [item.key]: {
        label: item.label,
        color: STATUS_COLORS[item.key] ?? "var(--chart-5)",
      },
    }),
    {
      value: { label: "Projetos" },
    }
  )

  const chartData = distribution.map((item) => ({
    status: item.label,
    key: item.key,
    value: item.value ?? 0,
    fill: `var(--color-${item.key})`,
  }))

  const hasData = chartData.some((item) => item.value > 0)

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Razão entre estados de projetos registrados</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0 w-full">
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={chartData} dataKey="value" nameKey="status" stroke="0" />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
            Nenhum dado disponível para o período selecionado.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Em um total de {totalProjetos} projetos
        </div>
        {typeof mediaTempoConclusaoDias === "number" ? (
          <div className="text-muted-foreground leading-none">
            Média de conclusão em {mediaTempoConclusaoDias.toFixed(0)} dias
          </div>
        ) : (
          <div className="text-muted-foreground leading-none">
            Média de conclusão não disponível
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
