export interface ProjetoEstatisticasMensaisResponseDto {
  mes: number;
  nomeMes: string;
  projetosIniciados: number;
  projetosFinalizados: number;
}

export interface DashboardResponseDto {
  totalProjetos: number;
  projetosNaoIniciados: number;
  projetosPausados: number;
  projetosFinalizados: number;
  projetosAtrasados: number;
  mediaTempoConclusaoProjetoDias: number;
  projetoEstatisticasMensais: ProjetoEstatisticasMensaisResponseDto[];
}

