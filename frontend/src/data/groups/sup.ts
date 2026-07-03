import type { OptionGroupContent } from '../../types/proposal';

export const sup: OptionGroupContent = {
  id: 'sup',
  stepIndex: 5,
  code: 'D',
  groupTitle: 'Bloque D · Continuidad Operativa',
  title: 'Plan de Soporte Técnico Unificado',
  risk: 'La infraestructura local de Araucanos S.A. requiere mantenimiento preventivo continuo: actualizaciones de seguridad, monitorización de registros de ciberseguridad, gestión de altas y bajas de dispositivos móviles, y atención de incidentes técnicos.',
  impact: 'Dado que la plataforma MDM y el sistema de monitoreo de endpoints operan sobre el mismo servidor físico, Alystech consolida ambos servicios en un único plan de soporte. Esto representa una reducción del 50% en costos recurrentes frente a la contratación de servicios separados.',
  guarantee: { title: 'Garantía de Soporte y Continuidad Alystech', text: 'Un solo plan de soporte cubre gestión móvil y seguridad informática, eliminando facturaciones duplicadas y brindando un único punto de contacto técnico para Araucanos S.A.' },
  engineeringNote: {
    title: 'Nota Técnica: Incorporación Futura de Dispositivos',
    text: 'La capacitación para que el personal de Araucanos S.A. realice el onboarding de nuevos dispositivos está incluida sin costo adicional. Si se prefiere que Alystech ejecute el proceso, aplican tarifas por volumen: 1-5 dispositivos: $24/u · 6-20 dispositivos: $19/u · Más de 20: $14/u.'
  },
  inSimple:
    'Un solo plan de soporte cubre tanto la app de rastreo como la seguridad de los equipos — no se paga por dos servicios separados.',
  intro:
    'Un único plan de soporte cubre tanto la plataforma de gestión móvil como el monitoreo de seguridad, dado que ambos operan sobre el mismo servidor y son gestionados por el mismo equipo. Esto evita cobrar dos servicios superpuestos.',
  notes: [],
  hint: 'Seleccione un plan de soporte. Es el único costo recurrente de la propuesta y cubre ambas capacidades.',
  defaultOptionId: 'sup-estandar',
  options: [
    {
      id: 'sup-basico',
      code: 'SOP-A',
      group: 'sup',
      name: 'Básico',
      badge: { label: 'ESENCIAL', tone: 'eco' },
      priceUsd: 890,
      priceUnit: '/año',
      recurUsd: 890,
      hwUsd: 0,
      devUsd: 890,
      isDefault: false,
      description:
        'Cobertura esencial remota en horario laboral para operaciones que gestionan la mayor parte de forma interna y requieren respaldo puntual. No incluye visitas presenciales (ver condiciones comerciales).',
      features: [
        { status: 'yes', text: 'Atención remota en horario laboral (lunes a viernes)' },
        { status: 'yes', text: 'Respuesta ante incidentes en 24–48 h' },
        { status: 'yes', text: 'Actualizaciones de seguridad trimestrales (MDM y servidor)' },
        { status: 'no', text: 'Altas, bajas y reconfiguración de dispositivos NO incluidas: se cobran por unidad (ver bloque E, incorporación posterior)' },
        { status: 'mid', text: 'Monitoreo instalado, pero sin gestión proactiva de alertas incluida' },
      ],
      costBreakdown: [
        { category: 'svc', label: 'Soporte Básico (MDM + seguridad)', amountUsd: 890, recurring: true },
      ],
    },
    {
      id: 'sup-estandar',
      code: 'SOP-B',
      group: 'sup',
      name: 'Estándar',
      badge: { label: 'RECOMENDADA', tone: 'recommended' },
      priceUsd: 1590,
      priceUnit: '/año',
      recurUsd: 1590,
      hwUsd: 0,
      devUsd: 1590,
      isDefault: true,
      description:
        'Cobertura remota equilibrada con gestión proactiva del monitoreo y respuesta ante incidentes. Adecuado para la operación de Araucanos. No incluye visitas presenciales (ver condiciones comerciales).',
      features: [
        { status: 'yes', text: 'Atención remota en horario laboral ampliado' },
        { status: 'yes', text: 'Respuesta ante incidentes en 8–12 h' },
        { status: 'yes', text: 'Actualizaciones de seguridad mensuales' },
        { status: 'yes', text: 'Altas, bajas y ajustes de políticas incluidos, sin cargo por dispositivo' },
        { status: 'yes', text: 'Gestión del monitoreo con respuesta a alertas + reporte mensual' },
      ],
      costBreakdown: [
        { category: 'svc', label: 'Soporte Estándar (MDM + seguridad)', amountUsd: 1590, recurring: true },
      ],
    },
    {
      id: 'sup-prioritario',
      code: 'SOP-C',
      group: 'sup',
      name: 'Prioritario',
      badge: { label: 'COBERTURA EXTENDIDA', tone: 'pro' },
      priceUsd: 2890,
      priceUnit: '/año',
      recurUsd: 2890,
      hwUsd: 0,
      devUsd: 2890,
      isDefault: false,
      description:
        'Cobertura extendida con respuesta rápida ante incidentes críticos, monitoreo proactivo permanente y una revisión trimestral en sitio incluida. Para operaciones que no admiten interrupciones prolongadas.',
      features: [
        { status: 'yes', text: 'Atención extendida, incluye fines de semana' },
        { status: 'yes', text: 'Respuesta ante incidentes críticos en 2–4 h' },
        { status: 'yes', text: 'Actualizaciones continuas y gestión completa de políticas y dispositivos' },
        { status: 'yes', text: 'Monitoreo proactivo permanente con alertas y respuesta a incidentes' },
        { status: 'yes', text: 'Una (1) revisión trimestral en sitio incluida; visitas adicionales según condiciones comerciales' },
      ],
      costBreakdown: [
        { category: 'svc', label: 'Soporte Prioritario (MDM + seguridad)', amountUsd: 2890, recurring: true },
      ],
    },
    {
      id: 'sup-dedicado',
      code: 'SOP-D',
      group: 'sup',
      name: 'Dedicado',
      badge: { label: 'MÁXIMA COBERTURA', tone: 'pro' },
      priceUsd: 4900,
      priceUnit: '/año',
      recurUsd: 4900,
      hwUsd: 0,
      devUsd: 4900,
      isDefault: false,
      description:
        'Cobertura 24/7 con técnico asignado a la cuenta, SLA agresivo y presencia mensual en sitio. Para operaciones críticas donde cada incidente tiene impacto directo en el servicio de seguridad al cliente final.',
      features: [
        { status: 'yes', text: 'Atención 24/7, todos los días del año' },
        { status: 'yes', text: 'Respuesta ante incidentes críticos en 1 h; técnico asignado a la cuenta' },
        { status: 'yes', text: 'Actualizaciones continuas, gestión completa de políticas y dispositivos sin límite' },
        { status: 'yes', text: 'Monitoreo proactivo permanente, con umbrales de alerta ajustados a la operación' },
        { status: 'yes', text: 'Revisión mensual en sitio incluida; canal directo de escalamiento' },
      ],
      costBreakdown: [
        { category: 'svc', label: 'Soporte Dedicado (MDM + seguridad)', amountUsd: 4900, recurring: true },
      ],
    },
  ],
  trailingNotes: [
    {
      tone: 'info',
      label: 'Por qué un solo plan',
      text: 'Si la plataforma MDM y el monitoreo de seguridad se contrataran por separado, buena parte del trabajo se duplicaría: el mismo servidor, el mismo equipo técnico y la misma consola de gestión. Al unificarlos, el cliente ve un único costo recurrente en lugar de dos, con un ahorro respecto de contratar ambos servicios de forma independiente. El plan puede escalarse o reducirse de nivel en cualquier momento.',
    },
  ],
};
