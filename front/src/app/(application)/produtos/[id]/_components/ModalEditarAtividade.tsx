import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Prioridade } from "@/lib/Types/Prioridade";
import { Atividade } from "@/lib/Types/Atividade";
import api from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useToast } from "@/lib/hooks/useToast";

const atividadeSchema = z.object({
    nome: z.string().refine(
        (val) => val && val.trim().length > 0,
        { message: "Nome é obrigatório" }
    ),
    descricao: z.string().refine(
        (val) => val && val.trim().length > 0,
        { message: "Descrição é obrigatória" }
    ),
    prioridade: z.union([
        z.undefined(), 
        z.enum(Prioridade)
    ]).refine((val) => Number(val) >= 0 , {
      message: "Selecione uma prioridade",
    }),
})

interface Props{
    produtoId: number;
    atividade?: Atividade;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function ModalEditarAtividade({
    produtoId,
    atividade,
    open,
    onOpenChange,
    onSuccess
}: Props){
    
    const queryClient = useQueryClient();
    const isEditando = !!atividade;
    const { mostrarToast } = useToast();

    const form = useForm<z.infer<typeof atividadeSchema>>({
        resolver: zodResolver(atividadeSchema),
        defaultValues: {
            nome: "",
            descricao: "",
        },
    })

    useEffect(() => {
        if (atividade) {
            // Converte prioridade para número se vier como string do backend
            let prioridadeValue: number;
            if (typeof atividade.prioridade === 'number') {
                prioridadeValue = atividade.prioridade;
            } else if (typeof atividade.prioridade === 'string') {
                // Se vier como string "BAIXA", "MEDIA", "ALTA", converte para número
                prioridadeValue = Prioridade[atividade.prioridade as keyof typeof Prioridade];
            } else {
                prioridadeValue = Prioridade.BAIXA;
            }
            
            form.reset({
                nome: atividade.nome,
                descricao: atividade.descricao,
                prioridade: prioridadeValue
            });
        } else {
            form.reset({
                nome: "",
                descricao: "",
            });
        }
    }, [atividade, form]);

    const handleSubmit = async (data: z.infer<typeof atividadeSchema>) => {
        if (!data.nome || data.nome.trim().length === 0) {
            form.setError("nome", { message: "Nome é obrigatório" });
            return;
        }
        if (!data.descricao || data.descricao.trim().length === 0) {
            form.setError("descricao", { message: "Descrição é obrigatória" });
            return;
        }

        try {
            if (isEditando) {
                const response = await api.put(`api/v1/produtos/${produtoId}/atividades/${atividade.id}`, 
                    {
                        ...data,
                        prioridade: data.prioridade ?? Prioridade.BAIXA
                    },
                    {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.status === 200 || response.status === 201) {
                    mostrarToast(response.status, "Atividade atualizada com sucesso!");
                    onOpenChange(false);
                    queryClient.invalidateQueries({ queryKey: ['atividades-produto'] });
                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    mostrarToast(response.status, "Erro ao atualizar atividade. Verifique os dados e tente novamente.");
                }
            } else {
                const response = await api.post(`api/v1/produtos/${produtoId}/atividades`, 
                    {
                        ...data,
                        prioridade: data.prioridade ?? Prioridade.BAIXA
                    },
                    {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.status === 200 || response.status === 201) {
                    mostrarToast(response.status, "Atividade criada com sucesso!");
                    onOpenChange(false);
                    queryClient.invalidateQueries({ queryKey: ['atividades-produto'] });
                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    mostrarToast(response.status, "Erro ao criar atividade. Verifique os dados e tente novamente.");
                }
            }
        } catch (error: any) {
            console.error("Erro no submit:", error);
            const statusCode = error?.response?.status || error?.statusCode || 500;
            const mensagem = error?.response?.data?.message || error?.message || "Erro ao salvar atividade. Tente novamente.";
            mostrarToast(statusCode, mensagem);
        }
    }

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle className="mb-4">{isEditando ? "Editar atividade" : "Incluir nova atividade"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-y-6 w-full h-full">
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem className="align-baseline">
                                <FormLabel>Nome <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        value={String(field.value ?? "")}
                                        onChange={field.onChange}
                                        placeholder="Nome"
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="descricao"
                            render={({ field }) => (
                                <FormItem className="align-baseline">
                                <FormLabel>Descrição <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        value={String(field.value ?? "")}
                                        onChange={field.onChange}
                                        placeholder="Descrição"
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="prioridade"
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
                        <Button 
                            type="submit"
                            variant={'secondary'}
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                        >
                            Salvar
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

