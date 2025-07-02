// Form Data Types
export interface CompanyFormData {
  company_name: string;
  schema_name: string;
  document: string;
  logo: string;
  logoFile?: File;
  logoType?: "url" | "file";
}

export interface UserAdminFormData {
  email: string;
  phone: string;
  password: string;
  repeatPassword: string;
  apelido: string;
  imagem: string;
  aceite: boolean;
  imagemFile?: File;
  imagemType?: "url" | "file";
}

export interface AddressFormData {
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
}

// Form Props Types
export interface BaseFormProps<T> {
  formData: T;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

export interface CompanyFormProps extends BaseFormProps<CompanyFormData> {
  setFormData: (data: Partial<CompanyFormData>) => void;
  onNext?: () => void;
  onImageChange?: (imageData: ImageData) => void;
}

export interface UserAdminFormProps extends BaseFormProps<UserAdminFormData> {
  setFormData: (data: Partial<UserAdminFormData>) => void;
  loading?: boolean;
  error?: string;
  onImageChange?: (imageData: ImageData) => void;
}

export interface AddressFormProps extends BaseFormProps<AddressFormData> {
  setFormData: (data: Partial<AddressFormData>) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

// Complete Registration Form Data
export interface RegistrationFormData
  extends CompanyFormData,
    UserAdminFormData,
    AddressFormData {
  data_cadastro: string;
}

// Image Upload Types
export interface ImageData {
  url: string;
  file?: File;
  type: "url" | "file";
}

// API Response Types
export interface ApiError {
  message?: string;
  error?: string;
  details?: Record<string, string[]>;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  tenant_id?: string;
  user_id?: string;
}

// CEP API Types
export interface CepApiResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface CepData {
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
}

// Hook Return Types
export interface UseCepReturn {
  isLoading: boolean;
  error: string | null;
  searchCep: (cep: string) => Promise<CepData | null>;
  clearError: () => void;
  handleCepChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  ) => Promise<void>;
  validateCep: (value: string) => string | null;
}
