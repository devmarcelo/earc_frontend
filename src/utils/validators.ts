// src/utils/validators.ts

export const isNotEmpty = (value: string): boolean => {
  return value.length > 0;
};

export const isValidRegex = (value: string, pattern: string): boolean => {
  return new RegExp(pattern).test(value);
};

export const isValidCep = (value: string): boolean => {
  return value.replace(/\D/g, "").length !== 8;
};

export const isValidMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const isValidDocument = (value: string): boolean => {
  const digits = value.replace(/\D/g, "");

  // Validação de CPF
  if (digits.length === 11) {
    let sum = 0;
    let remainder;

    if (/^(\d)\1{10}$/.test(digits)) {
      return false;
    }

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(digits.charAt(i - 1)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(digits.charAt(9))) {
      return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(digits.charAt(i - 1)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(digits.charAt(10))) {
      return false;
    }

    return true;
  }

  // Validação de CNPJ
  if (digits.length === 14) {
    if (/^(\d)\1{13}$/.test(digits)) {
      return false;
    }

    const calcCheckDigit = (base: string, weights: number[]) =>
      weights.reduce((acc, w, i) => acc + parseInt(base[i]) * w, 0) % 11;

    const base = digits.slice(0, 12);
    const verifiers = digits.slice(12);

    const digit1 = calcCheckDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    const expected1 = digit1 < 2 ? 0 : 11 - digit1;
    if (expected1 !== parseInt(verifiers[0])) {
      return false;
    }

    const digit2 = calcCheckDigit(
      base + expected1,
      [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    );
    const expected2 = digit2 < 2 ? 0 : 11 - digit2;

    if (expected2 !== parseInt(verifiers[1])) {
      return false;
    }

    return true;
  }

  return false;
};
