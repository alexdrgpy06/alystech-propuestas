import type { OptionGroupContent } from '../../types/proposal';

export const aud: OptionGroupContent = {
  id: 'aud',
  stepIndex: 4,
  code: 'C',
  groupTitle: 'Bloque C · Seguridad Informática',
  title: 'Auditoría, Remediación y Monitoreo Continuo de Amenazas',
  risk: 'El parque de aproximadamente 20 estaciones de trabajo administrativas de Araucanos S.A. ya registró intrusiones activas de malware. El riesgo de persistencia de troyanos, puertas traseras lógicas y agentes de exfiltración de datos es crítico.',
  impact: 'Sin una remediación profesional, la organización queda expuesta al robo de credenciales corporativas, cifrado de bases de datos operacionales mediante ransomware y parálisis de la facturación centralizada.',
  guarantee: { title: 'Garantía de Saneamiento y Telemetría de Estaciones', text: 'Se desplegarán agentes ligeros de telemetría en las 20 terminales para la recolección centralizada de registros, detección de anomalías en la ejecución de software y generación de alertas proactivas.' },
  tcoRegional: {
    title: 'Análisis Comparativo de Costos de Monitoreo',
    description: 'Referencia de costos para servicios de remediación y monitoreo de ciberseguridad contratados con firmas especializadas en la región de Paraguay:',
    competitorLabel: 'SOC como Servicio regional (abono anual)',
    competitorValue: '$2.400 / año',
    alystechLabel: 'Alystech — SIEM integrado en servidor local',
    alystechValue: '$659 / año',
    savingsText: 'La infraestructura de alertas se centraliza en el servidor propio de Araucanos S.A., lo que representa un ahorro del 70% respecto al modelo de suscripción regional.'
  },
  inSimple:
    'Limpiamos y blindamos los ~20 equipos de oficina, y dejamos instalado el monitoreo que avisa si algo raro pasa en la red o el servidor.',
  intro:
    'Auditoría y remediación del parque informático (aproximadamente 20 equipos) ante los antecedentes de intrusión y software malicioso, y aseguramiento de la red. La solución deja la operación limpia, documentada y protegida, con monitoreo de seguridad alojado en el mismo servidor.',
  notes: [
    {
      tone: 'warn',
      label: 'Sugerencias de mejoras de seguridad estándar',
      text: 'La auditoría incluye la entrega de un informe de sugerencias de mejoras de seguridad estándar para asegurar que la LAN administrativa cumpla con políticas de ciberseguridad corporativas. Las remediaciones de parches y configuraciones locales están cubiertas.',
    },
  ],
  techDetail: {
    summary: 'Ver detalle técnico — metodología, monitoreo y alcance por nivel',
    architectureHeading: 'Metodología de auditoría',
    architectureSteps: [
      {
        title: 'Inventario y descubrimiento',
        text: 'Relevamiento de los 20 equipos, red, router y servidor actual. Identificación de la superficie de exposición.'
      },
      {
        title: 'Análisis de vulnerabilidades',
        text: 'Evaluación de nivel de actualización, cuentas, privilegios y servicios.'
      },
      {
        title: 'Remediación y endurecimiento',
        text: 'Depuración de software malicioso, cierre de cuentas y puertos, aplicación de actualizaciones y segmentación de red.'
      },
      {
        title: 'Informe y protección continua',
        text: 'Informe con hallazgos priorizados y plan de acción. Monitoreo permanente.'
      }
    ],
    narrative: {
      heading: 'Qué es el monitoreo de seguridad y cómo funciona',
      text: 'El monitoreo continuo consiste en observar de forma permanente lo que ocurre en la red, los equipos y el servidor, para detectar y responder ante actividad anómala antes de que se convierta en un incidente. Se implementa mediante una plataforma de código abierto de gestión de eventos de seguridad (SIEM) y detección en puntos finales (XDR), sin costo de licencia.'
    },
    howItWorks: {
      heading: 'Cómo opera el monitoreo, paso a paso',
      rows: []
    }
  },
  hint: 'Seleccione un nivel de auditoría y remediación.',
  defaultOptionId: 'aud-full',
  // Montos trazados al costBreakdown de AUD-D: líneas "Implementación SIEM/XDR completo" ($1.320)
  // y "Prueba de intrusión interna (Pentest)" ($840). AUD-B + ambos addons = AUD-D ($2.699 + $1.320 + $840 = $4.859). Ningún precio nuevo.
  addons: [
    {
      id: 'aud-addon-siem',
      label: 'Implementación SIEM/XDR completo',
      description:
        'Despliegue completo de la plataforma SIEM/XDR de código abierto en el servidor local, con telemetría de las 20 terminales y alertas proactivas.',
      amountUsd: 1320,
      includedInTiers: ['aud-soc'],
      applicableTiers: ['aud-full'],
    },
    {
      id: 'aud-addon-pentest',
      label: 'Prueba de intrusión interna (pentest)',
      description:
        'Prueba de intrusión interna que simula incidentes reales de ransomware para validar la resiliencia, con informe de vulnerabilidades avanzado.',
      amountUsd: 840,
      includedInTiers: ['aud-soc'],
      applicableTiers: ['aud-full'],
    },
  ],
  options: [
    {
      id: 'aud-base',
      code: 'AUD-A',
      group: 'aud',
      name: 'Hardening y limpieza de endpoints',
      badge: { label: 'BÁSICA', tone: 'eco' },
      priceUsd: 1548,
      priceUnit: 'Año 1',
      recurUsd: 349,
      hwUsd: 0,
      devUsd: 1548,
      isDefault: false,
      description:
        'Endurecimiento básico de los 20 equipos (cuentas, parches, configuración local) y remediación estándar de malware. Incluye un informe estándar de sugerencias de mejoras.',
      features: [
        { status: 'yes', text: 'Hardening de los 20 endpoints: cuentas, parches, configuración local' },
        { status: 'yes', text: 'Informe estándar de sugerencias de mejoras' }
      ],
      costBreakdown: [
        { category: 'lab', label: 'Hardening de endpoints y remediación (2 jornadas)', amountUsd: 1199 },
        { category: 'svc', label: 'Protección de puntos finales (20)', amountUsd: 349, recurring: true }
      ],
      perDeviceNote: '≈ $77,40 por equipo · Plazo estimado: 2 jornadas en sitio',
    },
    {
      id: 'aud-full',
      code: 'AUD-B',
      group: 'aud',
      name: 'Completa con monitoreo SIEM',
      badge: { label: 'RECOMENDADA', tone: 'recommended' },
      priceUsd: 2699,
      priceUnit: 'Año 1',
      recurUsd: 659,
      hwUsd: 0,
      devUsd: 2699,
      isDefault: true,
      description:
        'Todo el alcance de AUD-A, más análisis forense de terminales infectadas, aseguramiento de red, despliegue de telemetría continua y monitoreo en servidor local.',
      features: [
        { status: 'yes', text: 'Auditoría completa e informe estándar de sugerencias de mejoras' },
        { status: 'yes', text: 'Análisis forense y depuración de software malicioso persistente' },
        { status: 'yes', text: 'Monitoreo centralizado SIEM en servidor local' }
      ],
      costBreakdown: [
        { category: 'lab', label: 'Auditoría y remediación estándar (4–5 días)', amountUsd: 2040 },
        { category: 'svc', label: 'Protección de puntos finales (20)', amountUsd: 659, recurring: true }
      ],
      perDeviceNote: '≈ $134,95 por equipo auditado · Plazo estimado: 4 a 5 jornadas en sitio',
    },
    {
      id: 'aud-edr',
      code: 'AUD-C',
      group: 'aud',
      name: 'EDR & Antivirus Enterprise con Monitoreo SIEM',
      badge: { label: 'AVANZADA', tone: 'recommended' },
      priceUsd: 3299,
      priceUnit: 'Año 1',
      recurUsd: 1299,
      hwUsd: 0,
      devUsd: 3299,
      isDefault: false,
      description:
        'Todo el alcance de AUD-B, adicionando suscripción a Antivirus EDR empresarial con detección proactiva contra ransomware y amenazas avanzadas.',
      features: [
        { status: 'yes', text: 'Todo el alcance de AUD-B (auditoría, SIEM, desinfección, informe)' },
        { status: 'yes', text: 'Licenciamiento EDR & Antivirus Enterprise para las 20 terminales' }
      ],
      costBreakdown: [
        { category: 'lab', label: 'Auditoría, remediación estándar y despliegue EDR', amountUsd: 2000 },
        { category: 'svc', label: 'Licenciamiento Antivirus EDR Enterprise (20)', amountUsd: 1299, recurring: true }
      ],
      perDeviceNote: '≈ $164,95 por equipo auditado · Plazo estimado: 5 jornadas en sitio',
    },
    {
      id: 'aud-soc',
      code: 'AUD-D',
      group: 'aud',
      name: 'Integral con prueba de intrusión (Pentesting)',
      badge: { label: 'MÁXIMA', tone: 'pro' },
      priceUsd: 4859,
      priceUnit: 'Año 1',
      recurUsd: 659,
      hwUsd: 0,
      devUsd: 4859,
      isDefault: false,
      description:
        'Remediación estándar, monitoreo SIEM/XDR y prueba de intrusión interna (pentest) simulando incidentes reales de ransomware para validar la resiliencia.',
      features: [
        { status: 'yes', text: 'Todo el alcance de AUD-B' },
        { status: 'yes', text: 'Prueba de intrusión (pentest) e informe de vulnerabilidades avanzado' }
      ],
      costBreakdown: [
        { category: 'lab', label: 'Auditoría y remediación estándar', amountUsd: 2040 },
        { category: 'lab', label: 'Implementación SIEM/XDR completo', amountUsd: 1320 },
        { category: 'lab', label: 'Prueba de intrusión interna (Pentest)', amountUsd: 840 },
        { category: 'svc', label: 'Protección de puntos finales (20)', amountUsd: 659, recurring: true }
      ],
      perDeviceNote: '≈ $242,95 por equipo auditado · Plazo estimado: 6 a 8 jornadas en sitio',
    },
  ],
};
