// src/hooks/useModal.ts
import { useState } from "react";
import type { ModalState, ModalMode, ModalOptions } from "../@types/modals";

export function useModal<T = any>() {
  const [modalState, setModalState] = useState<ModalState<T>>({
    isOpen: false,
    mode: "add",
    data: null,
    config: {
      type: "form",
      size: "md",
      showCloseButton: true,
      showActionButtons: true,
    },
  });

  const [onCloseCallback, setOnCloseCallback] = useState<(() => void) | null>(
    null,
  );

  const openModal = (
    mode: ModalMode,
    data: T | null = null,
    configOverrides: ModalOptions = {},
  ) => {
    setModalState((prev) => ({
      ...prev,
      isOpen: true,
      mode,
      data,
      config: { ...prev.config, ...configOverrides },
    }));
  };

  const closeModal = () => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
      mode: "add",
      data: null,
    }));
    if (onCloseCallback) {
      onCloseCallback();
      setOnCloseCallback(null);
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
