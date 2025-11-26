"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MessageCircle, X } from "lucide-react";
import ListaComentario from "./ListaComentario";
import { Button } from "@/components/ui/button";

interface ChatDrawerProps {
  estruturaId: number;
  tipo: "tarefa" | "projeto";
}

export default function ChatDrawer({ estruturaId, tipo }: ChatDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [naoLidas, setNaoLidas] = useState(0);

  const abrirChat = () => setIsOpen(true);
  const fecharChat = () => setIsOpen(false);

  return (
    <>
      {/* Botão fixo no canto superior direito */}
      <Button
        onClick={abrirChat}
        variant="secondary"
        className="fixed top-8 right-8 bg-educa-primary transition z-50 cursor-pointer text-white p-3 rounded-full shadow-lg"
      >
        <MessageCircle size={20} />
        {naoLidas > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold pointer-events-none">
            {naoLidas}
          </span>
        )}
      </Button>

      {/* Modal lateral */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={fecharChat}>
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          {/* Painel lateral */}
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Chat</h2>
                <button
                  onClick={fecharChat}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Lista de comentários */}
              <div className="flex-1 overflow-y-auto">
                <ListaComentario
                  estruturaId={estruturaId}
                  tipo={tipo}
                  setNaoLidas={setNaoLidas}
                />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
