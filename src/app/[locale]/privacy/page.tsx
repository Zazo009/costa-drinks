import { getLocale } from 'next-intl/server';
import LegalLayout from '@/components/LegalLayout';

export default async function PrivacyPage() {
  const locale = await getLocale();

  if (locale === 'es') {
    return (
      <LegalLayout title="Política de Privacidad">
        <p>
          De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018, de 5 de
          diciembre, de Protección de Datos Personales y garantía de los derechos digitales
          (LOPDGDD), le informamos sobre el tratamiento de sus datos personales.
        </p>
        <h2>Responsable del tratamiento</h2>
        <p>
          FERRUA SPAIN HOLDING SL, CIF B06812630, Calle Camilo José Cela, 12 (Ed. Segovia), 29602
          Marbella, Málaga.
        </p>
        <h2>Finalidad del tratamiento</h2>
        <p>
          Gestionar su cuenta de usuario, procesar y entregar sus pedidos, verificar su mayoría de
          edad, emitir facturas/recibos, y comunicarnos con usted sobre el estado de sus pedidos.
        </p>
        <h2>Legitimación</h2>
        <p>
          Ejecución de la relación contractual (compra y entrega), cumplimiento de obligaciones
          legales (verificación de edad conforme a la Ley 4/1997 de Andalucía y normativa
          tributaria) y, en su caso, su consentimiento para crear una cuenta y guardar favoritos.
        </p>
        <h2>Conservación</h2>
        <p>
          Los datos se conservarán mientras exista una relación contractual y, posteriormente,
          durante los plazos legales de prescripción de responsabilidades (fiscal, mercantil).
        </p>
        <h2>Destinatarios</h2>
        <p>
          Sus datos se comunican a los proveedores estrictamente necesarios para prestar el
          servicio: procesador de pagos (Stripe) y proveedor de base de datos (Supabase), ambos con
          garantías adecuadas de protección de datos.
        </p>
        <h2>Derechos</h2>
        <p>
          Puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y
          portabilidad enviando un correo desde la página de{' '}
          <a href="/es/contact" className="underline">
            Contacto
          </a>
          . También puede reclamar ante la Agencia Española de Protección de Datos (aepd.es).
        </p>
      </LegalLayout>
    );
  }

  return (
    <LegalLayout title="Privacy Policy">
      <p>
        In accordance with EU Regulation 2016/679 (GDPR) and Spanish Organic Law 3/2018 (LOPDGDD),
        here is how we handle your personal data.
      </p>
      <h2>Data controller</h2>
      <p>
        FERRUA SPAIN HOLDING SL, Tax ID B06812630, Calle Camilo José Cela, 12 (Ed. Segovia), 29602
        Marbella, Málaga, Spain.
      </p>
      <h2>Purpose of processing</h2>
      <p>
        To manage your account, process and deliver your orders, verify your legal age, issue
        receipts, and communicate with you about your order status.
      </p>
      <h2>Legal basis</h2>
      <p>
        Performance of the contract (purchase and delivery), compliance with legal obligations
        (age verification under Andalucía&apos;s Ley 4/1997 and tax law), and, where applicable,
        your consent to create an account and save favourites.
      </p>
      <h2>Retention</h2>
      <p>
        Data is kept for as long as the contractual relationship lasts, and afterwards for the
        legal limitation periods applicable (tax and commercial law).
      </p>
      <h2>Recipients</h2>
      <p>
        Your data is shared only with providers strictly necessary to deliver the service: our
        payment processor (Stripe) and database provider (Supabase), both under adequate data
        protection safeguards.
      </p>
      <h2>Your rights</h2>
      <p>
        You may exercise your rights of access, rectification, erasure, objection, restriction and
        portability via our{' '}
        <a href="/en/contact" className="underline">
          Contact
        </a>{' '}
        page. You may also file a complaint with the Spanish Data Protection Agency (aepd.es).
      </p>
    </LegalLayout>
  );
}
