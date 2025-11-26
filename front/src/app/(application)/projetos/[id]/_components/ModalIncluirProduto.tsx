import { TabelaProdutosBase } from "@/app/_components/Produto/TabelaProdutosBase";
import { Button } from "@/components/ui/button";
import DateInput from "@/components/ui/date-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Prioridade } from "@/lib/Types/Prioridade";
import { ProdutoProjetoRequestDto } from "@/lib/Types/Projetos";
import ProjetoRequisicao from "@/server/ProjetoRequisicao";
import api from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

interface Props {
    projetoId: number
}

const incluirProdutoSchema = z.object({
    prioridadeValue: z.union([
            z.undefined(), 
            z.enum(Prioridade)
        ]).refine((val) => val , {
          message: "Selecione uma prioridade",
        }),
    previsaoInicio: z.date(),
    previsaoTermino: z.date(),
})

export default function ModalIncluirProduto({ projetoId }: Props){
    
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

    const form = useForm<z.infer<typeof incluirProdutoSchema>>({
        resolver: zodResolver(incluirProdutoSchema),
        defaultValues:{
            prioridadeValue: undefined
        }
    })

    const { data, refetch } = useQuery<Produto[]>({
        queryKey: ['produtos'],
        queryFn: async () => {
            const response = await api.get('api/v1/produtos');
            return response.data; 
        },
    });

    const handleIncluirClick = (produto: Produto) => {
        // Abrir modal de confirmação
        setProdutoSelecionado(produto);
        setConfirmOpen(true);
    };

    useEffect(() => {
        refetch();

        if(!confirmOpen)
            form.reset();

    }, [confirmOpen])

    const handleConfirmar = async () => {
        if (!produtoSelecionado) return;

        const formData = form.getValues();

        const body: ProdutoProjetoRequestDto = {
            idProduto: produtoSelecionado.id,
            prioridadeValue: Number(formData.prioridadeValue ?? 0),
            previsaoInicio: formData.previsaoInicio,
            previsaoTermino: formData.previsaoTermino
        };

        try {
            await ProjetoRequisicao.incluirProduto(projetoId, body).then(() => {
                queryClient.invalidateQueries({queryKey: ['produtos-projeto']});
                setConfirmOpen(false);
                setOpen(false);
                refetch();
            })
        } catch (error) {
            console.error(error);
            
        }
    };

    return(
        <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={'secondary'} className="bg-educa-primary">
                    <Plus className="w-5 h-5" />
                    Incluir produto
                </Button>
            </DialogTrigger>

            <DialogContent className="flex flex-col min-w-4xl">
                <DialogHeader>
                    <DialogTitle className="mb-4">Incluir novo produto</DialogTitle>
                </DialogHeader>
                <TabelaProdutosBase
                    produtos={data ?? []}
                    refetch={refetch}
                    onRowClick={handleIncluirClick} 
                />
            </DialogContent>
        </Dialog>

        {/* Modal de confirmação */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogContent className="flex flex-col gap-4 min-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Inclusão de produto</DialogTitle>
                </DialogHeader>
                <p className="mb-8">Tem certeza que deseja incluir o produto "{produtoSelecionado?.nome}" no projeto?</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(() => {})} className="flex flex-col gap-y-6 w-full h-full">
                        <div className="flex justify-between">
                            <FormField
                                control={form.control}
                                name="previsaoInicio"
                                render={({ field }) => (
                                    <FormItem className="align-baseline">
                                    <FormLabel>Previsão de início</FormLabel>
                                    <FormControl>
                                        <DateInput
                                            date={field.value}
                                            onSelectDate={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="previsaoTermino"
                                render={({ field }) => (
                                    <FormItem className="align-baseline">
                                    <FormLabel>Previsão de término</FormLabel>
                                    <FormControl>
                                        <DateInput
                                            date={field.value}
                                            onSelectDate={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="prioridadeValue"
                            render={({ field }) => (
                                <FormItem className="align-baseline">
                                <FormLabel>Prioridade</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value !== undefined ? field.value.toString() : ""}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Defina a prioridade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Prioridade</SelectLabel>
                                                {Object.keys(Prioridade)
                                                    .filter(key => isNaN(Number(key)))
                                                    .map(key => (
                                                        <SelectItem key={key} value={Prioridade[key as keyof typeof Prioridade].toString()}>
                                                        {key}
                                                        </SelectItem>
                                                    ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <div className="flex justify-end gap-2">
                    <Button variant="destructive" onClick={() => {
                        form.reset()
                        setConfirmOpen(false)
                    }}>Cancelar</Button>
                    <Button 
                        onClick={handleConfirmar}
                        className="border-2"
                    >
                        Confirmar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}