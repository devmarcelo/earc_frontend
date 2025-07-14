// Form Data Types
export interface CompanyFormData {
  name: string;
  schema_name: string;
  document: string;
  logo: File | string | undefined;
}

export interface UserAdminFormData {
  email: string;
  phone: string;
  password: string;
  repeat_password: string;
  nickname: string;
  avatar: File | string | undefined;
  acceptance: boolean;
}

export interface AddressFormData {
  zipcode: string;
  address: string;
  address_number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
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
  onImageChange?: (image: File | string) => void;
}

export interface UserAdminFormProps extends BaseFormProps<UserAdminFormData> {
  setFormData: (data: Partial<UserAdminFormData>) => void;
  loading?: boolean;
  error?: string;
  onImageChange?: (image: File | string) => void;
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
  registration_date: string;
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

export interface ZipcodeData {
  address: string;
  neighborhood: string;
  city: string;
  state: string;
}

// Hook Return Types
export interface UseZipcodeReturn {
  isLoading: boolean;
  error: string | null;
  searchZipcode: (zipcode: string) => Promise<ZipcodeData | null>;
  clearError: () => void;
  handleZipcodeChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  ) => Promise<void>;
  validateZipcode: (value: string) => string | null;
}
