import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassPanel, GlassPanelHeader, GlassPanelBody, GlassPanelFooter } from './GlassPanel';
import { GhostButton } from './ActionButton';

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface-dark/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal — GlassPanel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Tabla de características: ${groupTitle}`}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.18, ease: 'easeIn' } }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden"
          >
            <GlassPanel variant="modal" className="h-full flex flex-col">
              {/* Header */}
              <GlassPanelHeader className="bg-white/95 border-border-slate">
                <div>
                  <span className="font-label-caps text-label-caps text-primary">Comparador de Alcance</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-1">
                    Tabla de Características: {groupTitle}
                  </h3>
                </div>
                <GhostButton
                  onClick={onClose}
                  size="sm"
                  aria-label="Cerrar comparador"
                  className="p-2 -m-1 rounded-full"
                >
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                    close
                  </span>
                </GhostButton>
              </GlassPanelHeader>

              {/* Content (scrollable) */}
              <GlassPanelBody className="overflow-x-auto overflow-y-auto p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-border-slate bg-surface-container-low/50">
                        <th className="py-4 px-4 font-bold text-ink-navy sticky left-0 z-10 bg-surface-container-low">Característica</th>
                        {headers.map((h) => {
                          const isSel = h.id === selectedOptionId;
                          return (
                            <th
                              key={h.id}
                              className={`py-4 px-4 text-center font-bold ${isSel ? 'text-primary bg-primary/5' : 'text-ink-navy'}`}
                            >
                              <div className="font-label-caps text-label-caps">{h.code}</div>
                              <div className="font-body-medium text-body-medium text-ink-muted mt-1">{h.name}</div>
                              {isSel && (
                                <span className="inline-block bg-primary text-on-primary font-label-caps text-label-caps px-2 py-0.5 rounded-full mt-1.5 shadow-sm">
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
                        <tr key={rIdx} className="border-b border-border-slate/50 hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-ink-navy border-r border-border-slate/40 sticky left-0 z-10 bg-white/95">{row.name}</td>
                          {headers.map((h) => {
                            const val = row.values[h.id];
                            const isSel = h.id === selectedOptionId;

                            let cellContent = null;
                            if (val === true) {
                              cellContent = (
                                <span className="inline-block bg-positive/10 text-positive font-bold px-2.5 py-0.5 rounded border border-positive/20 font-label-caps text-label-caps">
                                  Sí
                                </span>
                              );
                            } else if (val === false) {
                              cellContent = <span className="text-ink-muted font-medium">No</span>;
                            } else {
                              cellContent = (
                                <span className="inline-block bg-warning/10 text-warning font-bold px-2.5 py-0.5 rounded border border-warning/20 font-label-caps text-label-caps">
                                  {val}
                                </span>
                              );
                            }

                            return (
                              <td
                                key={h.id}
                                className={`py-3.5 px-4 text-center align-middle ${isSel ? 'bg-primary/5' : ''}`}
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
              </GlassPanelBody>

              {/* Footer */}
              <GlassPanelFooter className="bg-surface-container-low border-border-slate">
                <p className="font-body-medium text-body-medium text-ink-muted text-right">
                  Diferenciaciones de servicio según propuesta técnica.
                </p>
              </GlassPanelFooter>
            </GlassPanel>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}