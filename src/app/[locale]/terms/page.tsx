import { getLocale } from 'next-intl/server';
import LegalLayout from '@/components/LegalLayout';

export default async function TermsPage() {
  const locale = await getLocale();

  if (locale === 'es') {
    return (
      <LegalLayout title="Términos y Condiciones">
        <h2>1. Objeto</h2>
        <p>
          Las presentes condiciones regulan la compra de bebidas alcohólicas con entrega a
          domicilio a través de este sitio web, operado por FERRUA SPAIN HOLDING SL (CIF
          B06812630).
        </p>
        <h2>2. Requisito de edad</h2>
        <p>
          Solo pueden comprar en este sitio personas mayores de 18 años. Se comprobará la edad
          mediante documento de identidad válido en el momento de la entrega; si no puede
          acreditarse, el pedido no se entregará y no se reembolsará el producto abierto o
          consumido.
        </p>
        <h2>3. Horario de venta</h2>
        <p>
          En cumplimiento de la Ley 4/1997, de 9 de julio, de Andalucía, la venta a distancia de
          bebidas alcohólicas solo está permitida entre las 08:00 y las 22:00 horas. Fuera de este
          horario no se procesarán pedidos.
        </p>
        <h2>4. Precios y pago</h2>
        <p>
          Los precios se muestran en euros, impuestos incluidos. El pago se realiza de forma segura
          a través de nuestra pasarela de pago (Stripe) en el momento de realizar el pedido.
        </p>
        <h2>5. Entrega</h2>
        <p>
          Realizamos entregas en Marbella, Estepona y Benahavís, el mismo día, dentro de la franja
          horaria seleccionada. El pedido se entrega únicamente si la persona que lo recibe
          acredita ser mayor de 18 años.
        </p>
        <h2>6. Derecho de desistimiento</h2>
        <p>
          De acuerdo con el artículo 103 del Real Decreto Legislativo 1/2007 (TRLGDCU), el derecho
          de desistimiento no es aplicable a bienes que, por su naturaleza, no puedan ser devueltos
          o puedan deteriorarse o caducar con rapidez. Al tratarse de bebidas alcohólicas
          precintadas entregadas y aceptadas en el domicilio, el derecho de desistimiento no aplica
          una vez entregado el pedido conforme.
        </p>
        <h2>7. Cuenta de usuario</h2>
        <p>
          La creación de una cuenta es opcional y permite consultar el historial de pedidos,
          guardar productos favoritos y repetir pedidos anteriores. Usted es responsable de
          mantener la confidencialidad de sus credenciales de acceso.
        </p>
      </LegalLayout>
    );
  }

  return (
    <LegalLayout title="Terms & Conditions">
      <h2>1. Purpose</h2>
      <p>
        These terms govern the purchase of alcoholic beverages with home delivery through this
        website, operated by FERRUA SPAIN HOLDING SL (Tax ID B06812630).
      </p>
      <h2>2. Age requirement</h2>
      <p>
        Only persons 18 years of age or older may purchase on this site. Age is verified via valid
        photo ID at the point of delivery; if it cannot be proven, the order will not be handed
        over and opened or consumed product will not be refunded.
      </p>
      <h2>3. Sale hours</h2>
      <p>
        In compliance with Andalucía&apos;s Ley 4/1997 of 9 July, distance sale of alcoholic
        beverages is only permitted between 08:00 and 22:00. Orders will not be processed outside
        these hours.
      </p>
      <h2>4. Prices and payment</h2>
      <p>
        Prices are shown in euros, taxes included. Payment is processed securely through our
        payment gateway (Stripe) at the time of order.
      </p>
      <h2>5. Delivery</h2>
      <p>
        We deliver same-day in Marbella, Estepona and Benahavís, within the selected time slot.
        Orders are only handed over if the recipient proves they are 18 or older.
      </p>
      <h2>6. Right of withdrawal</h2>
      <p>
        Under Article 103 of Royal Legislative Decree 1/2007 (Spanish Consumer Protection Act),
        the right of withdrawal does not apply to goods that, by their nature, cannot be returned
        or may deteriorate or expire quickly. As sealed alcoholic beverages delivered to and
        accepted at your address, the right of withdrawal does not apply once the order has been
        delivered as agreed.
      </p>
      <h2>7. User account</h2>
      <p>
        Creating an account is optional and lets you view your order history, save favourite
        products, and reorder past purchases. You are responsible for keeping your login
        credentials confidential.
      </p>
    </LegalLayout>
  );
}
