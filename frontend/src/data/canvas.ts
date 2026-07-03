import type { CanvasContent } from '../types/proposal';

export const canvas: CanvasContent = {
  title: 'Resumen Ejecutivo · Plan Estratégico de Ciberseguridad',
  subtitle:
    'El plan de ingeniería se consolida de forma metodológica en el siguiente lienzo ejecutivo de viabilidad técnica:',
  alternativesHeading: 'Otras opciones disponibles por bloque',
  quadrants: [
    { title: 'Diagnóstico Operativo', items: ['80 celulares descontrolados en campo (guardias evaden rondas).', '20 PCs administrativas expuestas a infecciones persistentes de LAN.'] },
    { title: 'Arquitectura Tecnológica', items: ['Virtualización local Proxmox VE.', 'Consola MDM e informes locales.', 'Aislamiento perimetral por VLANs.', 'Telemetría SIEM unificada local.'] },
    { title: 'Configuración de Alcance', items: ['MDM-B: Enrolamiento Knox + SMS.', 'SRV-B: Ingeniería de Servidor.', 'NET-B: Cortafuegos e IPsec.', 'AUD-B: Ingeniería Forense + SIEM.'] },
    { title: 'Viabilidad y Cronograma', items: ['Fase de Red/Servidor: S2 a S4.', 'Fase de Endpoints/SIEM: S5 a S6.', 'Fase de Enrolamiento Knox: S7-S8.', 'Hitos de Pago: 50% / 25% / 25%.'] },
    { title: 'Resumen de Presupuesto', items: ['Desarrollo Año 1: $14.457 USD', 'Abono Soporte SOP-B: $1.590 USD/a', 'Equivalente: ~90.356.250 Gs', 'Todos los precios incluyen IVA.'] }
  ],
  roadmap: [
    { phase: 'Fase 1: Relevamiento y Diseño Lógico de Perímetros', week: 'Semana 1', milestone: 'Aceptación formal de la propuesta técnica de desarrollo. Pago del 50% de desarrollo.', actions: ['Mapeo físico y lógico de los equipos y routers de red en la oficina central.', 'Análisis lógico de puertos abiertos y trazabilidad de tráfico con software sniffer de red.', 'Carga de base de datos de números IMEI corporativos de los 80 teléfonos Samsung en el portal Samsung Knox.'] },
    { phase: 'Fase 2: Configuración de Servidores y Aislamiento de Red', week: 'Semanas 2 a 4', actions: ['Instalación del hipervisor Proxmox VE sobre el servidor del cliente.', 'Aprovisionamiento de máquinas virtuales (VMs) aisladas e instalación de la base de datos PostgreSQL de la consola MDM.', 'Instalación lógica del firewall OPNsense, enrutamiento por VLANs para separar el entorno administrativo, y configuración de VPN WireGuard.'] },
    { phase: 'Fase 3: Adicciones de Seguridad Forense y Endurecimiento', week: 'Semanas 5 a 6', milestone: 'Avance de obra y verificación perimetral. Pago del 25% de desarrollo.', actions: ['Remediación forense y desinfección manual de malware en las 20 terminales de oficina administrativa.', 'Ejecución de políticas de endurecimiento (hardening) de sistema operativo estación por estación.', 'Instalación de agentes SIEM en las PCs para activar la telemetría de monitoreo continuo contra el servidor central.'] },
    { phase: 'Fase 4: Enrolamiento Knox, Capacitación y Cierre', week: 'Semanas 7 a 8', milestone: 'Cierre del proyecto de ingeniería. Pago final del 25% de desarrollo y activación del abono SOP-B.', actions: ['Enrolamiento masivo automático (onboarding) de los 80 teléfonos Samsung Knox. Verificación de restricciones anti-apagado y canal de respaldo SMS de emergencia.', 'Entrenamiento práctico de supervisores en el uso del panel cartográfico unificado.', 'Entrega final de manuales técnicos, llaves criptográficas de la VPN y el Informe Técnico con Recomendaciones de Ciberseguridad Priorizadas.'] }
  ],
  buttons: {
    consulta: 'Hacer una consulta',
    pdf: 'Descargar presupuesto (PDF)',
    reject: 'Rechazar',
    accept: 'Aceptar propuesta',
  },
};
