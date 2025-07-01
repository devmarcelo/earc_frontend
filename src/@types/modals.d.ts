export type ModalMode = "add" | "edit" | "view" | "custom" | "upload";

export interface ModalOptions {
  type?: "info" | "form" | "upload" | "custom";
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  showActionButtons?: boolean;
  [key: string]: any;
}

export interface ModalState<T = any> {
  isOpen: boolean;
  mode: ModalMode;
  data?: T | null;
  config?: ModalOptions;
}
