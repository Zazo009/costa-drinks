import { getLocale } from 'next-intl/server';
import LegalLayout from '@/components/LegalLayout';

export default async function CookiesPage() {
  const locale = await getLocale();

  if (locale === 'es') {
    return (
      <LegalLayout title="Política de Cookies">
        <p>
          Este sitio web utiliza cookies técnicas necesarias para su funcionamiento. No utilizamos
          cookies de publicidad ni de seguimiento de terceros.
        </p>
        <h2>Cookies utilizadas</h2>
        <p>
          <strong>NEXT_LOCALE</strong> — recuerda tu idioma preferido (español/inglés).
          <br />
          <strong>Cookies de sesión de Supabase</strong> — mantienen tu sesión iniciada si has
          creado una cuenta.
        </p>
        <h2>Almacenamiento local del navegador</h2>
        <p>
          Además de cookies, utilizamos el almacenamiento local de tu navegador (localStorage /
          sessionStorage) para recordar el contenido de tu carrito de compra y tu confirmación de
          mayoría de edad durante la sesión. Esta información no sale de tu dispositivo salvo que
          completes una compra.
        </p>
        <h2>Gestión de cookies</h2>
        <p>
          Puedes eliminar o bloquear estas cookies desde la configuración de tu navegador; ten en
          cuenta que esto puede afectar al correcto funcionamiento del sitio (por ejemplo, cerrará
          tu sesión).
        </p>
      </LegalLayout>
    );
  }

  return (
    <LegalLayout title="Cookie Policy">
      <p>
        This website uses only technical cookies necessary for it to function. We do not use
        advertising or third-party tracking cookies.
      </p>
      <h2>Cookies used</h2>
      <p>
        <strong>NEXT_LOCALE</strong> — remembers your preferred language (Spanish/English).
        <br />
        <strong>Supabase session cookies</strong> — keep you signed in if you&apos;ve created an
        account.
      </p>
      <h2>Local browser storage</h2>
      <p>
        In addition to cookies, we use your browser&apos;s local storage (localStorage /
        sessionStorage) to remember your cart contents and age-verification confirmation for the
        session. This data never leaves your device unless you complete a purchase.
      </p>
      <h2>Managing cookies</h2>
      <p>
        You can delete or block these cookies via your browser settings; note this may affect the
        site&apos;s functionality (for example, it will sign you out).
      </p>
    </LegalLayout>
  );
}
