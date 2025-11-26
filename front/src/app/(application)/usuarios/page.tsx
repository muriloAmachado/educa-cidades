"use client";

import React, { useState } from "react";
import FormularioUsuarios from "./_components/FormularioUsuarios";
import TabelaUsuarios from "./_components/TabelaUsuarios";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function Page() {

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex gap-x-4 items-center justify-evenly w-full h-full">
      <div className="w-full px-4 space-y-6">
        
        <div className="flex items-center justify-between mb-6">
          
          <div className="flex items-center gap-3">
            <Package className="w-10 h-10 text-educa-primary" />
            <div>
              <h1 className="text-4xl font-bold text-educa-primary">
                Usuários
              </h1>
              <p className="text-lg text-muted-foreground">
                Visualize e gerencie todos os usuários do sistema
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-educa-primary hover:bg-educa-primary/90 text-white gap-2">
                <Plus className="w-5 h-5" />
                Cadastrar usuário
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">

              <VisuallyHidden>
                <DialogTitle>Cadastro de usuário</DialogTitle>
              </VisuallyHidden>

              <FormularioUsuarios onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <Separator className="bg-educa-primary-200" />

        <Card className="border-educa-primary-200 h-full">
          <CardContent className="pt-4 flex">
            <TabelaUsuarios />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
