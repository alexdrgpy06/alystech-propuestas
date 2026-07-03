import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeatureComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupTitle: string;
  selectedOptionId: string;
}

interface FeatureRow {
  name: string;
  values: Record<string, string | boolean>;
}

export function FeatureComparisonModal({
  isOpen,
  onClose,
  groupId,
  groupTitle,
  selectedOptionId,
}: FeatureComparisonModalProps) {
  // Cerrar con Escape y bloquear el scroll del body mientras el modal está abierto
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  // Define comparison matrix data for each module
  let headers: { code: string; name: string; id: string }[] = [];
  let rows: FeatureRow[] = [];

  if (groupId === 'mdm') {
    headers = [
      { code: 'MDM-A', name: 'Base', id: 'mdm-oss' },
      { code: 'MDM-B', name: 'Completa', id: 'mdm-hybrid' },
      { code: 'MDM-C', name: 'A Medida', id: 'mdm-custom' },
      { code: 'MDM-D', name: 'SureMDM Cloud', id: 'mdm-com' },
    ];
    rows = [
      { name: 'Enrolamiento Automático Knox', values: { 'mdm-oss': true, 'mdm-hybrid': true, 'mdm-custom': true, 'mdm-com': true } },
      { name: 'Bloqueo de Apagado de Terminal', values: { 'mdm-oss': true, 'mdm-hybrid': true, 'mdm-custom': true, 'mdm-com': true } },
      { name: 'Bloqueo de GPS y Datos', values: { 'mdm-oss': true, 'mdm-hybrid': true, 'mdm-custom': true, 'mdm-com': true } },
      { name: 'Canal de Respaldo por SMS', values: { 'mdm-oss': 'Ampliación', 'mdm-hybrid': true, 'mdm-custom': true, 'mdm-com': true } },
      { name: 'Consola y Reportes Avanzados', values: { 'mdm-oss': false, 'mdm-hybrid': false, 'mdm-custom': 'A Medida', 'mdm-com': true } },
      { name: 'Operación 100% Servidor Local', values: { 'mdm-oss': true, 'mdm-hybrid': true, 'mdm-custom': true, 'mdm-com': false } },
      { name: 'Cero Licenciamiento Recurrente', values: { 'mdm-oss': true, 'mdm-hybrid': true, 'mdm-custom': true, 'mdm-com': false } },
    ];
  } else if (groupId === 'srv') {
    headers = [
      { code: 'SRV-A', name: 'Reacondicionado', id: 'srv-refurb' },
      { code: 'SRV-B', name: 'Nuevo PowerEdge', id: 'srv-new' },
      { code: 'SRV-C', name: 'Cluster HA', id: 'srv-ha' },
    ];
    rows = [
      { name: 'Virtualización Proxmox VE', values: { 'srv-refurb': true, 'srv-new': true, 'srv-ha': true } },
      { name: 'Discos Redundantes RAID 1', values: { 'srv-refurb': true, 'srv-new': true, 'srv-ha': true } },
      { name: 'Estado del Servidor', values: { 'srv-refurb': 'Reacondicionado', 'srv-new': 'Nuevo Dell PowerEdge', 'srv-ha': '2x Reacondicionados' } },
      { name: 'Estabilizador de Energía UPS', values: { 'srv-refurb': false, 'srv-new': '2500 VA incluido', 'srv-ha': '2x 1500 VA incluidos' } },
      { name: 'Garantía de Hardware', values: { 'srv-refurb': '1 Año', 'srv-new': '3 Años Dell oficial', 'srv-ha': '2 Años Alystech' } },
      { name: 'Replicación y Failover Automático', values: { 'srv-refurb': false, 'srv-new': false, 'srv-ha': true } },
    ];
  } else if (groupId === 'net') {
    headers = [
      { code: 'NET-A', name: 'Existente', id: 'net-none' },
      { code: 'NET-B', name: 'Básica', id: 'net-base' },
      { code: 'NET-C', name: 'Completa', id: 'net-full' },
      { code: 'NET-D', name: 'Premium SD-WAN', id: 'net-mesh' },
    ];
    rows = [
      { name: 'Cortafuegos Dedicado OPNsense', values: { 'net-none': false, 'net-base': true, 'net-full': true, 'net-mesh': true } },
      { name: 'Segmentación VLAN (LAN/WiFi)', values: { 'net-none': false, 'net-base': true, 'net-full': true, 'net-mesh': true } },
      { name: 'Puntos de Acceso WiFi6 Empresarial', values: { 'net-none': false, 'net-base': false, 'net-full': '1 AP incluido', 'net-mesh': 'APs Mesh distribuidos' } },
      { name: 'Balanceo de Doble Enlace WAN', values: { 'net-none': false, 'net-base': false, 'net-full': false, 'net-mesh': true } },
      { name: 'Red de Invitados Aislada', values: { 'net-none': false, 'net-base': false, 'net-full': true, 'net-mesh': true } },
    ];
  } else if (groupId === 'aud') {
    headers = [
      { code: 'AUD-A', name: 'Hardening', id: 'aud-base' },
      { code: 'AUD-B', name: 'SIEM Básico', id: 'aud-full' },
      { code: 'AUD-C', name: 'EDR Antivirus', id: 'aud-edr' },
      { code: 'AUD-D', name: 'Pentest/Intrusión', id: 'aud-soc' },
    ];
    rows = [
      { name: 'Hardening en 20 Terminales', values: { 'aud-base': true, 'aud-full': true, 'aud-edr': true, 'aud-soc': true } },
      { name: 'Informe de Mejoras Estándar', values: { 'aud-base': true, 'aud-full': true, 'aud-edr': true, 'aud-soc': true } },
      { name: 'Análisis Forense y Desinfección', values: { 'aud-base': false, 'aud-full': true, 'aud-edr': true, 'aud-soc': true } },
      { name: 'Monitoreo Centralizado SIEM', values: { 'aud-base': false, 'aud-full': true, 'aud-edr': true, 'aud-soc': true } },
      { name: 'Antivirus EDR Corporativo', values: { 'aud-base': false, 'aud-full': false, 'aud-edr': true, 'aud-soc': true } },
      { name: 'Prueba de Penetración (Pentest)', values: { 'aud-base': false, 'aud-full': false, 'aud-edr': false, 'aud-soc': 'Semestral' } },
    ];
  } else if (groupId === 'sup') {
    headers = [
      { code: 'SOP-A', name: 'Básico', id: 'sup-basico' },
      { code: 'SOP-B', name: 'Estándar', id: 'sup-estandar' },
      { code: 'SOP-C', name: 'Prioritario', id: 'sup-prioritario' },
      { code: 'SOP-D', name: 'Dedicado', id: 'sup-dedicado' },
    ];
    rows = [
      { name: 'Soporte Técnico', values: { 'sup-basico': 'Remoto (8x5)', 'sup-estandar': 'Remoto (8x5 ampliado)', 'sup-prioritario': 'Remoto (Extendida/Finde)', 'sup-dedicado': '24/7' } },
      { name: 'Atención Telefónica Directa', values: { 'sup-basico': false, 'sup-estandar': true, 'sup-prioritario': true, 'sup-dedicado': 'Canal dedicado' } },
      { name: 'Gestión de Alertas y Monitoreo', values: { 'sup-basico': 'No incluida', 'sup-estandar': 'Alertas + Reporte mensual', 'sup-prioritario': 'Permanente proactivo', 'sup-dedicado': 'Permanente proactivo' } },
      { name: 'Copias de Seguridad en la Nube', values: { 'sup-basico': false, 'sup-estandar': false, 'sup-prioritario': true, 'sup-dedicado': true } },
      { name: 'Visita Técnica en Sitio', values: { 'sup-basico': 'No incluida', 'sup-estandar': 'No incluida', 'sup-prioritario': '1 trimestral', 'sup-dedicado': '1 mensual' } },
      { name: 'Tiempo de Respuesta (SLA)', values: { 'sup-basico': '24-48 hs', 'sup-estandar': '8-12 hs', 'sup-prioritario': '2-4 hs críticos', 'sup-dedicado': '1 h críticos' } },
    ];
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface/80 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Tabla de características: ${groupTitle}`}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.18, ease: 'easeIn' } }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative bg-card rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-card-border flex flex-col max-h-[85dvh]"
          >
            {/* Header */}
            <div className="shrink-0 bg-card-hover px-6 py-4 border-b border-card-border flex justify-between items-center">
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-accent">Comparador de Alcance</span>
                <h3 className="font-bold text-navy text-sm sm:text-base mt-0.5">
                  Tabla de Características: {groupTitle}
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar comparador"
                className="text-ink-muted hover:text-ink transition-colors rounded-full p-2.5 -m-1.5 hover:bg-card-border/50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 p-6 overflow-x-auto overflow-y-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-line bg-slate-50/50">
                  <th className="py-4 px-5 font-bold text-navy">Característica</th>
                  {headers.map((h) => {
                    const isSel = h.id === selectedOptionId;
                    return (
                      <th
                        key={h.id}
                        className={`py-4 px-5 text-center font-bold ${
                          isSel ? 'text-blue bg-blue-50/50' : 'text-navy'
                        }`}
                      >
                        <div>{h.code}</div>
                        <div className="text-2xs font-normal text-slate mt-1">{h.name}</div>
                        {isSel && (
                          <span className="inline-block bg-blue text-white text-3xs px-2 py-0.5 rounded-full mt-1.5 shadow-sm">
                            Seleccionado
                          </span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-line-soft hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-navy border-r border-line/40">{row.name}</td>
                    {headers.map((h) => {
                      const val = row.values[h.id];
                      const isSel = h.id === selectedOptionId;

                      let cellContent = null;
                      if (val === true) {
                        cellContent = <span className="inline-block bg-positive-soft text-positive text-xs font-bold px-2.5 py-0.5 rounded">Sí</span>;
                      } else if (val === false) {
                        cellContent = <span className="inline-block text-slate-400 text-xs font-medium">No</span>;
                      } else {
                        cellContent = <span className="inline-block bg-amber-100 text-amber-line text-xs font-bold px-2.5 py-0.5 rounded">{val}</span>;
                      }

                      return (
                        <td
                          key={h.id}
                          className={`py-3.5 px-5 text-center align-middle ${isSel ? 'bg-blue-50/20' : ''}`}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="shrink-0 bg-card-hover px-6 py-3 border-t border-card-border text-2xs text-ink-muted text-right">
            Diferenciaciones de servicio según propuesta técnica.
          </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
