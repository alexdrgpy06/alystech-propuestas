import type { AboutContent } from '../types/proposal';

export const about: AboutContent = {
  kicker: 'Quiénes somos',
  title: 'Cómo trabajamos en Alystech',
  lead: 'Diseñamos e implementamos infraestructura de seguridad y gestión de dispositivos priorizando soluciones auditables, alojadas en la infraestructura del cliente y sin dependencia de licenciamiento externo cuando existe una alternativa de código abierto igual de sólida.',
  benefits: [
    {
      icon: '🧩',
      title: 'Infraestructura local primero',
      text: 'Servidor, consola y monitoreo alojados en el sitio del cliente. Los datos no salen de la empresa.',
    },
    {
      icon: '🔓',
      title: 'Código abierto donde tiene sentido',
      text: 'Evitamos licenciamiento perpetuo por dispositivo cuando el código abierto cubre el mismo requisito.',
    },
    {
      icon: '🧾',
      title: 'Costos desglosados',
      text: 'Cada opción muestra su desglose real: hardware, desarrollo, licencias y recurrente, sin cifras cerradas.',
    },
    {
      icon: '📈',
      title: 'Pensado para escalar',
      text: 'Las soluciones crecen en dispositivos, cobertura o soporte sin rehacer lo ya implementado.',
    },
  ],
  paySubkicker: 'Cómo se paga y qué puede variar',
  payCards: [
    {
      icon: '💳',
      title: 'Desarrollo e implementación',
      text: 'Se paga en 3 partes: 50% al aceptar, 25% al iniciar la implementación y 25% a la entrega. Aplica solo al costo de desarrollo/implementación.',
    },
    {
      icon: '📦',
      title: 'Equipos y hardware',
      text: 'Van por separado, a cargo del cliente: no forman parte del 50/25/25. Alystech puede intermediar la compra si lo prefieren.',
    },
    {
      icon: '🔍',
      title: 'El relevamiento puede sumar costos',
      text: 'La visita inicial y la auditoría en sitio pueden revelar hallazgos fuera de este alcance. Si aparecen, se cotizan aparte antes de ejecutarlos.',
    },
  ],
};
