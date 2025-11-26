"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";
import TabelaMeusProjetos from "./_components/TabelaMeusProjetos";
import ProtectedRoute from "../../_components/ProtectedRoute";

export default function MeusProjetos() {
  return (
    <ProtectedRoute allowedRoles={["Externo"]}>
      <div className="min-h-screen bg-educa-background p-6">
        <div className="w-full px-4 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-10 h-10 text-educa-primary" />
              <div>
                <h1 className="text-4xl font-bold text-educa-primary">
                  Meus Projetos
                </h1>
                <p className="text-lg text-muted-foreground">
                  Visualize os projetos relacionados à sua organização
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-educa-primary-200" />

          <Card className="border-educa-primary-200">
            <CardHeader className="bg-educa-primary-50">
              <CardTitle className="text-educa-primary">Lista de Projetos</CardTitle>
              <CardDescription>
                Projetos associados à sua organização
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <TabelaMeusProjetos />
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

