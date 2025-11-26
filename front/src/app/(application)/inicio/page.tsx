"use client";

import { useState } from "react";
import SinoNotificacao from "./_components/SinoNotificacao";
import PainelNotificacao from "./_components/PainelNotificacao";
import { DashboardContent } from "./_components/dashboard-content";
import ProtectedRoute from "../../_components/ProtectedRoute";

export default function Inicio() {
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen(!open);
  }

  return (
    <ProtectedRoute allowedRoles={["Administrador", "Básico"]}>
      <div className="relative w-full h-full">

        <div className="absolute right-10 top-10">
          <SinoNotificacao onClick={toggle} />
        </div>

        <div className="pt-10 px-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Seja bem-vindo de volta!
          </h1>
          <p className="text-gray-600 mt-2">Aqui está o resumo do seu painel.</p>
        </div>

        <div className="">
          <DashboardContent />
        </div>

        <PainelNotificacao open={open} setOpen={setOpen} />
      </div>
    </ProtectedRoute>
  );
}
