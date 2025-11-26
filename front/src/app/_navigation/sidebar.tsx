"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Image from "next/image";
import SiderbarItem from "./SidebatItem";
import { SidebarConfigItem } from "./types";
import { RxDashboard } from "react-icons/rx";
import { routes } from "./routes";
import { FiUsers } from "react-icons/fi";
import Sessao from "@/lib/utils/Sessao";
import { useEffect, useState } from "react";
import { Contact, PackageOpen, FileText, Monitor, Calendar } from "lucide-react";

export function AppSidebar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isExterno, setIsExterno] = useState(false);

  useEffect(() => {
    const role = Sessao.buscarRole();
    setIsAdmin(role === "Administrador");
    setIsExterno(role === "Externo");
  }, []);

  const mockItems: SidebarConfigItem[] = [
    // Dashboard, Produtos, Clientes e Projetos não são visíveis para clientes externos
    ...(isExterno
      ? []
      : [
          {
            title: "Dashboard",
            route: routes.inicio,
            icon: <RxDashboard />,
            root: true,
          },
          {
            title: "Produtos",
            route: routes.produtos,
            icon: <PackageOpen />,
            root: true,
          },
          {
            title: "Clientes",
            route: routes.clientes,
            icon: <Contact />,
            root: true,
          },
          {
            title: "Projetos",
            route: routes.projetos,
            icon: <FileText />,
            root: true,
          },
        ]),
    // {
    //   title: "Demo Estática",
    //   route: routes.demoEstatica,
    //   icon: <Monitor />,
    //   root: true,
    // },
    {
      title: "Agenda",
      route: routes.agenda,
      icon: <Calendar />,
      root: true,
    },
    ...(isExterno
      ? [
          {
            title: "Meus Projetos",
            route: routes.meusProjetos,
            icon: <FileText />,
            root: true,
          },
        ]
      : []),
    // {
    //   title: "Projetos",
    //   route: routes.projetos,
    //   icon: <SiExcalidraw />,
    //   root: true,
    // },
    ...(isAdmin
      ? [
          {
            title: "Usuários",
            route: routes.usuarios,
            icon: <FiUsers />,
            root: true,
          },
        ]
      : []),
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-between group-data-[collapsible=icon]:justify-center mt-4 mb-4">
        <div className="group-data-[collapsible=icon]:hidden">
          <Image src="/Logo-Educa-L-cor.svg" width={142} height={24} alt="" />
        </div>
        <SidebarTrigger className="group-data-[collapsible=icon]:mt-2 !p-0 max-md:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarSeparator className="hidden group-data-[collapsible=icon]:block" />
        <SidebarGroup>
          <SidebarMenu>
            {mockItems.map((item) => (
              <SiderbarItem key={item.title} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
