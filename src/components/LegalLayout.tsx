import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export default function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />
      <article className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-6 text-2xl font-bold text-ink">{title}</h1>
        <div className="prose-legal space-y-4 text-sm leading-relaxed text-ink/70 [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-ink">
          {children}
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
