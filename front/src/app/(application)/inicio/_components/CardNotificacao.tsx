import { NotificacaoUI } from "@/lib/Types/Notificacao";

export default function CardNotificacao({ item }: { item: NotificacaoUI }) {
    return (
        <div className="bg-white shadow p-4 rounded-xl border">
            <h4 className="font-semibold text-gray-800 text-sm">{item.nome}</h4>

            <p className="text-gray-600 text-sm mt-1">Projeto: {item.projeto}</p>

            {item.prazo && (
                <p className="text-red-800 text-xs mt-2">
                    Prazo: {item.prazo}
                </p>
            )}
        </div>
    );
}
