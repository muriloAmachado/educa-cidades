"use client";

import { Bell, MessageCircle } from "lucide-react";

interface ChatButtonProps {
  naoLidas: number;
  onClick: () => void;
}

export default function ChatButton({ naoLidas, onClick }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 educa-primary-600 text-white p-3 rounded-full shadow-lg hover:educa-secondary-700 transition z-50"
    >
      <MessageCircle size={20} />
      {naoLidas > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
          {naoLidas}
        </span>
      )}
    </button>
  );
}
