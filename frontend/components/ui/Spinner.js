export default function Spinner({ className = '' }) {
  return (
    <div
      className={`inline-block h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600 ${className}`}
      role="status"
      aria-label="جاري التحميل"
    />
  );
}
