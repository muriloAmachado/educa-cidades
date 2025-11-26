import { Button } from "@/components/ui/button";
import DateInput from "@/components/ui/date-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Prioridade } from "@/lib/Types/Prioridade";
import { mapperDescricaoPrioridade, mapperDescricaoStatus, mapperStatusParaNumero, StatusTarefa, TarefaCreateRequestDTO, TarefaResponseDto } from "@/lib/Types/Tarefas";
import ProjetoRequisicao from "@/server/ProjetoRequisicao";
import TarefasRequisicao from "@/server/TarefasRequisicao";
import api from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const novaTarefaSchema = z.object({
  idProjetoProduto: z.number(),
  nome: z.string(),
  descricao: z.string(),
  idResponsavel: z.number({error: "Informe um usuário responsável"}).refine(val => val, {error: "Informe um usuário responsável"}),
  prioridade: z.union
    ([z.undefined(), z.enum(Prioridade)])
    .refine((val) => Number(val) >= 0 , {
        message: "Selecione uma prioridade",
      }),
  url: z.string(""),
  status: z
  .number()
  .int()
  .refine((v) => Object.values(StatusTarefa).includes(v), {
    message: "Status inválido",
  })
  .optional(),
  prazo: z.date({error: "Informe o prazo da tarefa."}),
});

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  produtoProjetoId: number;
  projetoId: number;
  tarefaEditada?: TarefaResponseDto;
}

export default function ModalIncluirTarefaProdutoProjeto({ 
  open,
  setOpen,
  produtoProjetoId, 
  projetoId,
  tarefaEditada
}: Props) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof novaTarefaSchema>>({
    resolver: zodResolver(novaTarefaSchema),
    defaultValues: {
      idProjetoProduto: produtoProjetoId,
      nome: "",
      descricao: "",
      url: "",
    },
  });

  useEffect(() => {
    if (tarefaEditada) {
      form.reset({
        idProjetoProduto: produtoProjetoId,
        nome: tarefaEditada.nome,
        descricao: tarefaEditada.descricao,
        url: tarefaEditada.url ?? "",
        prazo: tarefaEditada.prazo ? new Date(tarefaEditada.prazo) : undefined,
        prioridade: mapperDescricaoPrioridade[tarefaEditada.prioridade],
        status: mapperStatusParaNumero[tarefaEditada.status],
        idResponsavel: tarefaEditada.responsavel.id ?? undefined,
      });
      setOpen(true);
    }
    else{
      form.reset()
    }
  }, [tarefaEditada, open]);

  const {data, isLoading} = useQuery({
    queryKey: ['usuarios-projeto'],
    queryFn: async () => {
      const response = await ProjetoRequisicao.buscarUsuario(projetoId);
      return response.data
    }
  })

  const handleSubmit = async () => {
    const data = form.getValues();

    const body: TarefaCreateRequestDTO = {
      ...data,
      prioridade: data.prioridade ?? Prioridade.BAIXA,
      status: tarefaEditada ? data.status : undefined
    };

    try {
      const response = tarefaEditada
        ? await TarefasRequisicao.atualizar(tarefaEditada.id, body)
        : await TarefasRequisicao.criar(body);

      if (response.statusCode === 201 || response.statusCode === 204) {
        toast.success(
          tarefaEditada ? "Tarefa atualizada com sucesso!" : "Tarefa criada com sucesso!"
        );
      } else {
        const erro = (response as any)?.error;

        const mensagemErro =
          typeof erro === "string" ? erro : erro?.error?.toString();

        toast.error(mensagemErro ?? "Erro ao salvar tarefa");
      }
    } finally {
      queryClient.invalidateQueries({
        queryKey: ["tarefas-projeto-produto"],
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Incluir nova tarefa</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-y-6 w-full h-full"
          >
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem className="align-baseline">
                  <FormLabel>Nome</FormLabel>
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
              name="descricao"
              render={({ field }) => (
                <FormItem className="align-baseline">
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      value={String(field.value)}
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
              name="url"
              render={({ field }) => (
                <FormItem className="align-baseline">
                  <FormLabel>URL</FormLabel>
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
            <div className="flex w-full justify-between align-top">
            <FormField
              control={form.control}
              name="prazo"
              render={({ field }) => (
                  <FormItem className="w-full">
                  <FormLabel>Prazo</FormLabel>
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
              name="prioridade"
              render={({ field }) => (
              <FormItem className="w-full">
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
                            .filter((key) => isNaN(Number(key)))
                            .map((key) => (
                              <SelectItem
                                key={key}
                                value={Prioridade[
                                  key as keyof typeof Prioridade
                                ].toString()}
                              >
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
            </div>
            {tarefaEditada && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value !== undefined ? field.value.toString() : ""}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectGroup>
                            {Object.keys(StatusTarefa)
                            .filter((key) => isNaN(Number(key)))
                            .map((key) => (
                              <SelectItem
                                key={key}
                                value={StatusTarefa[
                                  key as keyof typeof StatusTarefa
                                ].toString()}
                              >
                                {mapperDescricaoStatus[key as keyof typeof StatusTarefa]}
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
            <FormField
              control={form.control}
              name='idResponsavel'
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Responsável</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? field.value.toString() : ""}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um usuário"} />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Usuários</SelectLabel>

                          {(data ?? []).map((usuario: any) => (
                            <SelectItem
                              key={usuario.id}
                              value={usuario.id.toString()}
                            >
                              {usuario.nome}
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
              variant={"secondary"}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Salvar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
