import type { ModalsContent } from '../types/proposal';

export const modals: ModalsContent = {
  decision: {
    acceptTitle: 'Aceptar propuesta',
    rejectTitle: 'Rechazar propuesta',
    acceptHint:
      'Confirmá tus datos de contacto. Vamos a registrar la configuración exactamente como quedó seleccionada en esta página.',
    rejectHint: 'Contanos brevemente el motivo (opcional). Nos ayuda a ajustar futuras propuestas.',
    acceptSubmitLabel: 'Confirmar aceptación',
    rejectSubmitLabel: 'Confirmar rechazo',
    summaryLabel: 'Resumen de tu selección',
    okTitle: '¡Listo, gracias!',
    okText: 'Registramos tu respuesta. El equipo de Alystech se va a contactar a la brevedad.',
  },
  consulta: {
    title: 'Hacer una consulta',
    hint: '¿Tenés dudas sobre alguna opción, precio o plazo? Escribinos y te respondemos por email.',
    submitLabel: 'Enviar consulta',
    okTitle: '¡Consulta enviada!',
    okText: 'Te respondemos a la brevedad al email que dejaste.',
  },
};
