"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Package, Plus } from "lucide-react";
import FormularioProdutos from "../produtos/_components/FormularioProdutos";
import TabelaProdutos from "../produtos/_components/TabelaProdutos";
import FormularioProjeto from "./_components/FormularioProjeto";
import TabelaProjetos from "./_components/TabelaProjetos";
import ProtectedRoute from "../../_components/ProtectedRoute";

export default function Produtos() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={["Administrador", "Básico"]}>
      <div className="min-h-screen bg-educa-background p-6">
      <div className="w-full px-4 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="w-10 h-10 text-educa-primary" />
            <div>
              <h1 className="text-4xl font-bold text-educa-primary">
                Projetos
              </h1>
              <p className="text-lg text-muted-foreground">
                Gerencie os projetos do sistema
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-educa-primary hover:bg-educa-primary/90 text-white gap-2">
                <Plus className="w-5 h-5" />
                Novo Projeto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-educa-primary text-2xl">Cadastrar Projeto</DialogTitle>
                <DialogDescription>
                  Preencha os campos abaixo para adicionar um novo projeto ao sistema
                </DialogDescription>
              </DialogHeader>
              <FormularioProjeto onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <Separator className="bg-educa-primary-200" />

        <Card className="border-educa-primary-200">
          <CardHeader className="bg-educa-primary-50">
            <CardTitle className="text-educa-primary">Lista de projetos</CardTitle>
            <CardDescription>
              Visualize e gerencie todos os projetos cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <TabelaProjetos />
          </CardContent>
        </Card>
      </div>
    </div>
    </ProtectedRoute>
  );
}
