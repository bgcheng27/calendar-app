import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";


export type ModalProps = {
  children: ReactNode;
  isVisible: boolean;
  onClose: () => void;
};


export function Modal({ children, isVisible, onClose }: ModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const prevIsOpen = useRef<boolean>()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useLayoutEffect(() => {
    if (!isVisible && prevIsOpen.current) {
      setIsClosing(true)
    }

    prevIsOpen.current = isVisible
  }, [isVisible])

  if (!isVisible && !isClosing) return null;
  return createPortal(
    <div onAnimationEnd={() => {setIsClosing(false)}} className={`${isClosing && "closing"} modal`}>
      <div className="overlay" onClick={onClose}></div>
      <div className="modal-body">{children}</div>
    </div>,
    document.querySelector("#modal-container") as HTMLElement
  );
}
