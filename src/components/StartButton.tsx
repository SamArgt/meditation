"use client";

interface StartButtonProps {
  onClick: () => void;
}

export default function StartButton({ onClick }: StartButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Démarrer la méditation"
      className="flex items-center justify-center min-w-[72px] min-h-[72px] px-8 py-4 bg-accent text-white rounded-full text-lg font-medium transition-colors duration-150 hover:bg-accent-hover active:scale-95"
    >
      Start
    </button>
  );
}
