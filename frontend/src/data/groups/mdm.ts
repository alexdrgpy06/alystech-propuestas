import type { OptionGroupContent } from '../../types/proposal';

export const mdm: OptionGroupContent = {
  id: 'mdm',
  stepIndex: 1,
  code: 'A',
  groupTitle: 'Bloque A · Control Operacional Móvil',
  title: 'Gestión y Blindaje de la Flota de Dispositivos Samsung',
  risk: 'Araucanos S.A. ha identificado que el personal de campo desactiva la geolocalización, apaga los terminales corporativos o ejecuta restablecimientos de fábrica para eludir los controles de ruta y patrullaje establecidos.',
  impact: 'Esta situación genera pérdida total de visibilidad operativa sobre la flota, imposibilita la auditoría de cumplimiento de rutas y expone los activos físicos a sustracción sin posibilidad de bloqueo o localización remota.',
  guarantee: { title: 'Garantía Tecnológica', text: 'Todas las alternativas incorporan la integración con Samsung Knox Platform for Enterprise, el único mecanismo que permite restricciones a nivel de hardware: bloqueo de apagado, protección anti-restablecimiento y control forzado de GPS y datos móviles.' },
  tcoRegional: {
    title: 'Análisis Comparativo de Costos a 3 Años',
    description: 'Proyección del costo total de propiedad para la gestión de 80 dispositivos durante un período de 3 años de operación continua:',
    competitorLabel: 'MDM SaaS regional (promedio de mercado)',
    competitorValue: '$19.680',
    alystechLabel: 'Alystech — Infraestructura propia',
    alystechValue: '$6.200',
    savingsText: 'La implementación sobre infraestructura propia representa un ahorro del 68% frente al modelo de suscripción SaaS regional.'
  },
  engineeringNote: {
    title: 'Nota Técnica: Samsung Knox Mobile Enrollment',
    text: 'Para garantizar un control inalterable sobre los dispositivos Android, la solución requiere la integración con Samsung Knox Mobile Enrollment (KME). Este mecanismo permite inyectar la configuración MDM a nivel de firmware, asegurando que las restricciones persistan incluso ante un restablecimiento de fábrica.'
  },
  inSimple:
    'Tus ~80 celulares no se van a poder apagar ni perder el GPS, y vas a ver la posición de cada uno en tiempo real — con respaldo por SMS si se corta la señal.',
  intro:
    'Puesta en marcha de una plataforma MDM sobre los dispositivos Samsung, con control total del equipo: bloqueo de apagado, imposibilidad de desactivar GPS o datos, rastreo en tiempo real y comandos de respaldo por SMS cuando el equipo carece de datos o WiFi.',
  featureCards: [
    {
      emoji: '⛔',
      title: 'Bloqueo de apagado',
      text: 'El personal no puede apagar el dispositivo. Restricción a nivel de sistema mediante Samsung Knox.',
    },
    {
      emoji: '📍',
      title: 'GPS y datos forzados',
      text: 'Imposibilidad de desactivar ubicación o datos móviles. Garantiza la continuidad del rastreo.',
    },
    {
      emoji: '🛰️',
      title: 'Rastreo en tiempo real',
      text: 'Posición, batería y estado reportados a la consola local, con histórico de recorrido.',
    },
    {
      emoji: '✉️',
      title: 'Respaldo por SMS',
      text: 'Comandos críticos (localizar, bloquear, borrar) por SMS ante ausencia de datos o WiFi.',
    },
  ],
  notes: [
    {
      tone: 'info',
      label: 'Alcance común a todas las opciones',
      text: 'El bloqueo de apagado, el bloqueo de GPS/datos y el rastreo en tiempo real forman parte de la base de Knox y están presentes en las cuatro opciones de la sección A.3, incluida la más económica. Lo que distingue a cada opción es si el respaldo por SMS viene implementado desde el inicio, el tipo de consola (funcional o a medida) y si el soporte continuo está incluido o se contrata aparte.',
    },
    {
      tone: 'info',
      label: 'Fundamento técnico',
      text: 'Las restricciones anti-manipulación (anti-apagado, bloqueo de GPS/datos, protección ante restablecimiento de fábrica) exceden lo que ofrece Android estándar y solo son confiables en equipos Samsung mediante Knox Platform for Enterprise, licencia sin costo provista por Samsung e integrada tanto en soluciones comerciales como de código abierto.',
    },
  ],
  techDetail: {
    summary: 'Ver detalle técnico — arquitectura, catálogo de ítems y comparativa',
    architectureHeading: 'Arquitectura de la solución',
    architectureSteps: [
      {
        title: 'Registro masivo (Knox Mobile Enrollment)',
        text: 'Los equipos se registran de fábrica y se autoconfiguran al encender, sin intervención manual. La configuración persiste tras un restablecimiento de fábrica.',
      },
      {
        title: 'Modo propietario del dispositivo + Knox',
        text: 'El agente MDM asume control total: restricciones anti-apagado, bloqueo de ajustes de GPS y datos, modo kiosco y protección anti-restablecimiento.',
      },
      {
        title: 'Consola de rastreo',
        text: 'El servidor local recibe posición y telemetría. Panel con mapa en vivo, histórico de recorrido y estado de cada dispositivo.',
      },
      {
        title: 'Canal de respaldo SMS',
        text: 'Ante pérdida de datos/WiFi, los comandos críticos viajan por SMS a través de un gateway, de forma independiente a internet.',
      },
    ],
    catalogMatrix: {
      title: 'Catálogo de ítems (mismo costo unitario en todas las opciones)',
      intro:
        'Cada ítem tiene un costo fijo, sin importar en qué opción aparece. Lo que cambia entre A, B e Ideal es cuáles ítems están incluidos, no su precio. Documentación técnica está incluida en las tres opciones de desarrollo propio.',
      headers: ['Ítem', 'Costo unitario', 'A · Base', 'B · Recomendada', 'Ideal'],
      rows: [
        {
          label: 'Instalación y aseguramiento del servidor MDM',
          cells: [
            { value: '$2.200' },
            { value: '✓', tone: 'y' },
            { value: '✓', tone: 'y' },
            { value: '✓', tone: 'y' },
          ],
        },
        {
          label: 'Integración Knox + registro masivo (KME)',
          cells: [
            { value: '$1.800' },
            { value: '✓', tone: 'y' },
            { value: '✓', tone: 'y' },
            { value: '✓', tone: 'y' },
          ],
        },
        {
          label: 'Cargo base de implementación',
          cells: [
            { value: '$770' },
            { value: '✓', tone: 'y' },
            { value: '✓', tone: 'y' },
            { value: '✓', tone: 'y' },
          ],
        },
        {
          label: 'Capacitación de supervisores',
          cells: [
            { value: '$880' },
            { value: '✓', tone: 'y' },
            { value: '✓', tone: 'y' },
            { value: '✓', tone: 'y' },
          ],
        },
        {
          label: 'Documentación técnica',
          cells: [
            { value: '$550' },
            { value: '✓', tone: 'y' },
            { value: '✓', tone: 'y' },
            { value: '✓', tone: 'y' },
          ],
        },
        {
          label: 'Canal de respaldo SMS (gateway + pruebas)',
          cells: [
            { value: '$1.600' },
            { value: '✕', tone: 'n' },
            { value: '✓', tone: 'y' },
            { value: '✓', tone: 'y' },
          ],
        },
        {
          label: 'Configuración de políticas avanzadas (geocercas, kiosco)',
          cells: [
            { value: '$700' },
            { value: '✕', tone: 'n' },
            { value: '✓', tone: 'y' },
            { value: '✓', tone: 'y' },
          ],
        },
        {
          label: 'Consola y panel a medida (desarrollo Alystech)',
          cells: [
            { value: '$3.300' },
            { value: '✕', tone: 'n' },
            { value: '✕', tone: 'n' },
            { value: '✓', tone: 'y' },
          ],
        },
        {
          label: 'Subtotal',
          cells: [{ value: '' }, { value: '$6.200' }, { value: '$8.500' }, { value: '$11.800' }],
        },
      ],
    },
    costChart: [
      { label: 'A · Base', amountUsd: 6200, tone: 'b3', widthPct: 48 },
      { label: 'B · Recomendada', amountUsd: 8500, tone: 'b2', widthPct: 66 },
      { label: 'Ideal · A medida', amountUsd: 11800, tone: 'b1', widthPct: 91 },
      { label: 'Comercial (cloud)', amountUsd: 12900, tone: 'b4', widthPct: 100 },
    ],
    comparisonMatrix: {
      title: 'Comparativa de plataformas',
      headers: ['Criterio', 'A · Base', 'B · Recomendada', 'Ideal · A medida', 'Comercial (cloud)'],
      rows: [
        {
          label: 'Licencia por dispositivo / año',
          cells: [
            { value: '$0', tone: 'y' },
            { value: '$0', tone: 'y' },
            { value: '$0', tone: 'y' },
            { value: '≈ $82', tone: 'n' },
          ],
        },
        {
          label: 'Restricciones Knox',
          cells: [
            { value: 'Sí', tone: 'y' },
            { value: 'Sí', tone: 'y' },
            { value: 'Sí', tone: 'y' },
            { value: 'Sí', tone: 'y' },
          ],
        },
        {
          label: 'Respaldo por SMS',
          cells: [
            { value: 'Ampliación', tone: 'p' },
            { value: 'Sí', tone: 'y' },
            { value: 'Sí', tone: 'y' },
            { value: 'Nativo', tone: 'y' },
          ],
        },
        {
          label: 'Interfaz / consola',
          cells: [
            { value: 'Funcional', tone: 'p' },
            { value: 'Funcional', tone: 'p' },
            { value: 'A medida', tone: 'y' },
            { value: 'Madura', tone: 'y' },
          ],
        },
        {
          label: 'Documentación técnica',
          cells: [
            { value: 'Sí', tone: 'y' },
            { value: 'Sí', tone: 'y' },
            { value: 'Sí', tone: 'y' },
            { value: 'Del fabricante', tone: 'p' },
          ],
        },
        {
          label: 'Operación 100% local',
          cells: [
            { value: 'Sí', tone: 'y' },
            { value: 'Sí', tone: 'y' },
            { value: 'Sí', tone: 'y' },
            { value: 'Opcional (cloud por defecto)', tone: 'p' },
          ],
        },
        {
          label: 'Independencia de proveedor',
          cells: [
            { value: 'Total', tone: 'y' },
            { value: 'Total', tone: 'y' },
            { value: 'Total', tone: 'y' },
            { value: 'Limitada', tone: 'n' },
          ],
        },
      ],
    },
  },
  hint: 'Seleccione una opción. Incluye desarrollo, implementación y puesta en marcha. El soporte continuo se selecciona por separado en el bloque D (plan unificado).',
  defaultOptionId: 'mdm-hybrid',
  // Montos idénticos a los ya listados en techDetail.catalogMatrix — ningún precio nuevo, solo se exponen como addons togglables.
  addons: [
    {
      id: 'mdm-addon-sms',
      label: 'Canal de respaldo por SMS',
      description: 'Gateway SMS + pruebas para comandos críticos (localizar, bloquear, borrar) cuando el equipo no tiene datos ni WiFi.',
      amountUsd: 1600,
      includedInTiers: ['mdm-hybrid', 'mdm-custom'],
      applicableTiers: ['mdm-oss', 'mdm-hybrid', 'mdm-custom'],
    },
    {
      id: 'mdm-addon-politicas',
      label: 'Configuración de políticas avanzadas',
      description: 'Geocercas, modo kiosco y automatizaciones base sobre la flota.',
      amountUsd: 700,
      includedInTiers: ['mdm-hybrid', 'mdm-custom'],
      applicableTiers: ['mdm-oss', 'mdm-hybrid', 'mdm-custom'],
    },
    {
      id: 'mdm-addon-consola',
      label: 'Consola y panel a medida',
      description: 'Panel desarrollado por Alystech: identidad visual propia, mapa en vivo, roles de supervisor y reportes.',
      amountUsd: 3300,
      recommended: true,
      includedInTiers: ['mdm-custom'],
      applicableTiers: ['mdm-oss', 'mdm-hybrid', 'mdm-custom'],
    },
    {
      id: 'mdm-addon-codigo-fuente',
      label: 'Entrega de código fuente',
      description: 'Cesión del código fuente desarrollado (por defecto es licenciado a Araucanos S.A. para su uso, no entregado). Solo tiene sentido junto a la consola a medida.',
      amountUsd: 3500,
      includedInTiers: [],
      applicableTiers: ['mdm-custom'],
    },
  ],
  options: [
    {
      id: 'mdm-oss',
      code: 'MDM-A',
      group: 'mdm',
      name: 'Plataforma de código abierto — base',
      badge: { label: 'MENOR INVERSIÓN', tone: 'eco' },
      priceUsd: 6200,
      priceUnit: 'implementación',
      recurUsd: 0,
      hwUsd: 0,
      devUsd: 6200,
      isDefault: false,
      description:
        'Plataforma MDM de código abierto (licencia Apache 2.0) autohospedada en el servidor local, con integración a Samsung Knox. Cumple los cuatro requisitos base (anti-apagado, bloqueo GPS/datos, rastreo en tiempo real). No incluye el canal de respaldo por SMS ni el soporte continuo.',
      features: [
        { status: 'yes', text: 'Operación íntegra en el servidor local (LAN/WiFi), sin dependencia de la nube' },
        { status: 'yes', text: 'Integración con Knox: anti-apagado, protección anti-restablecimiento, control de tráfico' },
        { status: 'yes', text: 'Registro masivo, modo kiosco, rastreo GPS en tiempo real, sin límite de dispositivos' },
        { status: 'yes', text: 'Documentación técnica incluida' },
        { status: 'no', text: 'No incluye el canal de respaldo por SMS (disponible como ampliación, ver nota debajo)' },
        { status: 'no', text: 'Consola de tipo funcional; sin soporte incluido (ver bloque D)' },
      ],
      costBreakdown: [
        { category: 'lab', label: 'Instalación y aseguramiento del servidor MDM', amountUsd: 2200 },
        { category: 'lab', label: 'Integración Knox + registro masivo (KME)', amountUsd: 1800 },
        { category: 'lab', label: 'Cargo base de implementación', amountUsd: 770 },
        { category: 'lab', label: 'Capacitación de supervisores', amountUsd: 880 },
        { category: 'lab', label: 'Documentación técnica', amountUsd: 550 },
        { category: 'lic', label: 'Headwind + Knox', amountUsd: 0 },
      ],
      perDeviceNote: '≈ $77,50 por dispositivo (implementación) · Plazo estimado: 2 a 3 semanas',
      extraNote:
        'Ampliación posterior — canal de respaldo por SMS: $1.600 (mismo costo unitario que en B/Ideal), en cualquier momento posterior sin reinstalar la plataforma.',
    },
    {
      id: 'mdm-hybrid',
      code: 'MDM-B',
      group: 'mdm',
      name: 'Código abierto con implementación completa',
      badge: { label: 'RECOMENDADA', tone: 'recommended' },
      priceUsd: 8500,
      priceUnit: 'implementación',
      recurUsd: 0,
      hwUsd: 0,
      devUsd: 8500,
      isDefault: true,
      description:
        'Incluye todo el alcance de MDM-A, sumando el canal de respaldo por SMS ya implementado y probado, y una configuración de políticas más completa (geocercas, modo kiosco y automatizaciones base). El soporte continuo se contrata en el plan unificado (bloque D).',
      features: [
        { status: 'yes', text: 'Todo el alcance de MDM-A, con servidor y consola bajo control del cliente' },
        { status: 'yes', text: 'Respaldo por SMS implementado y verificado' },
        { status: 'yes', text: 'Políticas de flota, geocercas base y modo kiosco configurados' },
        { status: 'yes', text: 'Sin costo por dispositivo: ampliar la flota no incrementa el licenciamiento' },
      ],
      costBreakdown: [
        { category: 'lab', label: 'Instalación y aseguramiento del servidor MDM', amountUsd: 2200 },
        { category: 'lab', label: 'Integración Knox + registro masivo (KME)', amountUsd: 1800 },
        { category: 'lab', label: 'Cargo base de implementación', amountUsd: 770 },
        { category: 'lab', label: 'Canal de respaldo SMS (gateway + pruebas)', amountUsd: 1600 },
        { category: 'lab', label: 'Configuración de políticas avanzadas', amountUsd: 700 },
        { category: 'lab', label: 'Capacitación de supervisores', amountUsd: 880 },
        { category: 'lab', label: 'Documentación técnica', amountUsd: 550 },
      ],
      perDeviceNote: '≈ $106,25 por dispositivo (implementación) · Plazo estimado: 3 a 4 semanas',
    },
    {
      id: 'mdm-custom',
      code: 'MDM-C',
      group: 'mdm',
      name: 'Ideal — consola a medida (Headwind + desarrollo Alystech)',
      badge: { label: 'SOLUCIÓN PROPIA', tone: 'pro' },
      priceUsd: 11800,
      priceUnit: 'implementación',
      recurUsd: 0,
      hwUsd: 0,
      devUsd: 11800,
      isDefault: false,
      description:
        'Todo el alcance de MDM-B, sumando una consola y panel de control desarrollados a medida por Alystech: identidad visual propia, mapa en vivo, roles de supervisor y reportes. Diferencia frente a MDM-B: exactamente $3.300, correspondientes solo al desarrollo de la consola.',
      features: [
        { status: 'yes', text: 'Todo el alcance de MDM-B (SMS, políticas avanzadas, capacitación, documentación)' },
        { status: 'yes', text: 'Panel a medida: mapa en vivo, alertas, roles de supervisor y reportes' },
        { status: 'yes', text: 'Identidad visual propia; base auditable + capa propia = independencia total de proveedor' },
        { status: 'mid', text: 'Mayor plazo de desarrollo inicial (2 a 3 semanas adicionales sobre MDM-B)' },
      ],
      costBreakdown: [
        { category: 'lab', label: 'Instalación y aseguramiento del servidor MDM', amountUsd: 2200 },
        { category: 'lab', label: 'Integración Knox + registro masivo (KME)', amountUsd: 1800 },
        { category: 'lab', label: 'Cargo base de implementación', amountUsd: 770 },
        { category: 'lab', label: 'Canal de respaldo SMS (gateway + pruebas)', amountUsd: 1600 },
        { category: 'lab', label: 'Configuración de políticas avanzadas', amountUsd: 700 },
        { category: 'lab', label: 'Capacitación de supervisores', amountUsd: 880 },
        { category: 'lab', label: 'Documentación técnica', amountUsd: 550 },
        { category: 'lab', label: 'Consola y panel a medida', amountUsd: 3300 },
      ],
      perDeviceNote: '≈ $147,50 por dispositivo (implementación) · Plazo estimado: 5 a 6 semanas',
      extraNote:
        'El código desarrollado es propiedad de Alystech, licenciado a Araucanos S.A. para su uso. Entrega de código fuente (opcional): +$3.500 (ver condiciones comerciales).',
    },
    {
      id: 'mdm-com',
      code: 'MDM-D',
      group: 'mdm',
      name: 'Plataforma comercial en la nube (SureMDM)',
      priceUsd: 12900,
      priceUnit: 'Año 1',
      recurUsd: 6560,
      hwUsd: 0,
      devUsd: 12900,
      isDefault: false,
      description:
        'SureMDM (42Gears), consola en la nube del fabricante, con Samsung Knox. Consola madura, soporte 24/7 del fabricante y respaldo por SMS nativo. Máxima madurez, con licenciamiento recurrente por dispositivo.',
      features: [
        { status: 'yes', text: 'Respaldo por SMS nativo (bloquear, localizar, borrar)' },
        { status: 'yes', text: 'Knox completo + geocercas + histórico de recorrido' },
        { status: 'yes', text: 'Soporte 24/7 del fabricante y actualizaciones automáticas' },
        { status: 'yes', text: 'Documentación del fabricante + guía de configuración de Alystech' },
        { status: 'no', text: 'Licencia recurrente ≈ $82/dispositivo/año (80 equipos = $6.560/año); consola en la nube, no local' },
      ],
      costBreakdown: [
        { category: 'lic', label: 'SureMDM cloud 80 × $82', amountUsd: 6560 },
        { category: 'lab', label: 'Implementación, registro y políticas', amountUsd: 4900 },
        { category: 'lab', label: 'Capacitación de supervisores', amountUsd: 880 },
        { category: 'lab', label: 'Documentación técnica', amountUsd: 560 },
      ],
      perDeviceNote: '≈ $161,25 por dispositivo (Año 1) · recurrente $82/dispositivo/año · Plazo estimado: 1 a 2 semanas',
    },
  ],
  trailingNotes: [
    {
      tone: 'good',
      label: 'Recomendación de Alystech',
      text: 'La opción MDM-B ofrece el mejor equilibrio: el motor de código abierto elimina el licenciamiento perpetuo por dispositivo (frente a ≈ $6.560/año de licencia de la alternativa comercial, sin contar implementación) y, combinada con el plan de soporte unificado del bloque D, aporta continuidad operativa. El salto a Ideal agrega solo $3.300 por la consola a medida, sobre el mismo desarrollo funcional de B. Cifras estimativas, IVA incluido.',
    },
  ],
};
