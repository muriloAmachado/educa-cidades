"use client";

import { useState } from "react";
import FormularioGenerico, { CampoFormulario } from "@/app/_components/FormularioGenerico";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function FormularioDemoPage() {
  const [dadosSubmetidos, setDadosSubmetidos] = useState<Record<string, unknown> | null>(null);

  const camposFormulario: CampoFormulario[] = [
    {
      name: "nome",
      label: "Nome Completo",
      type: "text",
      placeholder: "Digite seu nome completo",
      required: true,
      minLength: 3,
      maxLength: 100
    },
    {
      name: "email",
      label: "E-mail",
      type: "email",
      placeholder: "seu@email.com",
      required: true
    },
    {
      name: "idade",
      label: "Idade",
      type: "number",
      placeholder: "Digite sua idade",
      required: true,
      min: 18,
      max: 120
    },
    {
      name: "telefone",
      label: "Telefone",
      type: "text",
      placeholder: "(11) 99999-9999",
      required: false,
      maxLength: 15
    },
    {
      name: "senha",
      label: "Senha",
      type: "password",
      placeholder: "Digite sua senha",
      required: true,
      minLength: 6
    }
  ];

  // Valores iniciais do formulário
  const valoresIniciais = {
    nome: "",
    email: "",
    idade: "",
    telefone: "",
    senha: ""
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (dados: Record<string, unknown>) => {
    // Simula uma requisição assíncrona
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setDadosSubmetidos(dados);
  };

  return (
    <div className="min-h-screen bg-educa-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-educa-primary">
            Demonstração do Formulário Genérico
          </h1>
          <p className="text-lg text-muted-foreground">
            Exemplo de uso do componente FormularioGenerico com as cores da marca EDUCA CIDADES
          </p>
        </div>

        <Separator className="bg-educa-primary-200" />

        {/* Cards de exemplo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card com cores da marca */}
          <Card className="border-educa-primary-200">
            <CardHeader className="bg-educa-primary-50">
              <CardTitle className="text-educa-primary">Cores da Marca</CardTitle>
              <CardDescription>
                Este card utiliza as cores personalizadas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-educa-primary text-white">Azul Escuro</Badge>
                <Badge className="bg-educa-secondary text-white">Amarelo</Badge>
                <Badge className="bg-educa-tertiary text-white">Vermelho</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                As cores foram aplicadas usando as classes utilitárias personalizadas.
              </p>
            </CardContent>
          </Card>

          {/* Card de informações */}
          <Card className="border-educa-secondary-200">
            <CardHeader className="bg-educa-secondary-50">
              <CardTitle className="text-educa-secondary">Funcionalidades</CardTitle>
              <CardDescription>
                Recursos do componente FormularioGenerico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="text-sm space-y-1">
                <li>• Validação automática com Zod</li>
                <li>• Tipos de campo configuráveis</li>
                <li>• Validações personalizáveis</li>
                <li>• Estilização com Tailwind CSS</li>
                <li>• Integração com React Hook Form</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Formulário */}
        <Card className="border-educa-primary-200">
          <CardHeader className="bg-educa-primary-50">
            <CardTitle className="text-educa-primary">Formulário de Exemplo</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para testar o formulário genérico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormularioGenerico
              titulo="Cadastro de Usuário"
              campos={camposFormulario}
              valoresIniciais={valoresIniciais}
              onSubmit={handleSubmit}
              textoBotao="Cadastrar Usuário"
              mostrarSeparador={false}
            />
          </CardContent>
        </Card>

        {/* Resultado */}
        {dadosSubmetidos && (
          <Card className="border-educa-tertiary-200">
            <CardHeader className="bg-educa-tertiary-50">
              <CardTitle className="text-educa-tertiary">Dados Submetidos</CardTitle>
              <CardDescription>
                Os dados foram processados com sucesso!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(dadosSubmetidos, null, 2)}
                </pre>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setDadosSubmetidos(null)}
                  className="px-4 py-2 bg-educa-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Limpar Resultado
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-educa-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Novo Formulário
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informações adicionais */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-educa-primary">Como Usar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-educa-primary mb-2">1. Configuração dos Campos</h4>
              <p className="text-sm text-muted-foreground">
                Defina os campos do formulário com suas propriedades de validação.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-educa-primary mb-2">2. Valores Iniciais</h4>
              <p className="text-sm text-muted-foreground">
                Configure os valores padrão para cada campo do formulário.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-educa-primary mb-2">3. Função de Submit</h4>
              <p className="text-sm text-muted-foreground">
                Implemente a lógica para processar os dados submetidos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
