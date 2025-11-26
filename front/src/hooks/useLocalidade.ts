import { useQuery } from "@tanstack/react-query";

const BASE_URL = "https://servicodados.ibge.gov.br/api/v1/localidades";

export function useEstados() {
  return useQuery({
    queryKey: ["estados"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/estados`);
      const data = await res.json();
      return data
        .sort((a: any, b: any) => a.nome.localeCompare(b.nome))
        .map((estado: any) => ({
          value: estado.sigla,
          label: estado.nome,
        }));
    },
    staleTime: Infinity,
  });
}

export function useCidades(uf?: string) {
  return useQuery({
    queryKey: ["cidades", uf],
    queryFn: async () => {
      if (!uf) return [];
      const res = await fetch(`${BASE_URL}/estados/${uf}/municipios`);
      const data = await res.json();
      return data
        .sort((a: any, b: any) => a.nome.localeCompare(b.nome))
        .map((cidade: any) => ({
          value: cidade.nome,
          label: cidade.nome,
        }));
    },
    enabled: !!uf,
    staleTime: 1000 * 60 * 60 * 24,
  });
}
