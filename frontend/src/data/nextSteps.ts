import type { NextStepsContent } from '../types/proposal';

export const nextSteps: NextStepsContent = {
  title: 'Próximos pasos',
  intro: 'Así continúa el proceso una vez definida la configuración y aceptada la propuesta.',
  timeline: [
    {
      week: 'Paso 1',
      text: 'Aceptación de la propuesta. Confirman la configuración elegida desde esta misma página (botón «Aceptar propuesta»).',
    },
    {
      week: 'Paso 2',
      text: 'Pago inicial (50% del desarrollo) y agenda de la visita de relevamiento en sitio. Esta visita puede detectar hallazgos fuera del alcance cotizado (hardware, licencias puntuales, cableado); de aparecer, se presupuestan aparte antes de ejecutarlos.',
    },
    {
      week: 'Paso 3',
      text: 'Implementación. Servidor, MDM, red y auditoría según lo seleccionado. Pago del 25% (desarrollo) al llegar a esta fase. Los equipos se facturan aparte, a cargo del cliente.',
    },
    {
      week: 'Paso 4',
      text: 'Pruebas, capacitación y entrega. Verificación de rastreo, respaldo por SMS y documentación entregada. Pago final del 25% (desarrollo).',
    },
    {
      week: 'Continuo',
      text: 'Soporte y monitoreo según el plan unificado contratado, con reportes periódicos.',
      future: true,
    },
  ],
};
