import Link from 'next/link';

export default function EmptyState({ icon: Icon, title, description, actionHref, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-border bg-white px-6 py-16 text-center animate-fade-in">
      {Icon && <Icon className="mb-4 text-4xl text-slate-300" />}
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>}
      {actionHref && actionLabel && (
        <Link href={actionHref} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
