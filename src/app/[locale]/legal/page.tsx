import { getLocale } from 'next-intl/server';
import LegalLayout from '@/components/LegalLayout';

export default async function LegalPage() {
  const locale = await getLocale();

  if (locale === 'es') {
    return (
      <LegalLayout title="Aviso Legal">
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la
          Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los
          siguientes datos:
        </p>
        <h2>Titular del sitio web</h2>
        <p>
          <strong>Razón social:</strong> FERRUA SPAIN HOLDING SL
          <br />
          <strong>CIF:</strong> B06812630
          <br />
          <strong>Domicilio social:</strong> Calle Camilo José Cela, 12 (Ed. Segovia), 29602
          Marbella, Málaga, España
        </p>
        <h2>Objeto</h2>
        <p>
          Este sitio web tiene como finalidad la venta online de bebidas alcohólicas con entrega a
          domicilio en la Costa del Sol (Marbella, Estepona y Benahavís), en cumplimiento de la Ley
          4/1997, de 9 de julio, de Prevención y Asistencia en Materia de Drogas de Andalucía.
        </p>
        <h2>Condición de mayor de edad</h2>
        <p>
          El acceso y uso de este sitio web para la compra de bebidas alcohólicas está reservado a
          personas mayores de 18 años. Se verificará la identidad y edad del comprador mediante
          documento de identidad en el momento de la entrega.
        </p>
        <h2>Propiedad intelectual e industrial</h2>
        <p>
          Los contenidos propios del sitio (textos, diseño, código) son titularidad de FERRUA SPAIN
          HOLDING SL. Las marcas, logotipos e imágenes de productos de terceros mostrados en el
          catálogo pertenecen a sus respectivos titulares y se utilizan a efectos meramente
          informativos e identificativos del producto ofrecido.
        </p>
        <h2>Legislación aplicable</h2>
        <p>
          Las presentes condiciones se rigen por la legislación española. Para cualquier
          controversia serán competentes los juzgados y tribunales de Marbella (Málaga), salvo que
          la normativa de consumidores y usuarios disponga otro fuero.
        </p>
      </LegalLayout>
    );
  }

  return (
    <LegalLayout title="Legal Notice">
      <p>
        In compliance with Article 10 of Spanish Law 34/2002 on Information Society Services and
        Electronic Commerce (LSSI-CE), the following information is provided:
      </p>
      <h2>Website owner</h2>
      <p>
        <strong>Company:</strong> FERRUA SPAIN HOLDING SL
        <br />
        <strong>Tax ID (CIF):</strong> B06812630
        <br />
        <strong>Registered address:</strong> Calle Camilo José Cela, 12 (Ed. Segovia), 29602
        Marbella, Málaga, Spain
      </p>
      <h2>Purpose</h2>
      <p>
        This website provides online sale and home delivery of alcoholic beverages in Costa del
        Sol (Marbella, Estepona and Benahavís), in compliance with Andalucía&apos;s Ley 4/1997, of
        9 July, on Drug Prevention and Assistance.
      </p>
      <h2>Age requirement</h2>
      <p>
        Access to and use of this website to purchase alcohol is restricted to persons 18 years of
        age or older. Identity and age are verified via photo ID at the point of delivery.
      </p>
      <h2>Intellectual property</h2>
      <p>
        Original site content (text, design, code) is owned by FERRUA SPAIN HOLDING SL.
        Third-party trademarks, logos and product images shown in the catalogue belong to their
        respective owners and are used solely to identify the products offered.
      </p>
      <h2>Governing law</h2>
      <p>
        These terms are governed by Spanish law. Any dispute will be subject to the courts of
        Marbella (Málaga), except where consumer protection law establishes a different
        jurisdiction.
      </p>
    </LegalLayout>
  );
}
