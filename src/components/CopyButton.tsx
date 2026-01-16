import React from "react";

type CopyButtonProps = {
  targetRef: React.RefObject<HTMLElement | null>;
  label?: string;
  onCopied?: () => void;
};

export const CopyButton: React.FC<CopyButtonProps> = ({
  targetRef,
  label = "Copy",
  onCopied,
}) => {
  const handleCopy = async () => {
    const el = targetRef.current;
    if (!el) return;

    const text = el.innerText;

    try {
      await navigator.clipboard.writeText(text);
      onCopied?.();
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <button type="button" className="std-btn" onClick={handleCopy}>
      {label}
    </button>
  );
};