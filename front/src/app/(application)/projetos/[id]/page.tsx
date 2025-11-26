import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ViewProjeto from "./_components/ViewProjeto";
import { routes } from "@/app/_navigation/routes";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Projeto({ params }: PageProps) {
    const cookieStore = await cookies();
    const role = cookieStore.get("user-role")?.value;
    const token = cookieStore.get("auth-token")?.value;
    
    // Se for cliente externo, verifica se o projeto pertence a ele
    if (role === "Externo") {
        const { id } = params;
        try {
            // Busca os projetos do cliente externo
            const meusProjetosResponse = await fetch(`http://localhost:8080/api/v1/projetos/meus-projetos`, {
                headers: {
                    "Authorization": token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json",
                },
                cache: "no-store"
            });

            if (meusProjetosResponse.ok) {
                const meusProjetos = await meusProjetosResponse.json();
                const projetoPertenceAoCliente = meusProjetos.some((p: any) => p.id === parseInt(id));
                
                if (!projetoPertenceAoCliente) {
                    redirect(routes.meusProjetos);
                }
            } else {
                redirect(routes.meusProjetos);
            }
        } catch (error) {
            redirect(routes.meusProjetos);
        }
    }

    return (
        <div className="flex gap-x-4 items-center justify-evenly w-full">
            <ViewProjeto />
        </div>
    );
}
