import { getLocale } from 'next-intl/server';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default async function ContactPage() {
  const locale = await getLocale();
  const es = locale === 'es';

  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-2 text-2xl font-bold text-ink">
          {es ? 'Contacto' : 'Contact'}
        </h1>
        <p className="mb-8 text-sm text-ink/50">
          {es
            ? 'FERRUA SPAIN HOLDING SL — CIF B06812630'
            : 'FERRUA SPAIN HOLDING SL — Tax ID B06812630'}
        </p>

        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 flex-shrink-0 text-ink/35" size={18} />
            <p className="text-sm text-ink/70">
              Calle Camilo José Cela, 12 (Ed. Segovia)
              <br />
              29602 Marbella, Málaga, {es ? 'España' : 'Spain'}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 flex-shrink-0 text-ink/35" size={18} />
            <a href="mailto:info@costa-drinks.com" className="text-sm text-ink/70 hover:underline">
              info@costa-drinks.com
            </a>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 flex-shrink-0 text-ink/35" size={18} />
            <a href="tel:+34000000000" className="text-sm text-ink/70 hover:underline">
              +34 000 000 000
            </a>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 flex-shrink-0 text-ink/35" size={18} />
            <p className="text-sm text-ink/70">
              {es ? 'Todos los días, 08:00–22:00' : 'Every day, 08:00–22:00'}
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
