import type { GlanceCard } from '../types/proposal';

export const glanceCards: GlanceCard[] = [
  {
    group: 'mdm',
    icon: 'mobile-device',
    title: 'A · Flota móvil',
    text: 'Control total de los ~80 celulares.',
    gotoStep: 1,
  },
  {
    group: 'srv',
    icon: 'server-rack',
    title: 'B · Servidor y red',
    text: 'Servidor local dedicado y red segmentada.',
    gotoStep: 2,
  },
  {
    group: 'aud',
    icon: 'search',
    title: 'C · Auditoría',
    text: 'Limpieza, blindaje y monitoreo de ~20 equipos.',
    gotoStep: 3,
  },
  {
    group: 'sup',
    icon: 'headset',
    title: 'D · Soporte',
    text: 'Un solo plan cubre app y seguridad.',
    gotoStep: 4,
  },
];
