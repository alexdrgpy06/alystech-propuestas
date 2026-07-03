import type { OptionGroupContent } from '../../types/proposal';

export const net: OptionGroupContent = {
  id: 'net',
  stepIndex: 3,
  code: 'B.2',
  groupTitle: 'Bloque B.2 · Seguridad de Red Perimetral',
  title: 'Segmentación y Blindaje de la Red Corporativa',
  risk: 'La red local de Araucanos S.A. no implementa segmentación lógica: el tráfico administrativo, la navegación del personal operativo y los accesos de terceros comparten el mismo canal y rango de direcciones IP.',
  impact: 'Esta configuración permite que una infección de malware en cualquier estación de trabajo se propague lateralmente a través de la LAN, comprometiendo directamente el servidor central y las bases de datos críticas.',
  guarantee: { title: 'Garantía de Aislamiento Lógico', text: 'Todas las alternativas contemplan la creación de VLANs seguras y reglas de cortafuegos dedicadas para aislar el tráfico del servidor administrativo del resto de la red corporativa.' },
  tcoRegional: {
    title: 'Referencia de Costos de Red Regional',
    description: 'Estimación de abonos de administración y licenciamiento de firewalls comerciales en el Cono Sur:',
    competitorLabel: 'Suscripción Fortinet/Meraki (abono anual)',
    competitorValue: '$1.200 / año',
    alystechLabel: 'Alystech — OPNsense sin abono de licencias',
    alystechValue: '$0 / año',
    savingsText: 'El uso de software lógico open-source (OPNsense) en el cortafuegos elimina los costos anuales de suscripción de firmas propietarias.'
  },
  engineeringNote: {
    title: 'Nota Técnica: VPN Corporativa WireGuard',
    text: 'Con la opción recomendada se despliega una VPN cifrada basada en WireGuard, lo que permite al equipo directivo de Araucanos S.A. supervisar la consola de gestión móvil y acceder a los archivos corporativos de forma segura desde cualquier ubicación.'
  },
  inSimple:
    'Asegurar que las computadoras del personal y los invitados no tengan acceso a la red interna donde está el servidor.',
  intro:
    'El aseguramiento de la red requiere separar el tráfico de administración del operativo. Según el relevamiento, podría ser necesario incorporar cortafuegos (firewall) dedicado, conmutador (switch) administrable y punto de acceso.',
  notes: [],
  hint: 'Seleccione un nivel de equipamiento de red.',
  defaultOptionId: 'net-base',
  // Monto trazado al costBreakdown de NET-C: línea "Punto de acceso empresarial" $350. Ningún precio nuevo.
  // Nota: NET-B + este addon no equivale a NET-C (NET-C además amplía el switch a 24 puertos).
  addons: [
    {
      id: 'net-addon-ap',
      label: 'Punto de acceso WiFi empresarial con red de invitados',
      description:
        'Punto de acceso empresarial con SSID de invitados aislado de la red interna, integrado a la segmentación del cortafuegos.',
      amountUsd: 350,
      includedInTiers: ['net-full', 'net-mesh'],
      applicableTiers: ['net-base'],
    },
  ],
  options: [
    {
      id: 'net-none',
      code: 'NET-A',
      group: 'net',
      name: 'Reutilizar equipamiento existente',
      badge: { label: 'NO RECOMENDADO', tone: 'warn' },
      priceUsd: 0,
      priceUnit: 'a validar',
      recurUsd: 0,
      hwUsd: 0,
      devUsd: 0,
      isDefault: false,
      description:
        'Se reconfigura el equipamiento de red actual sin reemplazo. No recomendado dados los antecedentes de intrusión: el equipamiento existente no permite segmentar administración de operación.',
      features: [
        { status: 'no', text: 'No recomendado: no resuelve la falta de segmentación que facilitó incidentes previos' },
        { status: 'yes', text: 'Reconfiguración segura del router y la red existentes, dentro de sus límites' },
      ],
      costBreakdown: [],
    },
    {
      id: 'net-base',
      code: 'NET-B',
      group: 'net',
      name: 'Cortafuegos + switch administrable',
      badge: { label: 'RECOMENDADA', tone: 'recommended' },
      priceUsd: 899,
      priceUnit: 'único',
      recurUsd: 0,
      hwUsd: 700,
      devUsd: 199,
      isDefault: true,
      description:
        'Cortafuegos dedicado (OPNsense sobre hardware) y switch administrable para segmentar la red. Base sólida para separar administración de operación.',
      features: [
        { status: 'yes', text: 'Cortafuegos dedicado con OPNsense (sin costo de licencia)' },
        { status: 'yes', text: 'Switch administrable para VLAN y segmentación' },
      ],
      costBreakdown: [
        { category: 'hw', label: 'Appliance cortafuegos', amountUsd: 420 },
        { category: 'hw', label: 'Switch administrable 8–16 puertos', amountUsd: 280 },
        { category: 'lab', label: 'Configuración y segmentación', amountUsd: 199 },
      ],
      extraNote: 'Plazo estimado: 1 jornada en sitio.',
    },
    {
      id: 'net-full',
      code: 'NET-C',
      group: 'net',
      name: 'Red segmentada completa',
      priceUsd: 1899,
      priceUnit: 'único',
      recurUsd: 0,
      hwUsd: 1470,
      devUsd: 429,
      isDefault: false,
      description:
        'Cortafuegos, switch administrable de mayor capacidad (24 puertos) y punto de acceso WiFi empresarial con red de invitados aislada. Para una red corporativa robusta.',
      features: [
        { status: 'yes', text: 'Cortafuegos + switch administrable de mayor capacidad (24 puertos)' },
        { status: 'yes', text: 'Punto de acceso empresarial con SSID de invitados aislado' },
      ],
      costBreakdown: [
        { category: 'hw', label: 'Cortafuegos', amountUsd: 490 },
        { category: 'hw', label: 'Switch administrable 24 puertos', amountUsd: 630 },
        { category: 'hw', label: 'Punto de acceso empresarial', amountUsd: 350 },
        { category: 'lab', label: 'Configuración y segmentación', amountUsd: 429 },
      ],
      extraNote: 'Plazo estimado: 1 a 2 jornadas en sitio.',
    },
    {
      id: 'net-mesh',
      code: 'NET-D',
      group: 'net',
      name: 'Premium SD-WAN y WiFi Mesh',
      priceUsd: 2699,
      priceUnit: 'único',
      recurUsd: 0,
      hwUsd: 2180,
      devUsd: 519,
      isDefault: false,
      description:
        'OPNsense redundante, doble enlace WAN inteligente, WiFi-6 Mesh y switch administrable de alta densidad. Redundancia de conectividad para Araucanos S.A.',
      features: [
        { status: 'yes', text: 'Doble enlace WAN activo-activo con balanceo de carga' },
        { status: 'yes', text: 'Red redundante de APs WiFi-6 Mesh para cobertura de planta' },
      ],
      costBreakdown: [
        { category: 'hw', label: 'Appliance cortafuegos redundante', amountUsd: 800 },
        { category: 'hw', label: 'Switch administrable 24 puertos', amountUsd: 630 },
        { category: 'hw', label: 'Puntos de acceso WiFi-6 Mesh', amountUsd: 750 },
        { category: 'lab', label: 'Configuración avanzada SD-WAN y Mesh', amountUsd: 519 },
      ],
      extraNote: 'Plazo estimado: 2 a 3 jornadas en sitio.',
    },
  ],
};
