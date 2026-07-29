import { getLocale } from 'next-intl/server';
import LegalLayout from '@/components/LegalLayout';

export default async function ReturnsPage() {
  const locale = await getLocale();

  if (locale === 'es') {
    return (
      <LegalLayout title="Política de Devoluciones">
        <h2>Pedidos incorrectos o dañados</h2>
        <p>
          Si recibe un pedido incorrecto, incompleto o con productos dañados, contáctenos en un
          plazo de 24 horas desde la entrega a través de la página de{' '}
          <a href="/es/contact" className="underline">
            Contacto
          </a>
          . Le ofreceremos la sustitución del producto o el reembolso correspondiente.
        </p>
        <h2>Derecho de desistimiento</h2>
        <p>
          Conforme al artículo 103 del Real Decreto Legislativo 1/2007, no aplica el derecho de
          desistimiento general de 14 días a las bebidas alcohólicas precintadas una vez
          entregadas y aceptadas, dada su naturaleza perecedera/consumible. No se aceptan
          devoluciones de botellas abiertas.
        </p>
        <h2>Pedidos no entregados por falta de acreditación de edad</h2>
        <p>
          Si el pedido no puede entregarse porque el receptor no acredita ser mayor de 18 años, se
          considerará como no entregado y se procederá al reembolso íntegro del importe pagado,
          descontando en su caso los gastos de gestión ya incurridos.
        </p>
        <h2>Plazos de reembolso</h2>
        <p>
          Los reembolsos se procesan a través del mismo método de pago utilizado en la compra, en
          un plazo máximo de 14 días naturales desde la aprobación de la incidencia.
        </p>
      </LegalLayout>
    );
  }

  return (
    <LegalLayout title="Returns Policy">
      <h2>Incorrect or damaged orders</h2>
      <p>
        If you receive an incorrect, incomplete, or damaged order, contact us within 24 hours of
        delivery via our{' '}
        <a href="/en/contact" className="underline">
          Contact
        </a>{' '}
        page. We will offer a replacement or the corresponding refund.
      </p>
      <h2>Right of withdrawal</h2>
      <p>
        Under Article 103 of Royal Legislative Decree 1/2007, the standard 14-day right of
        withdrawal does not apply to sealed alcoholic beverages once delivered and accepted, given
        their perishable/consumable nature. Opened bottles cannot be returned.
      </p>
      <h2>Orders not delivered due to failed age verification</h2>
      <p>
        If an order cannot be delivered because the recipient cannot prove they are 18 or older, it
        is treated as undelivered and the full amount paid will be refunded, less any handling
        costs already incurred where applicable.
      </p>
      <h2>Refund timing</h2>
      <p>
        Refunds are processed to the original payment method within a maximum of 14 calendar days
        from approval of the issue.
      </p>
    </LegalLayout>
  );
}
