// src/hooks/useModal.ts
import { useState } from "react";

type ModalMode = "add" | "edit";

interface ModalState<T = any> {
  isOpen: boolean;
  mode: ModalMode;
  data?: T | null;
}

export function useModal<T = any>() {
  const [modalState, setModalState] = useState<ModalState<T>>({
    isOpen: false,
    mode: "add",
    data: null,
  });

  const [onCloseCallback, setOnCloseCallback] = useState<(() => void) | null>(
    null,
  );

  const openModal = (mode: ModalMode, data: T | null = null) => {
    setModalState({ isOpen: true, mode, data });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: "add", data: null });
    if (onCloseCallback) {
      onCloseCallback();
      setOnCloseCallback(null); // reseta para não disparar novamente
    }
  };

  const onClose = (callback: () => void) => {
    setOnCloseCallback(() => callback);
  };

  return {
    modalState,
    openModal,
    closeModal,
    onClose,
  };
}
