import type { OnboardingContent } from '../types/proposal';

export const onboarding: OnboardingContent = {
  code: 'E',
  title: 'Incorporación posterior de dispositivos (onboarding)',
  intro:
    'La implementación cubre el registro inicial de los aproximadamente 80 dispositivos. El personal de Araucanos queda capacitado para incorporar equipos nuevos por su cuenta sin costo adicional. Si en el futuro se prefiere que Alystech realice esa incorporación, se aplican los siguientes valores por servicio (precios estimativos, IVA incluido), con descuento a mayor volumen:',
  includedNote:
    'Este servicio se presta en las oficinas de Alystech: los dispositivos deben ser entregados allí para su configuración. Si se requiere que el equipo técnico se traslade a las instalaciones del cliente, se aplica el costo de visita on-site descripto en las condiciones comerciales, además del valor por dispositivo. Los planes de soporte Estándar y Prioritario incluyen las altas y bajas de dispositivos sin costo adicional siempre que se realicen en oficinas de Alystech; los valores anteriores aplican cuando no existe un plan de soporte vigente que las cubra, o para volúmenes fuera del plan.',
  tiers: [
    {
      range: '1 a 5 equipos',
      pricePerUnit: '$24 por dispositivo. Registro, aplicación de políticas y verificación de restricciones.',
    },
    {
      range: '6 a 20 equipos',
      pricePerUnit: '$19 por dispositivo. Incluye preparación en lote y prueba del canal SMS.',
    },
    {
      range: 'Más de 20 equipos',
      pricePerUnit: '$14 por dispositivo. Registro masivo por Knox Mobile Enrollment.',
    },
    {
      range: 'Reconfiguración',
      pricePerUnit: '$12 por dispositivo. Restablecimiento de políticas en equipos reasignados o restaurados.',
    },
  ],
  scaleBanner: {
    icon: '📈',
    heading: 'Escalable y mejorable',
    text: 'Toda la plataforma admite crecimiento sin rehacer el trabajo: la flota puede pasar de 80 a varios cientos de dispositivos sin cambiar de motor ni pagar licencias adicionales; el servidor amplía memoria y almacenamiento; la red se segmenta en más niveles; y el plan de soporte sube o baja de nivel según la necesidad. Se parte de una base sólida y se agregan capacidades a medida que la operación lo requiera, incluida la integración con la red LoRa (ver documento «Plan LoRa»).',
  },
};
