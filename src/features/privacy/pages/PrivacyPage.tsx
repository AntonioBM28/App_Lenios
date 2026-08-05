import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { env } from '@/core/config/env'

const ULTIMA_ACTUALIZACION = '4 de agosto de 2026'

interface SeccionProps {
  titulo: string
  children: ReactNode
}

function Seccion({ titulo, children }: SeccionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-heading text-xl font-bold text-white">{titulo}</h2>
      <div className="text-beige/75 text-sm leading-relaxed flex flex-col gap-3">
        {children}
      </div>
    </section>
  )
}

/**
 * Aviso de Privacidad Integral — cumple el criterio de la lista de cotejo
 * de seguridad ("debe estar visible, disponible y de fácil acceso antes de
 * que el usuario introduzca cualquier dato personal").
 *
 * Estructura alineada a los principios de la normativa de protección de
 * datos personales aplicable en México (licitud, consentimiento,
 * información, calidad, finalidad, lealtad, proporcionalidad y
 * responsabilidad).
 */
export default function PrivacyPage() {
  const whatsapp = env.whatsappNumber
  const email = env.contactEmail

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-beige hover:text-primary transition-colors text-sm font-medium mb-8"
      >
        <ArrowLeft size={16} /> Volver al inicio
      </Link>

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <ShieldCheck size={20} className="text-primary" strokeWidth={1.5} />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white">
          Aviso de <span className="text-primary">Privacidad</span>
        </h1>
      </div>
      <p className="text-beige/60 text-sm mb-10">
        Última actualización: {ULTIMA_ACTUALIZACION}
      </p>

      <div className="flex flex-col gap-8 p-6 sm:p-8 rounded-card bg-dark-card border border-dark-border">
        <Seccion titulo="1. Identidad y domicilio del responsable">
          <p>
            <strong className="text-white">Leños Rellenos</strong> ("nosotros", "el
            negocio"), un negocio familiar de comida artesanal, es responsable del
            tratamiento de tus datos personales conforme a este aviso de privacidad.
          </p>
          <p>
            Puedes contactarnos para cualquier duda relacionada con el tratamiento de
            tus datos personales a través de:
          </p>
          <ul className="list-disc list-inside flex flex-col gap-1">
            <li>
              Correo electrónico:{' '}
              <a href={`mailto:${email}`} className="text-primary hover:underline">
                {email}
              </a>
            </li>
            <li>WhatsApp: +{whatsapp}</li>
          </ul>
        </Seccion>

        <Seccion titulo="2. Datos personales que recabamos">
          <p>Para procesar y entregar tu pedido recabamos únicamente:</p>
          <ul className="list-disc list-inside flex flex-col gap-1">
            <li>Nombre completo</li>
            <li>Número de teléfono</li>
            <li>Dirección de entrega</li>
          </ul>
          <p>
            <strong className="text-white">No recabamos datos personales sensibles</strong>{' '}
            (origen étnico o racial, estado de salud, información genética, creencias
            religiosas, filosóficas o morales, afiliación sindical, opiniones políticas,
            preferencia sexual, ni datos financieros o patrimoniales). Si en algún
            momento detectas que se te ha solicitado un dato de este tipo, por favor
            repórtalo de inmediato a través de los medios de contacto de este aviso.
          </p>
        </Seccion>

        <Seccion titulo="3. Finalidades del tratamiento">
          <p>
            <strong className="text-white">Finalidades primarias</strong> (necesarias
            para brindarte el servicio que solicitas):
          </p>
          <ul className="list-disc list-inside flex flex-col gap-1">
            <li>Procesar tu pedido en nuestro sistema.</li>
            <li>Coordinar la entrega de tu pedido.</li>
            <li>Contactarte para confirmar, aclarar o dar seguimiento a tu pedido.</li>
          </ul>
          <p>
            <strong className="text-white">Finalidades secundarias</strong> (no
            necesarias para el servicio, requieren tu consentimiento adicional): por
            ahora <strong className="text-white">ninguna</strong>. No usamos tus datos
            con fines de mercadotecnia, publicidad ni prospección comercial. Si en el
            futuro quisiéramos usarlos para ello, te lo informaremos y te pediremos un
            consentimiento adicional, separado y específico para esa finalidad — nunca
            asumido por default.
          </p>
        </Seccion>

        <Seccion titulo="4. Fundamento del tratamiento">
          <p>
            El tratamiento de tus datos personales se apega a los principios de{' '}
            <strong className="text-white">
              licitud, consentimiento, información, calidad, finalidad, lealtad,
              proporcionalidad y responsabilidad
            </strong>{' '}
            que establece la normativa de protección de datos personales en posesión de
            particulares y sujetos obligados aplicable en México.
          </p>
        </Seccion>

        <Seccion titulo="5. Transferencia de datos vía WhatsApp">
          <p>
            Al confirmar tu pedido, el sistema arma un mensaje con tus datos de entrega
            (nombre, teléfono, dirección) y el detalle de tu pedido, y{' '}
            <strong className="text-white">
              eres tú quien decide enviarlo
            </strong>{' '}
            a través de WhatsApp, una aplicación operada por un tercero (Meta / WhatsApp
            Inc.), para coordinar la entrega con nosotros.
          </p>
          <p>
            Esta transferencia ocurre porque tú, como titular de los datos, eliges
            enviar el mensaje — el sistema no transmite tus datos a WhatsApp de forma
            automática ni sin tu acción explícita. El tratamiento que WhatsApp haga de
            ese mensaje se rige por sus propias políticas de privacidad, ajenas a
            nosotros.
          </p>
          <p>
            Fuera de este mecanismo,{' '}
            <strong className="text-white">
              no vendemos ni compartimos tus datos personales con terceros
            </strong>{' '}
            para fines distintos a los descritos en este aviso.
          </p>
        </Seccion>

        <Seccion titulo="6. Derechos ARCO: cómo ejercerlos">
          <p>
            Tienes derecho a{' '}
            <strong className="text-white">
              Acceder, Rectificar, Cancelar u Oponerte
            </strong>{' '}
            (derechos ARCO) al tratamiento de tus datos personales. Para ejercerlos,
            escríbenos por WhatsApp o correo electrónico (ver sección 1) indicando:
          </p>
          <ul className="list-disc list-inside flex flex-col gap-1">
            <li>Tu nombre completo y teléfono registrados en tu(s) pedido(s).</li>
            <li>El derecho que deseas ejercer (acceso, rectificación, cancelación u oposición).</li>
            <li>Una descripción clara de tu solicitud.</li>
          </ul>
          <p>
            Atenderemos tu solicitud en un plazo razonable, de referencia no mayor a{' '}
            <strong className="text-white">20 días hábiles</strong>, y te informaremos
            la respuesta por el mismo medio de contacto.
          </p>
        </Seccion>

        <Seccion titulo="7. Plazo de conservación">
          <p>
            Conservamos tus datos personales mientras exista una relación de pedidos
            activa o histórica contigo (por ejemplo, para dar seguimiento a pedidos
            pasados). Puedes solicitar la eliminación de tus datos en cualquier momento
            a través del mecanismo ARCO descrito en la sección 6.
          </p>
        </Seccion>

        <Seccion titulo="8. Uso de tecnologías de rastreo">
          <p>Esta aplicación utiliza únicamente almacenamiento local del navegador:</p>
          <ul className="list-disc list-inside flex flex-col gap-1">
            <li>
              <strong className="text-white">localStorage</strong>: para recordar los
              productos de tu carrito de compras entre visitas.
            </li>
            <li>
              <strong className="text-white">sessionStorage</strong>: para mantener la
              sesión del panel de administración mientras el negocio lo usa.
            </li>
          </ul>
          <p>
            No usamos cookies de rastreo ni de terceros con fines publicitarios o de
            análisis de comportamiento.
          </p>
        </Seccion>

        <Seccion titulo="9. Cambios a este aviso de privacidad">
          <p>
            Cualquier actualización a este aviso de privacidad se reflejará en esta
            misma página, actualizando la fecha que se muestra al inicio de este
            documento ("Última actualización"). Te recomendamos consultarlo
            periódicamente, especialmente antes de compartir tus datos con nosotros.
          </p>
        </Seccion>

        <p className="text-beige/50 text-xs pt-4 border-t border-dark-border">
          Última actualización de este aviso: {ULTIMA_ACTUALIZACION}
        </p>
      </div>
    </div>
  )
}
