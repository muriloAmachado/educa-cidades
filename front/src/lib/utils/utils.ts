import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Sessao from "./Sessao";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Utils = {
  Sessao: Sessao,
} as const;
