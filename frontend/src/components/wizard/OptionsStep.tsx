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

// Material Symbols icons mapping for each block (fallback when the tier letter is unknown)
const GROUP_ICONS: Record<string, string> = {
  mdm: 'devices',
  srv: 'dns',
  net: 'hub',
  aud: 'search',
  sup: 'support_agent',
};

// Tier-letter icon variants (A=base, B=full, C=custom/bespoke, D=commercial/cloud)
// so each option card in a row reads as visually distinct, not a repeated icon.
const TIER_ICONS: Record<string, string> = {
  A: 'toggle_off',
  B: 'layers',
  C: 'auto_awesome',
  D: 'cloud_done',
};

function OptionIcon({ groupId, code }: { groupId: string; code?: string }) {
  const tierLetter = code?.split('-').pop()?.trim().toUpperCase();
  const iconName = (tierLetter && TIER_ICONS[tierLetter]) || GROUP_ICONS[groupId] || 'settings';
  return (
    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 0" }}>
      {iconName}
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
    <div className="w-full flex flex-col gap-4 py-2">
      {/* Step Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center md:text-left shrink-0"
      >
        <span className="inline-block px-3 py-1 bg-tertiary-container/20 text-tertiary rounded-full font-label-caps text-label-caps mb-2">
          {content.groupTitle} · Alternativas técnicas
        </span>
        <h1 className="font-headline-md md:font-display-lg text-headline-md md:text-display-lg text-on-surface mb-2">
          {content.title}
        </h1>
        <p className="font-body-medium md:font-body-base text-body-medium md:text-body-base text-secondary max-w-2xl mx-auto md:mx-0">
          {content.intro || 'Selecciona el nivel de control y seguridad para tu infraestructura. Cada nivel ofrece diferentes capacidades de administración y protección.'}
        </p>
      </motion.div>

      {/* Options Grid — RadioCard grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {content.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;

          return (
            <RadioCard
              key={opt.id}
              selected={isSelected}
              onClick={() => handleSelect(opt.id)}
              icon={<OptionIcon groupId={content.id} code={opt.code} />}
              iconVariant={iconVariants[content.id] || 'default'}
              title={opt.name}
              description={opt.description}
              priceLabel="Desde"
              price={formatUsd(opt.priceUsd)}
              pricePeriod={opt.priceUnit === '/año' ? '/año' : opt.recurUsd > 0 ? `+${formatUsd(opt.recurUsd)}/año` : ''}
              footer={
                <button
                  type="button"
                  className="bg-blue-dark text-white px-4 py-2.5 rounded-lg font-body-medium font-bold text-sm hover:bg-primary transition-all flex items-center gap-1 min-h-[44px] shadow-sm"
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
