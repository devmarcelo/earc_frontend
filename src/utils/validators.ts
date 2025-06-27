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
