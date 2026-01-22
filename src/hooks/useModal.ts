// hooks/useModal.ts
import { useState } from "react";

export function useModal<T>() {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState<T | null>(null);

  const open = (data?: T) => {
    setSelected(data || null);
    setShow(true);
  };

  const close = () => {
    setShow(false);
    setSelected(null);
  };

  const isEditMode = !!selected;

  return {
    show,
    selected,
    isEditMode,
    open,
    close,
    setSelected,
  };
}
