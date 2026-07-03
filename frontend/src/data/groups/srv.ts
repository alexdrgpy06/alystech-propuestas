import type { OptionGroupContent } from '../../types/proposal';

export const srv: OptionGroupContent = {
  id: 'srv',
  stepIndex: 2,
  code: 'B.1',
  groupTitle: 'Bloque B.1 · Infraestructura Central',
  title: 'Servidor Local Dedicado con Alta Disponibilidad',
  risk: 'La operación central de Araucanos S.A. se sustenta actualmente sobre un computador de escritorio estándar, sin redundancia de almacenamiento ni protección eléctrica, que cumple funciones de servidor de archivos y base de datos.',
  impact: 'Un corte de energía prolongado, un fallo de disco duro o un ataque de ransomware podría paralizar la facturación centralizada y destruir de forma irreversible las bases de datos operacionales y de patrullaje.',
  guarantee: { title: 'Garantía de Mitigación de Riesgos de Planta', text: 'El servidor propuesto operará como nodo físico unificado, hospedando simultáneamente la consola MDM para gestión de flota móvil y el motor de monitoreo SIEM para protección de estaciones de trabajo administrativas.' },
  tcoRegional: {
    title: 'Referencia de Costos de Adquisición Regional',
    description: 'Análisis comparativo del costo de adquisición de hardware de grado servidor en el mercado del Cono Sur, considerando importación y despacho:',
    competitorLabel: 'Cotización regional estimada (importación)',
    competitorValue: '$4.800 - $5.500',
    alystechLabel: 'Alystech — PowerEdge torre con UPS incluido',
    alystechValue: '$4.399',
    savingsText: 'El costo incluye UPS estabilizadora de 2.500 VA, sin intermediación de despachos locales ni costos ocultos de logística.'
  },
  engineeringNote: {
    title: 'Nota Técnica: Virtualización con Proxmox VE',
    text: 'La arquitectura utiliza Proxmox VE (hipervisor de código abierto, sin costo de licencia) para segmentar los servicios en máquinas virtuales aisladas. Esto permite gestionar actualizaciones, respaldos y recuperación de forma independiente para cada componente.'
  },
  inSimple:
    'Pasar de una PC de escritorio a un servidor real, que soporte cortes de luz (UPS) y que no pierda datos si se rompe un disco (RAID).',
  intro:
    'Aseguramiento de la infraestructura central mediante un equipo de grado servidor, almacenamiento redundante (RAID 1) y protección eléctrica. Hospedará el motor de base de datos MDM y la consola de gestión.',
  featureCards: [
    {
      emoji: '📱',
      title: 'Consola MDM',
      text: 'Aloja la plataforma de gestión móvil del bloque A, en operación local.',
    },
    {
      emoji: '🗄️',
      title: 'Archivos y respaldo',
      text: 'Repositorio central y respaldo automatizado cifrado, con copia externa.',
    },
    {
      emoji: '🧱',
      title: 'Virtualización',
      text: 'Proxmox VE (sin costo de licencia) para separar funciones en máquinas virtuales aisladas.',
    },
    {
      emoji: '📊',
      title: 'Monitoreo',
      text: 'Aloja la plataforma de monitoreo de seguridad y el registro de eventos.',
    },
  ],
  notes: [],
  hint: 'Seleccione una opción de servidor.',
  defaultOptionId: 'srv-mid',
  // Monto trazado a los costBreakdown existentes: SRV-D ($6.799) = SRV-B ($4.399) + $2.400
  // (nodo secundario $1.800 + UPS adicional $650 − diferencia de instalación $50, según ambos desgloses). Ningún precio nuevo.
  addons: [
    {
      id: 'srv-addon-ha',
      label: 'Segundo nodo de replicación (alta disponibilidad)',
      description:
        'Segundo servidor con replicación y conmutación por error, más su UPS. Convierte el servidor recomendado en un esquema de alta disponibilidad.',
      amountUsd: 2400,
      includedInTiers: ['srv-ha'],
      applicableTiers: ['srv-mid'],
    },
  ],
  options: [
    {
      id: 'srv-refurb',
      code: 'SRV-A',
      group: 'srv',
      name: 'Servidor rack reacondicionado',
      badge: { label: 'NO RECOMENDADO', tone: 'warn' },
      priceUsd: 2299,
      priceUnit: 'único',
      recurUsd: 0,
      hwUsd: 1880,
      devUsd: 419,
      isDefault: false,
      description:
        'Servidor rack 1U reacondicionado (HPE ProLiant DL20 Gen9 o equivalente): Xeon E3, 32 GB ECC, 2×2 TB en RAID 1, gestión remota iLO, UPS 2500 VA. Se incluye como opción de menor costo, pero Alystech no la recomienda como primera alternativa para esta operación.',
      features: [
        { status: 'no', text: 'No recomendada: equipo reacondicionado, garantía acotada y vida útil restante menor que un servidor nuevo' },
        { status: 'yes', text: 'Xeon E3 de cuatro núcleos, 32 GB ECC, RAID 1 (2×2 TB), gestión remota iLO' },
        { status: 'yes', text: 'Proxmox y respaldo de código abierto; formato 1U de mínimo espacio' },
        { status: 'mid', text: 'Máximo 64 GB de RAM y 4 discos: margen de crecimiento limitado a largo plazo' },
      ],
      costBreakdown: [
        { category: 'hw', label: 'Servidor reacondicionado + discos', amountUsd: 1200 },
        { category: 'hw', label: 'UPS 2500 VA', amountUsd: 680 },
        { category: 'lab', label: 'Instalación y aseguramiento', amountUsd: 419 },
        { category: 'lic', label: 'Proxmox + respaldo', amountUsd: 0 },
      ],
      extraNote: 'Plazo estimado: entrega de equipo 1 a 2 semanas (importación) + instalación en sitio 1 jornada.',
    },
    {
      id: 'srv-mid',
      code: 'SRV-B',
      group: 'srv',
      name: 'Servidor torre nuevo',
      badge: { label: 'RECOMENDADA', tone: 'recommended' },
      priceUsd: 4399,
      priceUnit: 'único',
      recurUsd: 0,
      hwUsd: 3630,
      devUsd: 769,
      isDefault: true,
      description:
        'Servidor torre nuevo (Dell PowerEdge T150/T350 o Lenovo ThinkSystem ST250): Xeon E-2300, 32 GB ECC, RAID 1 (2×2 TB), UPS 2500 VA, garantía en sitio. Amplio margen de crecimiento.',
      features: [
        { status: 'yes', text: 'Xeon E-2300, 32 GB ECC (ampliable a 128 GB), RAID 1, garantía en sitio' },
        { status: 'yes', text: 'Proxmox con funciones separadas (MDM, archivos, respaldo, monitoreo)' },
        { status: 'yes', text: 'UPS 2500 VA incluido' },
        { status: 'yes', text: 'Equipo nuevo: mayor vida útil y soporte de fabricante' },
      ],
      costBreakdown: [
        { category: 'hw', label: 'Servidor torre nuevo', amountUsd: 2880 },
        { category: 'hw', label: 'UPS 2500 VA', amountUsd: 750 },
        { category: 'lab', label: 'Instalación y aseguramiento', amountUsd: 769 },
      ],
      extraNote: 'Plazo estimado: entrega de equipo 2 a 4 semanas (importación) + instalación en sitio 1 a 2 jornadas.',
    },
    {
      id: 'srv-micro',
      code: 'SRV-C',
      group: 'srv',
      name: 'Servidor compacto nuevo',
      priceUsd: 3479,
      priceUnit: 'único',
      recurUsd: 0,
      hwUsd: 2880,
      devUsd: 599,
      isDefault: false,
      description:
        'Torre compacta nueva (HPE ProLiant MicroServer Gen11): Xeon 6300P, 16–32 GB ECC, 2×2 TB, UPS 2500 VA. Equipo nuevo, silencioso, apto para oficina sin sala de servidores.',
      features: [
        { status: 'yes', text: 'Nuevo con garantía, silencioso, apto para entorno de oficina' },
        { status: 'yes', text: '16–32 GB ECC, RAID 1, Proxmox y respaldo de código abierto' },
        { status: 'mid', text: 'Menor expansión que la torre PowerEdge, suficiente para la carga prevista' },
      ],
      costBreakdown: [
        { category: 'hw', label: 'Servidor compacto + discos', amountUsd: 2160 },
        { category: 'hw', label: 'UPS 2500 VA', amountUsd: 720 },
        { category: 'lab', label: 'Instalación y aseguramiento', amountUsd: 599 },
      ],
      extraNote: 'Plazo estimado: entrega de equipo 2 a 4 semanas (importación) + instalación en sitio 1 jornada.',
    },
    {
      id: 'srv-ha',
      code: 'SRV-D',
      group: 'srv',
      name: 'Alta disponibilidad (dos nodos)',
      badge: { label: 'MÁXIMA CONTINUIDAD', tone: 'pro' },
      priceUsd: 6799,
      priceUnit: 'único',
      recurUsd: 0,
      hwUsd: 6080,
      devUsd: 719,
      isDefault: false,
      description:
        'Servidor SRV-B más un segundo nodo con replicación, ambos con UPS 2500 VA. Ante falla de un servidor, los servicios y datos continúan operando. Tolerancia a fallos real.',
      features: [
        { status: 'yes', text: 'Todo el alcance de SRV-B más segundo nodo con replicación y conmutación por error' },
        { status: 'yes', text: 'Continuidad ante falla de hardware; doble UPS 2500 VA; respaldo 3-2-1' },
        { status: 'mid', text: 'Inversión mayor; recomendable cuando la operación no admite interrupciones' },
      ],
      costBreakdown: [
        { category: 'hw', label: 'Nodo principal', amountUsd: 2880 },
        { category: 'hw', label: 'Nodo secundario', amountUsd: 1800 },
        { category: 'hw', label: 'UPS 2500 VA ×2', amountUsd: 1400 },
        { category: 'lab', label: 'Instalación, replicación y aseguramiento', amountUsd: 719 },
      ],
      extraNote: 'Plazo estimado: entrega de equipos 2 a 4 semanas (importación) + instalación y replicación en sitio 2 a 3 jornadas.',
    },
  ],
  trailingNotes: [
    {
      tone: 'info',
      label: 'Importación',
      text: 'Los costos de hardware son referenciales de la región y quedan sujetos a aranceles y flete al momento de la compra. El equipo reacondicionado (SRV-A) reduce aproximadamente un 30% respecto de un equipo nuevo equivalente.',
    },
  ],
};
