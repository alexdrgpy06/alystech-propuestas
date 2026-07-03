import { useState } from 'react';
import { motion } from 'framer-motion';
import type { OptionGroupContent, PlanOption } from '../../types/proposal';
import { formatUsd } from '../../lib/currency';
import { CostBreakdownModal } from '../ui/CostBreakdownModal';
import { RadioCard } from '@/components/ui/RadioCard';

interface OptionsStepProps {
  content: OptionGroupContent;
  selectedOptionId: string;
  onSelectOption: (id: string) => void;
  selectedAddonIds?: string[];
  onToggleAddon?: (addonId: string) => void;
}

// Material Symbols icons mapping for each block
function GroupIcon({ id }: { id: string }) {
  const icons: Record<string, string> = {
    mdm: 'devices',
    srv: 'dns',
    net: 'hub',
    aud: 'search',
    sup: 'support_agent',
  };
  return (
    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 0" }}>
      {icons[id] || 'settings'}
    </span>
  );
}

export function OptionsStep({
  content,
  selectedOptionId,
  onSelectOption,
  selectedAddonIds = [],
  onToggleAddon,
}: OptionsStepProps) {
  const [mobileModal, setMobileModal] = useState<PlanOption | null>(null);

  const handleSelect = (id: string) => {
    onSelectOption(id);
  };

  const iconVariants: Record<string, 'default' | 'primary' | 'success' | 'warning'> = {
    mdm: 'primary',
    srv: 'primary',
    net: 'primary',
    aud: 'warning',
    sup: 'default',
  };

  return (
    <div className="w-full flex flex-col gap-6 py-4">
      {/* Step Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center md:text-left"
      >
        <span className="inline-block px-3 py-1 bg-tertiary-container/20 text-tertiary rounded-full font-label-caps text-label-caps mb-4">
          {content.groupTitle} · Alternativas técnicas
        </span>
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4">
          {content.title}
        </h1>
        <p className="font-body-base text-body-base text-secondary max-w-2xl mx-auto md:mx-0">
          {content.intro || 'Selecciona el nivel de control y seguridad para tu infraestructura. Cada nivel ofrece diferentes capacidades de administración y protección.'}
        </p>
      </motion.div>

      {/* Options Grid — RadioCard grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {content.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;

          return (
            <RadioCard
              key={opt.id}
              selected={isSelected}
              onClick={() => handleSelect(opt.id)}
              icon={<GroupIcon id={content.id} />}
              iconVariant={iconVariants[content.id] || 'default'}
              title={opt.name}
              description={opt.description}
              priceLabel="Desde"
              price={formatUsd(opt.priceUsd)}
              pricePeriod={opt.priceUnit === '/año' ? '' : opt.recurUsd > 0 ? `+${formatUsd(opt.recurUsd)}/año` : '/año'}
              footer={
                <button
                  type="button"
                  className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-body-medium text-sm hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1 min-h-[44px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileModal(opt);
                  }}
                >
                  Ver detalles
                  <span className="material-symbols-outlined text-[16px]">
                    chevron_right
                  </span>
                </button>
              }
            />
          );
        })}
      </motion.div>

      {/* Mobile: full modal for details */}
      <CostBreakdownModal
        isOpen={mobileModal !== null}
        onClose={() => setMobileModal(null)}
        title={mobileModal?.name || ''}
        description={mobileModal?.description}
        features={mobileModal?.features}
        costs={mobileModal?.costBreakdown || []}
        total={mobileModal?.priceUsd || 0}
        addons={content.addons}
        tierId={mobileModal?.id}
        selectedAddonIds={selectedAddonIds}
        onToggleAddon={onToggleAddon}
        groupIcon={content.id}
        optionCode={mobileModal?.code}
      />
    </div>
  );
}
