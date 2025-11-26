import FormularioGenerico, { CampoFormulario } from "./FormularioGenerico";
import { Prioridade } from "@/lib/Types/Prioridade";

export default function CadastrarAtividade() {
  const camposAtividade: CampoFormulario[] = [
    {
      name: "nome",
      label: "Nome da Atividade",
      type: "text",
      placeholder: "Digite o nome da atividade",
      required: true,
      minLength: 1
    },
    {
      name: "descricao",
      label: "Descrição",
      type: "text",
      placeholder: "Digite a descrição da atividade",
      required: true,
      minLength: 1
    },
    {
      name: "prioridade",
      label: "Prioridade",
      type: "number",
      placeholder: "1 = Baixa, 2 = Média, 3 = Alta",
      required: true,
      min: Prioridade.BAIXA,
      max: Prioridade.ALTA
    }
  ];

  const valoresIniciais = {
    nome: "",
    descricao: "",
    prioridade: Prioridade.MEDIA
  };

  const handleSubmit = async (dados: Record<string, unknown>) => {
    console.log("Dados da atividade:", dados);
    
    // Chamada de API para cadastrar a atividade
    
    // Exemplo de como acessar os dados:
    const { nome, descricao, prioridade } = dados;
    console.log(`Atividade: ${nome}`);
    console.log(`Descrição: ${descricao}`);
    // console.log(`Prioridade: ${prioridade} (${getPrioridadeLabel(prioridade)})`);
  };

  const getPrioridadeLabel = (prioridade: number): string => {
    switch (prioridade) {
      case Prioridade.BAIXA:
        return "Baixa";
      case Prioridade.MEDIA:
        return "Média";
      case Prioridade.ALTA:
        return "Alta";
      default:
        return "Desconhecida";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <FormularioGenerico
        titulo="Cadastrar Atividade"
        campos={camposAtividade}
        valoresIniciais={valoresIniciais}
        onSubmit={handleSubmit}
        textoBotao="Cadastrar Atividade"
      />
    </div>
  );
}
