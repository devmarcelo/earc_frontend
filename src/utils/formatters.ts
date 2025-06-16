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
