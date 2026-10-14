import TransitionLink from "@/components/Transition";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-mega font-bold uppercase leading-none">404</h1>
      <p className="mt-6 text-muted">This page drifted off the grid.</p>
      <TransitionLink
        href="/"
        className="mt-10 rounded-full bg-accent px-6 py-3 text-sm font-medium text-black"
      >
        ← Back home
      </TransitionLink>
    </main>
  );
}
