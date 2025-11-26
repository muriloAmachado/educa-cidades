import { Chart } from "react-google-charts";
import { StatusTarefa, TarefaResponseDto } from "@/lib/Types/Tarefas";
import { ta } from "date-fns/locale";

interface Props {
  tarefas: TarefaResponseDto[];
}

export default function Gantt({ tarefas }: Props) {

  const statusLabels: Record<keyof typeof StatusTarefa, string> = {
    NAO_INICIADA: "Não iniciada",
    EM_ANDAMENTO: "Em andamento",
    PAUSADA: "Pausada",
    CONCLUIDA: "Concluída",
  };

  const statusPercentual: Record<keyof typeof StatusTarefa, number> = {
    CONCLUIDA: 100,
    EM_ANDAMENTO: 50,
    NAO_INICIADA: 0,
    PAUSADA: 0,
  };

  const safeDate = (d: string | Date) => {
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? new Date() : dt;
  };

  const data = [
    [
      { type: "string", label: "ID" },
      { type: "string", label: "Nome" },
      { type: "string", label: "Status" },
      { type: "date", label: "Início" },
      { type: "date", label: "Término" },
      { type: "number", label: "Duração" },
      { type: "number", label: "% Concluído" },
      { type: "string", label: "Dependências" },
    ],

    ...tarefas.map((t) => {
      const inicio = safeDate(t.inicio);
      let termino = safeDate(t.termino);

      if (t.termino === null)
        termino = new Date(inicio.getTime() + 7 * 24 * 60 * 60 * 1000);

      if (t.termino === null && t.inicio === null) {
        const now = new Date();
        inicio.setTime(now.getTime());
        termino.setTime(now.getTime());
      }

      return [
        t.id.toString(),
        t.nome,
        statusLabels[t.status],
        inicio,
        termino,
        null,
        statusPercentual[t.status],
        null,
      ];
    }),
  ];

  const options = {
    height: 380,
    gantt: {
      trackHeight: 32,

      palette: [
        {
          color: "#4CAF50",      // concluída
          dark: "#388E3C",
          light: "#C8E6C9",
        },
        {
          color: "#FFC107",      // em andamento
          dark: "#FFA000",
          light: "#FFECB3",
        },
        {
          color: "#EF5350",      // não iniciada / pausada
          dark: "#C62828",
          light: "#FFCDD2",
        },
      ],
    },
  };

  if (!tarefas || tarefas.length === 0) {
    return (
      <div className="container mx-auto">
        <h1 className="text-xl font-bold py-4">Cronograma</h1>
        <p className="text-gray-500 p-10">Nenhuma tarefa encontrada.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-bold py-4">
        Cronograma
      </h1>

      <div className="rounded-xl overflow-hidden" style={{ overflowX: "auto" }}>
        <Chart
          chartType="Gantt"
          data={data}
          options={options}
          width="100%"
          height="200px"
          loader={<div>Carregando gráfico...</div>}
        />
      </div>
    </div>
  );
}
