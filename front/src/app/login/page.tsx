"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Utils } from "@/lib/utils/utils";
import { Onboarding } from "@/server/modulos";
import { useRouter } from "next/dist/client/components/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { routes } from "../_navigation/routes";

export default function Login() {
  const form = useForm({
    defaultValues: {
      login: "",
      senha: "",
    },
  });

  const router = useRouter();
  const redirectPath = routes.inicio;

  const { buscarTokenAcesso, limparTodos } = Utils.Sessao;

  async function onSubmit() {
    const token = buscarTokenAcesso();
    if (token) limparTodos();

    try {
      const response = await Onboarding.Login.login({
        login: form.getValues("login"),
        senha: form.getValues("senha"),
      });

      if (response.error) {
        console.log("Erro no login:", response.error);
      } else {
        router.push(redirectPath);
      }
    } catch (error) {
      console.error("Erro ao chamar a API de login:", error);
    }
  }

  return (
    <div className="flex gap-x-4 items-center w-full">
      <div className="flex flex-col gap-y-4 px-24 items-center align-middle flex-1">
        <h1 className="text-5xl mb-16 font-bold">Bem vindo</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4 w-full h-full"
          >
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem className="align-baseline">
                  <FormControl>
                    <Input
                      value={String(field.value)}
                      onChange={field.onChange}
                      placeholder="Login"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem className="align-baseline">
                  <FormControl>
                    <Input
                      value={String(field.value)}
                      onChange={field.onChange}
                      type="password"
                      placeholder="Senha"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-end">
              <p className="underline hover:cursor-pointer">
                Esqueceu a senha?
              </p>
            </div>
            <Button
              type="submit"
              variant='default' 
              className="w-full py-6 bg-educa-primary text-white hover:text-black"
            >
              Entrar
            </Button>
          </form>
        </Form>
      </div>
      <div className="w-1/2 text-center">
        <Image src="/Logo-Educa-L-cor.svg" width={250} height={70} alt="" />
        <div className="w-1/2 text-center mt-auto">
          <Image
            src="/team-checklist-rafiki.svg"
            width={689}
            height={411}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
