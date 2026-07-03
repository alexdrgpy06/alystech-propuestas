import type { ConditionCard } from '../types/proposal';

export const conditions: ConditionCard[] = [
  {
    title: 'Carácter de los precios',
    text: 'Todos los valores de este documento son estimativos y pueden variar según el relevamiento in situ, la disponibilidad de equipos y las condiciones de mercado al momento de la contratación.',
  },
  {
    title: 'Moneda y tipo de cambio',
    text: 'Tipo de cambio referencial: 1 USD ≈ 6.250 Gs, sujeto a la cotización del día de pago. Si el pago se realiza en dólares, la comisión bancaria o cambiaria vigente corre por cuenta del cliente.',
  },
  {
    title: 'IVA y retenciones',
    text: 'Todos los precios de este documento incluyen IVA (10%, tasa vigente en Paraguay). Las retenciones aplicables corren a cargo de quien corresponda según la modalidad de facturación.',
  },
  {
    title: 'Forma de pago — desarrollo e implementación',
    text: '50% al aceptar la propuesta (inicio) · 25% al llegar a la fase de implementación · 25% a la finalización y entrega.',
  },
  {
    title: 'Equipos y hardware',
    text: 'La adquisición de equipos corre por cuenta directa del cliente y se presenta separada del costo de desarrollo/implementación. Alystech puede oficiar de intermediario de compra a pedido.',
  },
  {
    title: 'Visitas presenciales (on-site)',
    text: 'Las visitas presenciales fuera del soporte remoto incluido tienen costo adicional. Si la implementación en sitio supera una jornada, se suma $250 por día adicional más viáticos (hospedaje, alimentación) y traslado/peajes, a cargo del cliente.',
  },
  {
    title: 'Configuración de dispositivos móviles',
    text: 'Los dispositivos deben entregarse en las oficinas de Alystech para su configuración inicial. El traslado del equipo técnico a las instalaciones del cliente para esta tarea tiene el costo de visita on-site indicado arriba.',
  },
  {
    title: 'Inversión mínima de desarrollo',
    text: 'Esta propuesta tiene una inversión mínima de desarrollo de USD 12.000, IVA incluido, sujeta a negociación según el alcance final acordado. La combinación recomendada (MDM-B + AUD-B + SOP-B) ya cubre este mínimo. Incluso la configuración más económica ronda los USD 10.000, IVA incluido.',
  },
  {
    title: 'Costos de implementación',
    text: 'Toda opción de desarrollo incluye un cargo base de implementación (puesta en marcha, pruebas, entrega y documentación), independientemente del alcance elegido. Este costo es real y no se reduce a cero en ninguna configuración, incluida la económica.',
  },
  {
    title: 'Propiedad intelectual',
    text: 'El software, las configuraciones y las integraciones desarrolladas son propiedad de Alystech, licenciadas a Araucanos S.A. para su uso operativo. La entrega del código fuente es un servicio adicional opcional, con costo aparte (ver detalle en la opción Ideal).',
  },
];
