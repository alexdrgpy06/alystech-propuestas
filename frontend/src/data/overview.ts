import type { OverviewContent } from '../types/proposal';

export const overview: OverviewContent = {
  lead: '1. Introducción y Objetivos Estratégicos\n\nEste documento define el plan técnico y económico para la mitigación de riesgos de seguridad de la información en Araucanos S.A. El plan aborda de forma unificada el control operativo de la flota móvil en campo y el blindaje del parque informático administrativo.\n\nEl enfoque de Alystech prioriza la propiedad tecnológica del cliente. Al implementar soluciones basadas en código abierto auditado sobre un servidor físico en sitio (on-premise), Araucanos S.A. adquiere una infraestructura robusta y perpetua, eliminando la dependencia de suscripciones SaaS de terceros y la exposición a la fluctuación cambiaria del dólar.',
  execboxHeading: '2. Diagnóstico Técnico y Vulnerabilidades Detectadas',
  execboxParagraphs: [
    {
      leadIn: 'A. Flota Móvil en Campo (Dispositivos Samsung)',
      text: 'Problema: Los guardias de seguridad manipulan las funciones del sistema de los terminales corporativos para eludir las rutas de patrullaje. Esto incluye la desactivación manual de la geolocalización (GPS), desconexión de planes de datos móviles, activación del modo avión o la restauración física del terminal a valores de fábrica (Hard Reset) para eliminar los agentes de rastreo.\n\nImpacto: Pérdida de visibilidad de cobertura, imposibilidad de auditar rondas en tiempo real y quiebre de compromisos contractuales de nivel de servicio (SLA) frente a sus clientes de seguridad.',
    },
    {
      leadIn: 'B. Estaciones de Trabajo Administrativas (Equipos de Oficina)',
      text: 'Problema: La administración central opera actualmente utilizando un computador de escritorio estándar con funciones de servidor de archivos, sin mecanismos de aislamiento lógico ni segmentación de red. Se registraron incidentes previos de infecciones por troyanos y malware.\n\nImpacto: Riesgo extremo de exfiltración de credenciales, destrucción o cifrado de bases de datos operacionales por ataque de ransomware, y parálisis de la facturación centralizada.',
    },
  ],
  scaleBannerIcon: '🛡️',
  scaleBannerHeading: 'Catálogo Detallado de Soluciones',
  scaleBannerText:
    'A continuación, se presenta la valorización transparente de la mano de obra, desarrollo lógico e ingeniería especializada para cada módulo de la propuesta. (Nota: Los costos de hardware y equipamiento físico se detallan por separado en el presupuesto comercial, ya que son adquiridos a precio de costo o provistos directamente por el cliente, no representando honorarios de Alystech).',
  glanceHeading: 'Opciones de Ingeniería por Módulo',
};
