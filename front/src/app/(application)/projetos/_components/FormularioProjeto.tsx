import { Button } from "@/components/ui/button";
import DateInput from "@/components/ui/date-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ClienteResponseDto } from "@/lib/Interface/Cliente";
import ClienteRequisicao from "@/server/Cliente/ClienteRequisicao";
import ProjetoRequisicao from "@/server/ProjetoRequisicao";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useToast } from "@/lib/hooks/useToast";

const novoProjetoSchema = z.object({
    nome: z.preprocess(
        (val) => val === undefined || val === null ? "" : String(val),
        z.string()
    ).refine(
        (val) => typeof val === 'string' && val.trim().length > 0,
        { message: "Nome é obrigatório" }
    ),
    objetivo: z.preprocess(
        (val) => val === undefined || val === null ? "" : String(val),
        z.string()
    ).refine(
        (val) => typeof val === 'string' && val.trim().length > 0,
        { message: "Objetivo é obrigatório" }
    ),
    inicio: z.date().optional(),
    termino: z.date().optional(),
    idCliente: z.number().optional()
})

interface FormularioProdutosProps {
    onSuccess?: () => void;
    projetoId?: number;
    valoresIniciais?: {
        nome: string;
        objetivo: string;
    };
}

export default function FormularioProjeto({ onSuccess, projetoId, valoresIniciais }: FormularioProdutosProps = {}) { 
    
    const queryClient = useQueryClient();
    const isEditando = !!projetoId;
    const { mostrarToast } = useToast();

    type FormData = {
        nome: string;
        objetivo: string;
        inicio?: Date;
        termino?: Date;
        idCliente?: number;
    };

    const form = useForm<FormData>({
        resolver: zodResolver(novoProjetoSchema) as any,
        defaultValues: {
            nome: valoresIniciais?.nome || "",
            objetivo: valoresIniciais?.objetivo || "",
        },
    })

    useEffect(() => {
        refetch()
    }, [form])

    useEffect(() => {
        if (valoresIniciais) {
            form.reset({
                nome: valoresIniciais.nome,
                objetivo: valoresIniciais.objetivo,
                inicio: undefined,
                termino: undefined,
                idCliente: undefined
            });
        }
    }, [valoresIniciais, form])

    const { data, isLoading, refetch } = useQuery<ClienteResponseDto[] | null>({
        queryKey: ['clientes-projeto'],
        queryFn: async () => {
            const response = await ClienteRequisicao.buscarTodos();
            return response.data; 
        },
    })

    const handleSubmit = async (data: z.infer<typeof novoProjetoSchema>) => {
        try {
            if (isEditando) {
                const response = await ProjetoRequisicao.atualizar(projetoId!, { 
                    nome: String(data.nome).trim(), 
                    objetivo: String(data.objetivo).trim() 
                });
                
                if (response.statusCode === 200 || response.statusCode === 201) {
                    mostrarToast(response.statusCode, "Projeto atualizado com sucesso!");
                    if(onSuccess) onSuccess();
                    queryClient.invalidateQueries({ queryKey: ['projetos'] });
                } else {
                    mostrarToast(response.statusCode, response.error || "Erro ao atualizar projeto. Verifique os dados e tente novamente.");
                }
            } else {
                const response = await ProjetoRequisicao.criar(data);
                
                if (response.statusCode === 200 || response.statusCode === 201) {
                    mostrarToast(response.statusCode, "Projeto criado com sucesso!");
                    if(onSuccess) onSuccess();
                    queryClient.invalidateQueries({ queryKey: ['projetos'] });
                } else {
                    mostrarToast(response.statusCode, response.error || "Erro ao criar projeto. Verifique os dados e tente novamente.");
                }
            }
        } catch (error: any) {
            console.error("Erro no handleSubmit:", error);
            const statusCode = error?.response?.status || error?.statusCode || 500;
            const mensagem = error?.response?.data?.message || error?.message || "Erro ao salvar projeto. Tente novamente.";
            mostrarToast(statusCode, mensagem);
        }
    }

    const onSubmitClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        const formData = form.getValues();
        let hasErrors = false;
        
        if (!isEditando) {
            form.clearErrors("inicio");
            form.clearErrors("termino");
            form.clearErrors("idCliente");
            
            if (!formData.inicio) {
                form.setError("inicio", { 
                    type: "manual",
                    message: "Data de início é obrigatória" 
                });
                hasErrors = true;
            }
            
            if (!formData.termino) {
                form.setError("termino", { 
                    type: "manual",
                    message: "Data de término é obrigatória" 
                });
                hasErrors = true;
            }
            
            if (formData.inicio && formData.termino) {
                const inicio = new Date(formData.inicio);
                const termino = new Date(formData.termino);
                
                if (inicio > termino) {
                    form.setError("inicio", { 
                        type: "manual",
                        message: "Data de início não pode ser posterior à data de término" 
                    });
                    form.setError("termino", { 
                        type: "manual",
                        message: "Data de término não pode ser anterior à data de início" 
                    });
                    hasErrors = true;
                }
            }
            
            if (!formData.idCliente) {
                form.setError("idCliente", { 
                    type: "manual",
                    message: "Cliente é obrigatório" 
                });
                hasErrors = true;
            }
        }
        
        const isValid = await form.trigger(["nome", "objetivo"]);
        
        if (!isValid || hasErrors) {
            return;
        }
        
        await handleSubmit(formData as z.infer<typeof novoProjetoSchema>);
    };

    return (
        <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-y-6 w-full h-full">
                <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                        <FormItem className="align-baseline">
                        <FormLabel>Nome <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                            <Input
                                value={String(field.value)}
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
                    name="objetivo"
                    render={({ field }) => (
                        <FormItem className="align-baseline">
                        <FormLabel>Objetivo <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                            <Textarea
                                value={String(field.value)}
                                onChange={field.onChange}
                                placeholder="Objetivo"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                {!isEditando && (
                    <FormField
                        control={form.control}
                        name="idCliente"
                        render={({ field }) => (
                            <FormItem className="align-baseline">
                            <FormLabel>Cliente <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value ? field.value.toString() : ""}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o cliente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Clientes</SelectLabel>
                                            {data?.map((cliente, index) => (
                                                <SelectItem key={index} value={cliente.id.toString()}>
                                                    {cliente.codigo} - {cliente.razaoSocial}
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
                )}
                {!isEditando && (
                    <div className="flex justify-between">
                        <FormField
                            control={form.control}
                            name="inicio"
                            render={({ field }) => (
                                <FormItem className="align-baseline">
                                <FormLabel>Data de início <span className="text-red-500">*</span></FormLabel>
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
                            name="termino"
                            render={({ field }) => (
                                <FormItem className="align-baseline">
                                <FormLabel>Data fim <span className="text-red-500">*</span></FormLabel>
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
                )}
                <Button 
                    type="button"
                    variant={'secondary'}
                    onClick={onSubmitClick}
                >
                    Salvar
                </Button>
            </form>
        </Form>
    )
}