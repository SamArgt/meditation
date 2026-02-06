export default function Home() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <main className="flex w-full max-w-[480px] flex-col items-center gap-8">
        <h1 className="font-serif text-5xl font-light text-text-primary">
          Meditation
        </h1>
        <p className="text-center text-text-secondary">
          Timer de méditation minimaliste
        </p>
      </main>
    </div>
  );
}
