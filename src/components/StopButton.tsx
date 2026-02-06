"use client";

interface StopButtonProps {
  onClick: () => void;
}

export default function StopButton({ onClick }: StopButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Arrêter la session"
      className="flex items-center justify-center min-w-[48px] min-h-[48px] px-6 py-3 bg-surface text-text-secondary rounded-full text-base transition-colors duration-150 hover:text-text-primary active:scale-95"
    >
      Stop
    </button>
  );
}
