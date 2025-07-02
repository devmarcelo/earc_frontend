// src/utils/formatters.ts

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatUser = (userId?: number | string) => {
  if (!userId) return "-";
  return typeof userId === "number" ? `Usuário ${userId}` : userId;
};

export const formatCep = (value: string): string => {
  return value.replace(/\D/g, "").replace(/(\d{5})(\d{3})/, "$1-$2");
};

export const formatDocument = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 11) {
    return digits.replace(
      /(\d{3})(\d{3})(\d{3})(\d{0,2})/,
      (_, p1, p2, p3, p4) =>
        [p1, p2, p3].filter(Boolean).join(".") + (p4 ? "-" + p4 : ""),
    );
  } else {
    return digits.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/,
      (_, p1, p2, p3, p4, p5) =>
        [p1, p2, p3].filter(Boolean).join(".") +
        "/" +
        p4 +
        (p5 ? "-" + p5 : ""),
    );
  }
};

export const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};
