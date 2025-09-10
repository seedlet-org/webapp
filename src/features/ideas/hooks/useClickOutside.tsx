import { RefObject, useEffect } from "react";

export default function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onClose: () => void
) {
  useEffect(() => {
    function handleClick(e: Event) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [ref, onClose]);
}
