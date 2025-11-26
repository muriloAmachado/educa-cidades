import { Prioridade } from "../Types/Prioridade";
import { StatusProjetoDescricao, StatusProjetos } from "../Types/Projetos";
import { mapperDescricaoStatus, StatusTarefa } from "../Types/Tarefas";

/**
 * Normaliza o texto do status para português com acentuação correta
 */
export function normalizarStatus(status: string): string {
  const normalizacoes: Record<string, string> = {
    "Concluido": "Concluído",
    "Concluído": "Concluído",
    "CONCLUIDO": "Concluído",
    "Em Andamento": "Em andamento",
    "EM_ANDAMENTO": "Em andamento",
    "Não Iniciado": "Não iniciado",
    "NAO_INICIADO": "Não iniciado",
    "Pausado": "Pausado",
    "PAUSADO": "Pausado",
    "Finalizado": "Concluído",
  };

  return normalizacoes[status] || status;
}

export function getStatusBadgeClasses(status: string): string {
  const statusNormalizado = normalizarStatus(status);
  
  const statusColors: Record<string, string> = {
    "Não iniciado": "bg-gray-100 text-gray-800 border-gray-300",
    "Em andamento": "bg-blue-100 text-blue-800 border-blue-300",
    "Pausado": "bg-yellow-100 text-yellow-800 border-yellow-300",
    "Concluído": "bg-green-100 text-green-800 border-green-300",
  };

  return statusColors[statusNormalizado] || "bg-gray-100 text-gray-800 border-gray-300";
}

export function StatusBadge({ status }: { status: StatusProjetos }) {
  const statusNormalizado = StatusProjetoDescricao[status];
  const classes = getStatusBadgeClasses(statusNormalizado);

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${classes}`}>
      {statusNormalizado}
    </span>
  );
}

const mapearEstiloBadgeTarefa: Record<keyof typeof StatusTarefa, string> = {
  "NAO_INICIADA": "bg-gray-100 text-gray-800 border-gray-300",
  "EM_ANDAMENTO": "bg-blue-100 text-blue-800 border-blue-300",
  "PAUSADA": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "CONCLUIDA": "bg-green-100 text-green-800 border-green-300",
}

export function StatusTarefaBadge({ status }: { status: keyof typeof StatusTarefa }) {

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${mapearEstiloBadgeTarefa[status]}`}>
      {mapperDescricaoStatus[status]}
    </span>
  );
}

const mapearEstiloBadgePrioridade: Record<keyof typeof Prioridade, string> = {
  "BAIXA": "bg-green-100 text-green-800 border-green-300",
  "MEDIA": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "ALTA": "bg-red-100 text-red-800 border-red-300",
};

export function PrioridadeBadge({ prioridade }: { prioridade: keyof typeof Prioridade }) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold border ${mapearEstiloBadgePrioridade[prioridade]}`}
    >
      {prioridade}
    </span>
  );
}

