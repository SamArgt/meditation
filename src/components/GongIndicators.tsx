interface GongIndicatorsProps {
  totalGongs: number;
  completedGongs: number;
}

export default function GongIndicators({
  totalGongs,
  completedGongs,
}: GongIndicatorsProps) {
  if (totalGongs === 0) return null;

  return (
    <div
      className="flex items-center justify-center gap-2"
      aria-label={`Indicateurs de gongs : ${completedGongs} sur ${totalGongs}`}
      role="status"
    >
      {Array.from({ length: totalGongs }, (_, i) => {
        const isCompleted = i < completedGongs;
        return (
          <span
            key={i}
            className={`h-3 w-3 rounded-full border-2 border-accent transition-all duration-500 ease-out motion-reduce:transition-none ${
              isCompleted ? "scale-110 bg-accent" : "bg-transparent"
            }`}
          />
        );
      })}
    </div>
  );
}
