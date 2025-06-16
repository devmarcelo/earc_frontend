// Tipos base para auditoria
export interface AuditFields {
  created_on: string;
  updated_at: string;
  created_by?: number | string;
  updated_by?: number | string;
}

// Interface base para entidades auditáveis
export interface BaseEntity extends AuditFields {
  id: number;
}

// Tipos específicos para cada entidade
export interface Cliente extends BaseEntity {
  nome: string;
  contato?: string;
  endereco?: string;
}

export interface Fornecedor extends BaseEntity {
  nome: string;
  contato?: string;
  endereco?: string;
}

export interface Categoria extends BaseEntity {
  nome: string;
  tipo: "Receita" | "Despesa" | "Estoque";
}

export interface Receita extends BaseEntity {
  data: string;
  descricao: string;
  valor: number;
  cliente_id?: number;
  categoria_id?: number;
}

export interface Despesa extends BaseEntity {
  data: string;
  descricao: string;
  valor: number;
  fornecedor_id?: number;
  categoria_id?: number;
}

export interface ContaPagarReceber extends BaseEntity {
  tipo: "Pagar" | "Receber";
  descricao: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  cliente_id?: number;
  fornecedor_id?: number;
}

export interface ItemEstoque extends BaseEntity {
  nome_produto: string;
  quantidade: number;
  custo_unitario: number;
  categoria_id?: number;
}

export interface Funcionario extends BaseEntity {
  nome: string;
  cargo?: string;
  salario_base?: number;
  data_proximo_pagamento?: string;
}

export interface MetaResultado extends BaseEntity {
  mes_ano: string;
  meta_receita: number;
  receita_real: number;
  meta_lucro: number;
}

export interface ProjecaoCaixa extends BaseEntity {
  entradas_previstas: number;
  saidas_previstas: number;
}

// Interface para resposta paginada da API
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Interface para usuário (para exibição nas informações de auditoria)
export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

// Tipo para informações de auditoria formatadas
export interface AuditInfo {
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedAt: string;
}
