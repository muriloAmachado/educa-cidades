"use client";

import { useEffect, useState } from "react";
import CardNotificacao from "./CardNotificacao";
import { NotificacaoUI, NotificacaoProduto, NotificacaoProjeto, NotificacaoTarefa } from "@/lib/Types/Notificacao";
import { requisicaoBase } from "@/server/requisicaoBase";
import { IoClose } from "react-icons/io5";

export default function PainelNotificacao({
    open,
    setOpen
}: {
    open: boolean,
    setOpen: (value: boolean) => void
}) {

    const [notificacoes, setNotificacoes] = useState<NotificacaoUI[]>([]);
    const [carregado, setCarregado] = useState(false);

    useEffect(() => {
        if (open) carregarNotificacoes();
    }, [open]);

    async function carregarNotificacoes() {
        try {
            setCarregado(true);

            const [tarefasRes, produtosRes, projetosRes] = await Promise.all([
                requisicaoBase<null, NotificacaoTarefa[]>("/notificacao/tarefas", "GET"),
                requisicaoBase<null, NotificacaoProduto[]>("/notificacao/produtos", "GET"),
                requisicaoBase<null, NotificacaoProjeto[]>("/notificacao/projetos", "GET"),
            ]);

            const tarefas = tarefasRes.data ?? [];
            const produtos = produtosRes.data ?? [];
            const projetos = projetosRes.data ?? [];

            const listaFinal: NotificacaoUI[] = [
                ...tarefas.map(t => ({
                    id: t.id,
                    nome: t.nome,
                    texto: t.descricao,
                    projeto: t.projeto.nome,
                    prazo: t.prazo
                })),
                ...produtos.map(p => ({
                    id: p.id,
                    nome: p.produto.nome,
                    texto: p.produto.descricao,
                    projeto: p.projeto.nome,
                    prazo: p.previsaoTermino
                })),
                ...projetos.map(p => ({
                    id: p.id,
                    nome: p.nome,
                    texto: p.objetivo,
                    projeto: p.nome,
                    prazo: p.termino
                })),
            ];

            setNotificacoes(listaFinal);

        } catch (error) {
            console.error(error);
        } finally {
            setCarregado(false);
        }
    }

    return (
        <div
            className={`
            fixed right-0 top-0 h-full w-80 bg-gray-100 shadow-xl
            transform transition-transform duration-300
            ${open ? "translate-x-0" : "translate-x-full"}
            p-5 flex flex-col gap-4
        `}
        >

            <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-6 text-xl cursor-pointer"
            >
                <IoClose />
            </button>

            <h2 className="text-lg font-bold text-gray-700">Notificações</h2>

            {carregado && <p>Carregando...</p>}

            {!carregado && notificacoes.length === 0 && (
                <p className="text-gray-500 text-sm">Nenhuma notificação.</p>
            )}

            <div className="flex flex-col gap-3 overflow-y-auto">
                {notificacoes.map((n, i) => (
                    <CardNotificacao key={i} item={n} />
                ))}
            </div>
        </div>
    );
}
