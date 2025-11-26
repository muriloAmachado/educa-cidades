import UsuarioRequisicao from "./Usuario/UsuarioRequisicao";
import ClienteRequisicao from "./Cliente/ClienteRequisicao";
import LoginRequisicao from "./OnBoarding/LoginRequisicao";
import DashboardRequisicao from "./Dashboard/DashboardRequisicao";

export const Onboarding = {
  Login: LoginRequisicao,
} as const;

export const Usuarios = {
  Usuario: UsuarioRequisicao,
} as const;

export const Clientes = {
  Cliente: ClienteRequisicao,
} as const;

export const Dashboards = {
  Dashboard: DashboardRequisicao,
} as const;