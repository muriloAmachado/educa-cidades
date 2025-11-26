"use client";

import { useState } from "react";
import FormularioClientes from "./_components/FormularioCliente";
import TabelaClientes from "./_components/TabelaClientes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Contact, Plus } from "lucide-react";
import ProtectedRoute from "../../_components/ProtectedRoute";

export default function ClientsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={["Administrador", "Básico"]}>
      <div className="min-h-screen bg-educa-background p-6">
      <div className="w-full px-4 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Contact className="w-10 h-10 text-educa-primary" />
            <div>
              <h1 className="text-4xl font-bold text-educa-primary">
                Clientes
              </h1>
              <p className="text-lg text-muted-foreground">
                Gerencie os clientes do sistema
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-educa-primary hover:bg-educa-primary/90 text-white gap-2">
                <Plus className="w-5 h-5" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-educa-primary text-2xl">Cadastrar Cliente</DialogTitle>
                <DialogDescription>
                  Preencha os campos abaixo para adicionar um novo cliente ao sistema
                </DialogDescription>
              </DialogHeader>
              <FormularioClientes onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <Separator className="bg-educa-primary-200" />

        <Card className="border-educa-primary-200">
          <CardHeader className="bg-educa-primary-50">
            <CardTitle className="text-educa-primary">Lista de Clientes</CardTitle>
            <CardDescription>
              Visualize e gerencie todos os clientes cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <TabelaClientes />
          </CardContent>
        </Card>
      </div>
    </div>
    </ProtectedRoute>
  );
}
