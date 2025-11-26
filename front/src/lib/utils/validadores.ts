/**
 * Remove caracteres não numéricos de uma string
 */
export function limparDocumento(documento: string): string {
  return documento.replace(/\D/g, "");
}

/**
 * Formata CNPJ com máscara (XX.XXX.XXX/XXXX-XX)
 */
export function formatarCNPJ(cnpj: string): string {
  const cnpjLimpo = limparDocumento(cnpj);
  
  if (cnpjLimpo.length <= 2) {
    return cnpjLimpo;
  } else if (cnpjLimpo.length <= 5) {
    return `${cnpjLimpo.slice(0, 2)}.${cnpjLimpo.slice(2)}`;
  } else if (cnpjLimpo.length <= 8) {
    return `${cnpjLimpo.slice(0, 2)}.${cnpjLimpo.slice(2, 5)}.${cnpjLimpo.slice(5)}`;
  } else if (cnpjLimpo.length <= 12) {
    return `${cnpjLimpo.slice(0, 2)}.${cnpjLimpo.slice(2, 5)}.${cnpjLimpo.slice(5, 8)}/${cnpjLimpo.slice(8)}`;
  } else {
    return `${cnpjLimpo.slice(0, 2)}.${cnpjLimpo.slice(2, 5)}.${cnpjLimpo.slice(5, 8)}/${cnpjLimpo.slice(8, 12)}-${cnpjLimpo.slice(12, 14)}`;
  }
}

/**
 * Valida CNPJ
 */
export function validarCNPJ(cnpj: string): boolean {
  const cnpjLimpo = limparDocumento(cnpj);

  if (cnpjLimpo.length !== 14) {
    return false;
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpjLimpo)) {
    return false;
  }

  // Validação dos dígitos verificadores
  let tamanho = cnpjLimpo.length - 2;
  let numeros = cnpjLimpo.substring(0, tamanho);
  const digitos = cnpjLimpo.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) {
    return false;
  }

  tamanho = tamanho + 1;
  numeros = cnpjLimpo.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) {
    return false;
  }

  return true;
}

/**
 * Valida CPF
 */
export function validarCPF(cpf: string): boolean {
  const cpfLimpo = limparDocumento(cpf);

  if (cpfLimpo.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpfLimpo)) {
    return false;
  }

  // Validação dos dígitos verificadores
  let soma = 0;
  let resto: number;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(9, 10))) {
    return false;
  }

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(10, 11))) {
    return false;
  }

  return true;
}

/**
 * Valida CNPJ ou CPF
 */
export function validarCNPJouCPF(documento: string): boolean {
  const documentoLimpo = limparDocumento(documento);
  
  if (documentoLimpo.length === 11) {
    return validarCPF(documento);
  } else if (documentoLimpo.length === 14) {
    return validarCNPJ(documento);
  }
  
  return false;
}

/**
 * Valida senha forte
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Pelo menos uma letra maiúscula
 * - Pelo menos um número
 * - Pelo menos um caractere especial
 */
export function validarSenhaForte(senha: string): boolean {
  if (!senha || senha.length < 8) {
    return false;
  }

  const temMaiuscula = /[A-Z]/.test(senha);
  const temMinuscula = /[a-z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const temEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha);

  return temMaiuscula && temMinuscula && temNumero && temEspecial;
}

/**
 * Retorna mensagem de erro detalhada para senha fraca
 */
export function getMensagemErroSenha(senha: string): string {
  if (!senha || senha.length < 8) {
    return "A senha deve ter no mínimo 8 caracteres";
  }

  const erros: string[] = [];
  
  if (!/[A-Z]/.test(senha)) {
    erros.push("uma letra maiúscula");
  }
  if (!/[a-z]/.test(senha)) {
    erros.push("uma letra minúscula");
  }
  if (!/[0-9]/.test(senha)) {
    erros.push("um número");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
    erros.push("um caractere especial");
  }

  if (erros.length > 0) {
    return `A senha deve conter ${erros.join(", ")}`;
  }

  return "";
}

