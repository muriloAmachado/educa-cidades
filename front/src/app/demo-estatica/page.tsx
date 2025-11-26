"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DemoEstaticaPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    idade: "",
    telefone: "",
    senha: ""
  });

  const [submittedData, setSubmittedData] = useState<Record<string, unknown> | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedData(formData);
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      email: "",
      idade: "",
      telefone: "",
      senha: ""
    });
    setSubmittedData(null);
  };

  return (
    <div className="min-h-screen bg-educa-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-educa-primary">
            EDUCA CIDADES
          </h1>
          <p className="text-xl text-muted-foreground">
            Demonstração do Sistema de Cores e Formulário Estático
          </p>
          <Separator className="bg-educa-primary-200" />
        </div>

        {/* Sistema de Cores */}
        <Card className="border-educa-primary-200">
          <CardHeader className="bg-educa-primary-50">
            <CardTitle className="text-educa-primary text-3xl">
              Sistema de Cores da Marca
            </CardTitle>
            <CardDescription className="text-lg">
              Paleta de cores personalizada baseada na identidade visual
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {/* Cores principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center space-y-3">
                <div className="w-24 h-24 bg-educa-primary rounded-lg mx-auto shadow-lg"></div>
                <h3 className="font-semibold text-educa-primary">Azul Escuro</h3>
                <p className="text-sm text-muted-foreground">RGB(25, 25, 112)</p>
                <Badge className="bg-educa-primary text-white">Primária</Badge>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-24 h-24 bg-educa-secondary rounded-lg mx-auto shadow-lg"></div>
                <h3 className="font-semibold text-educa-secondary">Amarelo</h3>
                <p className="text-sm text-muted-foreground">RGB(255, 140, 0)</p>
                <Badge className="bg-educa-secondary text-white">Secundária</Badge>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-24 h-24 bg-educa-tertiary rounded-lg mx-auto shadow-lg"></div>
                <h3 className="font-semibold text-educa-tertiary">Vermelho</h3>
                <p className="text-sm text-muted-foreground">RGB(220, 20, 60)</p>
                <Badge className="bg-educa-tertiary text-white">Terciária</Badge>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-24 h-24 bg-educa-background border-2 border-gray-300 rounded-lg mx-auto shadow-lg"></div>
                <h3 className="font-semibold text-gray-700">Branco Acinzentado</h3>
                <p className="text-sm text-muted-foreground">RGB(248, 250, 252)</p>
                <Badge className="bg-gray-200 text-gray-700">Fundo</Badge>
              </div>
            </div>

            {/* Exemplos de uso */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-educa-primary">Exemplos de Uso</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-educa-primary">Botões</h4>
                  <div className="space-y-2">
                    <Button className="w-full bg-educa-primary text-white hover:opacity-90">
                      Botão Primário
                    </Button>
                    <Button className="w-full bg-educa-secondary text-white hover:opacity-90">
                      Botão Secundário
                    </Button>
                    <Button className="w-full bg-educa-tertiary text-white hover:opacity-90">
                      Botão Terciário
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-educa-primary">Cards</h4>
                  <div className="space-y-2">
                    <div className="bg-educa-primary-50 border border-educa-primary-200 rounded-lg p-3">
                      <h5 className="font-medium text-educa-primary">Card Primário</h5>
                      <p className="text-sm text-gray-600">Conteúdo do card</p>
                    </div>
                    <div className="bg-educa-secondary-50 border border-educa-secondary-200 rounded-lg p-3">
                      <h5 className="font-medium text-educa-secondary">Card Secundário</h5>
                      <p className="text-sm text-gray-600">Conteúdo do card</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-educa-primary">Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-educa-primary rounded-full"></div>
                      <span className="text-sm">Ativo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-educa-secondary rounded-full"></div>
                      <span className="text-sm">Pendente</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-educa-tertiary rounded-full"></div>
                      <span className="text-sm">Erro</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulário Estático */}
        <Card className="border-educa-primary-200">
          <CardHeader className="bg-educa-primary-50">
            <CardTitle className="text-educa-primary text-3xl">
              Formulário de Demonstração
            </CardTitle>
            <CardDescription className="text-lg">
              Exemplo de formulário usando as cores da marca
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-educa-primary font-medium">
                    Nome Completo *
                  </Label>
                  <Input
                    id="nome"
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Digite seu nome completo"
                    className="border-educa-primary-200 focus:border-educa-primary focus:ring-educa-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-educa-primary font-medium">
                    E-mail *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="seu@email.com"
                    className="border-educa-primary-200 focus:border-educa-primary focus:ring-educa-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idade" className="text-educa-primary font-medium">
                    Idade *
                  </Label>
                  <Input
                    id="idade"
                    type="number"
                    value={formData.idade}
                    onChange={(e) => handleInputChange("idade", e.target.value)}
                    placeholder="Digite sua idade"
                    className="border-educa-primary-200 focus:border-educa-primary focus:ring-educa-primary"
                    min="18"
                    max="120"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-educa-primary font-medium">
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange("telefone", e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="border-educa-primary-200 focus:border-educa-primary focus:ring-educa-primary"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="senha" className="text-educa-primary font-medium">
                    Senha *
                  </Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formData.senha}
                    onChange={(e) => handleInputChange("senha", e.target.value)}
                    placeholder="Digite sua senha"
                    className="border-educa-primary-200 focus:border-educa-primary focus:ring-educa-primary"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  onClick={resetForm}
                  className="bg-educa-secondary text-white hover:opacity-90"
                >
                  Limpar
                </Button>
                <Button
                  type="submit"
                  className="bg-educa-primary text-white hover:opacity-90"
                >
                  Enviar Dados
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Resultado */}
        {submittedData && (
          <Card className="border-educa-tertiary-200">
            <CardHeader className="bg-educa-tertiary-50">
              <CardTitle className="text-educa-tertiary text-2xl">
                Dados Submetidos com Sucesso!
              </CardTitle>
              <CardDescription>
                Os dados foram processados e exibidos abaixo
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(submittedData, null, 2)}
                </pre>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={resetForm}
                  className="bg-educa-primary text-white hover:opacity-90"
                >
                  Novo Formulário
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informações */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-educa-primary text-2xl">
              Sobre Esta Demonstração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-educa-primary mb-2">Sistema de Cores</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Cores baseadas no logo da EDUCA CIDADES</li>
                  <li>• Variações de intensidade (50-900)</li>
                  <li>• Classes utilitárias personalizadas</li>
                  <li>• Integração com Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-educa-primary mb-2">Formulário Estático</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Validação HTML5 nativa</li>
                  <li>• Estados controlados com React</li>
                  <li>• Estilização com cores da marca</li>
                  <li>• Feedback visual imediato</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
