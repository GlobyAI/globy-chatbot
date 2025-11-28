'use client'
import { useEffect, useState, type HTMLAttributes } from "react";
import { createPortal } from "react-dom";
interface IProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  open: boolean;
  onClose?: () => void,
}
const Modal = ({
  children,
  open = false,
  onClose,
  className = "",
  ...rest
}: IProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  const modalRoot =
    typeof window !== "undefined" ? document.getElementById("modal-root") : null;

  if (!mounted || !modalRoot || !open) return null;
  return createPortal(
    <div className={`modal ${open ? "open" : ""}   ${className} `} {...rest}>
      <div className="modal__overlay" onClick={onClose}></div>
      <div className={`modal__body center `}>
        {children}
      </div>
    </div>, modalRoot!)

};

export default Modal;
