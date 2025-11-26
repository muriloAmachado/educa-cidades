
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { validarCNPJ, formatarCNPJ, limparDocumento, validarSenhaForte, getMensagemErroSenha } from "@/lib/utils/validadores";

export interface CampoFormulario {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "password" | "password-strong" | "select" | "text-area" | "cnpj";
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  largura?: "full" | "half";
  tooltip?: string;
}

export interface FormularioGenericoProps {
  titulo?: string;
  campos: CampoFormulario[];
  valoresIniciais: Record<string, unknown>;
  onSubmit: (dados: Record<string, unknown>) => Promise<void>;
  textoBotao?: string;
  mostrarSeparador?: boolean;
  acoesExtras?: Record<string, (value: string) => void>;
}

export default function FormularioGenerico({
  titulo,
  campos,
  valoresIniciais,
  onSubmit,
  textoBotao = "Salvar",
  mostrarSeparador = true,
  acoesExtras = {},
}: FormularioGenericoProps) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};
  
  campos.forEach(campo => {
    let fieldSchema: z.ZodTypeAny;
    
    switch (campo.type) {
      case "number":
        if (campo.required) {
          fieldSchema = z.number().refine(
            (val) => val !== undefined && val !== null,
            { message: `${campo.label} é obrigatório` }
          );
        } else {
          fieldSchema = z.number().optional();
        }
        if (campo.min !== undefined) fieldSchema = (fieldSchema as z.ZodNumber).min(campo.min);
        if (campo.max !== undefined) fieldSchema = (fieldSchema as z.ZodNumber).max(campo.max);
        break;
      case "email":
        let emailSchema = z.string().email("Email inválido");
        if (campo.maxLength !== undefined) {
          emailSchema = emailSchema.max(campo.maxLength);
        }
        fieldSchema = z.preprocess(
          (val) => val === undefined || val === null ? "" : String(val),
          emailSchema
        );
        if (campo.required) {
          fieldSchema = fieldSchema.refine(
            (val) => typeof val === 'string' && val.trim().length > 0,
            { message: `${campo.label} é obrigatório` }
          );
        }
        break;
      case "cnpj":
        let cnpjSchema = z.string();
        fieldSchema = z.preprocess(
          (val) => val === undefined || val === null ? "" : String(val),
          cnpjSchema.refine(
            (val) => !campo.required || (typeof val === 'string' && val.trim().length > 0),
            { message: `${campo.label} é obrigatório` }
          ).refine(
            (val) => !campo.required || val.trim().length === 0 || validarCNPJ(val),
            { message: `${campo.label} inválido` }
          )
        );
        break;
      case "password-strong":
        let passwordStrongSchema = z.string();
        fieldSchema = z.preprocess(
          (val) => val === undefined || val === null ? "" : String(val),
          passwordStrongSchema.refine(
            (val) => !campo.required || (typeof val === 'string' && val.trim().length > 0),
            { message: `${campo.label} é obrigatório` }
          ).refine(
            (val) => {
              if (!campo.required && val.trim().length === 0) return true;
              return validarSenhaForte(val);
            },
            { message: "A senha deve ter no mínimo 8 caracteres, contendo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial" }
          )
        );
        break;
      default:
        let stringSchema = z.string();
        if (campo.minLength !== undefined) {
          stringSchema = stringSchema.min(campo.minLength);
        }
        if (campo.maxLength !== undefined) {
          stringSchema = stringSchema.max(campo.maxLength);
        }
        fieldSchema = z.preprocess(
          (val) => val === undefined || val === null ? "" : String(val),
          stringSchema
        );
        if (campo.required) {
          fieldSchema = fieldSchema.refine(
            (val) => typeof val === 'string' && val.trim().length > 0,
            { message: `${campo.label} é obrigatório` }
          );
        }
    }
    
    schemaFields[campo.name] = fieldSchema;
  });

  const schema = z.object(schemaFields);

  const form = useForm({
    defaultValues: valoresIniciais,
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const handleSubmit = () => {
    onSubmit(form.getValues()).finally(
      () => form.reset()
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col w-full space-y-4">
        <h1 className="text-2xl font-bold">{titulo}</h1>
        {mostrarSeparador && <Separator />}
        
        <div className="flex flex-wrap space-y-4">
          {campos.map((campo) => (
            <div
              key={campo.name}
              className={`px-2 ${campo.largura === "half" ? "w-1/2" : "w-full"}`}
            >
              <FormField
                control={form.control}
                name={campo.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {campo.label}

                      {campo.tooltip && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="text-gray-400 hover:text-educa-primary transition-colors ml-1">
                                <Info className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              {campo.tooltip}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {campo.required && <span className="text-red-500 ml-1">*</span>}
                    </FormLabel>
                    <FormControl className="w-full">
                      {campo.type === "select" ? (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (acoesExtras && acoesExtras[campo.name]) {
                              acoesExtras[campo.name](value);
                            }
                          }}
                          defaultValue={field.value ? String(field.value) : undefined}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={campo.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {campo.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : campo.type == 'text-area' ? 
                      (
                        <Textarea
                          value={String(field.value ?? "")}
                          onChange={field.onChange}
                          placeholder={campo.placeholder}
                        />
                      ) :
                      (
                        <Input
                          {...field}
                          type={campo.type === "cnpj" ? "text" : campo.type === "password-strong" ? "password" : campo.type}
                          placeholder={campo.placeholder}
                          value={campo.type === "cnpj" ? formatarCNPJ(String(field.value ?? "")) : String(field.value ?? "")}
                          onChange={(e) => {
                            if (campo.type === "number") {
                              const value = e.target.value;
                              if (value === "") {
                                field.onChange(undefined);
                              } else {
                                const numValue = Number(value);
                                if (!isNaN(numValue)) {
                                  field.onChange(numValue);
                                }
                              }
                            } else if (campo.type === "cnpj") {
                              // Remove máscara antes de salvar no form
                              const valorLimpo = limparDocumento(e.target.value);
                              // Limita a 14 caracteres (tamanho do CNPJ)
                              if (valorLimpo.length <= 14) {
                                field.onChange(valorLimpo);
                              }
                            } else {
                              field.onChange(e.target.value);
                            }
                            
                            if (campo.type === "password-strong" && e.target.value.length > 0) {
                              form.trigger(campo.name);
                            }
                          }}
                          onBlur={() => {
                            if (campo.type === "password-strong") {
                              form.trigger(campo.name);
                            }
                            field.onBlur();
                          }}
                          className="w-full"
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        {/* <div className="space-y-4">
          {campos.map((campo) => (
            <FormField
              key={campo.name}
              control={form.control}
              name={campo.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {campo.label}
                    {campo.required && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                  <FormControl>
                    {campo.type === "select" ? (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (acoesExtras && acoesExtras[campo.name]) {
                            acoesExtras[campo.name](value);
                          }
                        }}
                        defaultValue={String(field.value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={campo.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {campo.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        {...field}
                        type={campo.type}
                        placeholder={campo.placeholder}
                        value={String(field.value ?? "")}
                        onChange={(e) => {
                          if (campo.type === "number") {
                            field.onChange(e.target.value ? Number(e.target.value) : "");
                          } else {
                            field.onChange(e.target.value);
                          }
                        }}
                      />
                    )}
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div> */}
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-secondary text-white"
          >
            {textoBotao}
          </Button>
        </div>
      </form>
    </Form>
  );
}
