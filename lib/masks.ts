/**
 * Utilitários de Máscaras e Validações Brasileiras (CNPJ, Telefone, WhatsApp, CEP, UF)
 */

export function cleanDigits(value: string | null | undefined): string {
  if (!value) return "";
  return value.replace(/\D/g, "");
}

/**
 * Máscara dinâmica de CNPJ (00.000.000/0000-00)
 */
export function maskCNPJ(value: string): string {
  const digits = cleanDigits(value).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

/**
 * Validação rigorosa de CNPJ (Dígitos verificadores + Sequências repetidas)
 */
export function isValidCNPJ(cnpj: string): boolean {
  const digits = cleanDigits(cnpj);

  if (!digits) return true; // Se estiver em branco e for opcional, passa
  if (digits.length !== 14) return false;

  // Rejeita sequências inválidas conhecidas (ex: 00000000000000, 11111111111111)
  if (/^(\d)\1{13}$/.test(digits)) return false;

  // Validação do 1º dígito verificador
  let size = digits.length - 2;
  let numbers = digits.substring(0, size);
  const checkDigits = digits.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(checkDigits.charAt(0))) return false;

  // Validação do 2º dígito verificador
  size = size + 1;
  numbers = digits.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(checkDigits.charAt(1))) return false;

  return true;
}

/**
 * Máscara dinâmica de Celular / WhatsApp: (00) 00000-0000 ou Fixo: (00) 0000-0000
 */
export function maskPhone(value: string): string {
  const digits = cleanDigits(value).slice(0, 11);

  if (digits.length <= 10) {
    // (00) 0000-0000
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  // (00) 00000-0000
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

/**
 * Validação de Telefone / Celular brasileiro
 */
export function isValidPhone(phone: string): boolean {
  const digits = cleanDigits(phone);
  if (!digits) return false;
  // DDD válido (11 a 99) + 8 ou 9 dígitos
  return digits.length >= 10 && digits.length <= 11 && !/^(\d)\1+$/.test(digits);
}

/**
 * Máscara de CEP (00000-000)
 */
export function maskCEP(value: string): string {
  const digits = cleanDigits(value).slice(0, 8);
  return digits.replace(/^(\d{5})(\d)/, "$1-$2");
}

/**
 * Máscara de UF (2 letras maiúsculas)
 */
export function maskUF(value: string): string {
  return value.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();
}
