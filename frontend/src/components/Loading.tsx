export default function Loading({ label }: { label: string }) {
  return (
    <p role="status" aria-live="polite">
      {label}
    </p>
  );
}
