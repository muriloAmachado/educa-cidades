"use client";

import { Calendar, Info } from "lucide-react";
import { useEffect, useState } from "react";
import Sessao from "@/lib/utils/Sessao";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AgendaPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isGoogleEmail, setIsGoogleEmail] = useState(false);

  useEffect(() => {
    const email = Sessao.buscarEmailUsuario();
    if (email) {
      setUserEmail(email);
      const hasGoogle = email.toLowerCase().includes("google") || 
                        email.toLowerCase().includes("gmail");
      setIsGoogleEmail(hasGoogle);
    }
  }, []);

  const calendarSrc = userEmail && isGoogleEmail
    ? `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(userEmail)}&ctz=America%2FSao_Paulo`
    : "https://calendar.google.com/calendar/embed?src=pt-br.brazilian%23holiday%40group.v.calendar.google.com&ctz=America%2FSao_Paulo";
  
  return (
    <div className="w-full h-full flex flex-col p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-8 h-8 text-educa-primary" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-educa-primary">Agenda</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-gray-500 hover:text-educa-primary transition-colors">
                    <Info className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p className="font-semibold mb-1">Como visualizar seu calendário:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Acesse o Google Calendar</li>
                    <li>Clique em "Configurações e compartilhamento" do seu calendário</li>
                    <li>Marque "Tornar disponível publicamente" ou</li>
                    <li>Compartilhe com pessoas específicas</li>
                  </ul>
                  {userEmail && !isGoogleEmail && (
                    <p className="mt-2 text-xs text-yellow-600 font-semibold">
                      ⚠️ Seu email não é do Google. Use uma conta Gmail para ver seu calendário pessoal.
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {userEmail && isGoogleEmail 
              ? `Exibindo calendário de ${userEmail}`
              : "Exibindo calendário de feriados brasileiros"}
          </p>
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <iframe
          src={calendarSrc}
          className="w-full h-full border-0"
          frameBorder="0"
          scrolling="no"
          title="Google Calendar"
        />
      </div>
    </div>
  );
}

