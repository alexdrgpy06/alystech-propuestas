export type GroupId = 'mdm' | 'srv' | 'net' | 'aud' | 'sup';

export interface BadgeInfo {
  label: string;
  tone: 'recommended' | 'eco' | 'pro' | 'warn';
}

export interface FeatureLine {
  status: 'yes' | 'no' | 'mid';
  text: string;
}

/** hw = Equipos/Hardware, lab = Desarrollo, lic = Licencia, svc = Servicio (matches .cat-hw/.cat-lab/.cat-lic/.cat-svc in the legacy CSS) */
export type CostCategory = 'hw' | 'lab' | 'lic' | 'svc';

export interface CostLine {
  category: CostCategory;
  label: string;
  amountUsd: number;
  /** true if amountUsd is a "/año" recurring charge instead of a one-time cost */
  recurring?: boolean;
}

export interface PlanOption {
  id: string;
  code: string;
  group: GroupId;
  name: string;
  badge?: BadgeInfo;
  priceUsd: number;
  /** unit shown next to the price, e.g. "implementación", "único", "Año 1", "/año" */
  priceUnit: string;
  recurUsd: number;
  /** hardware portion of priceUsd, for the dev/hw split bar (0 if none) */
  hwUsd: number;
  /** development/implementation portion of priceUsd (0 if none) */
  devUsd: number;
  isDefault: boolean;
  description: string;
  features: FeatureLine[];
  costBreakdown: CostLine[];
  /** e.g. "≈ $106,25 por dispositivo (implementación) · Plazo estimado: 3 a 4 semanas" */
  perDeviceNote?: string;
  /** trailing note shown below the cost breakdown, e.g. ampliación posterior, entrega de código fuente */
  extraNote?: string;
}

/** Addon opcional que se puede sumar a cualquier tier del bloque, seleccionable desde el modal de detalle */
export interface AddonItem {
  id: string;
  label: string;
  description: string;
  amountUsd: number;
  /** true si amountUsd es un cargo recurrente anual en vez de un costo único */
  recurring?: boolean;
  /** se muestra con tick "Recomendado" en el modal */
  recommended?: boolean;
  /** ids de PlanOption de este grupo que ya incluyen el addon de forma nativa — ahí se muestra "Incluido" y no se cobra de nuevo */
  includedInTiers: string[];
  /** si se define, el addon solo se ofrece sobre estos tiers (ej. "Consola a medida" no aplica sobre una plataforma comercial de terceros); sin definir, aplica a todos los tiers del bloque */
  applicableTiers?: string[];
}

export interface MatrixCell {
  value: string;
  tone?: 'y' | 'n' | 'p';
}

export interface ComparisonMatrix {
  title: string;
  /** optional paragraph shown between the title and the table (e.g. MDM's "Catálogo de ítems" intro) */
  intro?: string;
  headers: string[];
  rows: { label: string; cells: MatrixCell[] }[];
  /** optional trailing <p class="mini"> shown right after the table */
  footnote?: string;
}

export interface ChartBar {
  label: string;
  amountUsd: number;
  /** legacy bar color token b1..b4, kept so bar width/order matches the source */
  tone: 'b1' | 'b2' | 'b3' | 'b4';
  /** 0-100, matches the explicit width used in the source (kept instead of recomputed) */
  widthPct: number;
}

export interface ArchitectureStep {
  title: string;
  text: string;
}

/** A generic heading+paragraph block inside a techdetail, e.g. AUD's "Qué es el monitoreo de seguridad y cómo funciona" */
export interface TechNarrativeSection {
  heading: string;
  text: string;
}

export interface HowItWorksRow {
  /** the .hw-k label, e.g. "Agentes en los equipos" */
  label: string;
  /** the .hw-v text */
  text: string;
}

/** Maps a .hiw box (heading + a list of label/text rows), e.g. AUD's "Cómo opera el monitoreo, paso a paso" */
export interface HowItWorksBox {
  heading: string;
  rows: HowItWorksRow[];
}

/** Maps a .vstrip bad/good comparison column, e.g. AUD's "Sin monitoreo" vs "Con monitoreo" */
export interface ComparisonColumn {
  heading: string;
  tone: 'bad' | 'good';
  items: string[];
}

export interface FeatureCard {
  emoji: string;
  title: string;
  text: string;
}

export interface Note {
  tone: 'info' | 'warn' | 'good' | 'amber';
  label: string;
  text: string;
}

/** Content that used to live inside <details class="techdetail"> for a group step — shown in the group-level detail modal */
export interface GroupTechDetail {
  summary: string;
  /** heading shown above architectureSteps, e.g. "Arquitectura de la solución" (MDM) or "Metodología de auditoría" (AUD) */
  architectureHeading?: string;
  architectureSteps?: ArchitectureStep[];
  /** free-standing heading+paragraph block, e.g. AUD's monitoring explainer before the .hiw box */
  narrative?: TechNarrativeSection;
  howItWorks?: HowItWorksBox;
  comparisonColumns?: ComparisonColumn[];
  /** notes that appear inside the techdetail body itself (as opposed to OptionGroupContent.notes/trailingNotes) */
  notes?: Note[];
  catalogMatrix?: ComparisonMatrix;
  costChart?: ChartBar[];
  comparisonMatrix?: ComparisonMatrix;
}

export interface OptionGroupContent {
  id: GroupId;
  stepIndex: number;
  code: string;
  groupTitle: string;
  title: string;
  risk: string;
  impact: string;
  guarantee: { title: string; text: string };
  tcoRegional?: {
    title: string;
    description: string;
    competitorLabel: string;
    competitorValue: string;
    alystechLabel: string;
    alystechValue: string;
    savingsText: string;
  };
  engineeringNote?: {
    title: string;
    text: string;
  };
  /** "En simple" stepcard blurb */
  inSimple: string;
  intro: string;
  featureCards?: FeatureCard[];
  notes: Note[];
  techDetail?: GroupTechDetail;
  hint: string;
  defaultOptionId: string;
  options: PlanOption[];
  /** addons opcionales del bloque, sumables sobre cualquier tier elegido (ver includedInTiers por addon) */
  addons?: AddonItem[];
  /** extra note blocks that appear after the options list (e.g. importación note under B · Servidor) */
  trailingNotes?: Note[];
}

export interface OverviewContent {
  lead: string;
  execboxHeading: string;
  execboxParagraphs: { leadIn: string; text: string }[];
  scaleBannerIcon: string;
  scaleBannerHeading: string;
  scaleBannerText: string;
  glanceHeading: string;
}

export interface GlanceCard {
  group: GroupId;
  icon: string;
  title: string;
  text: string;
  gotoStep: number;
}

export interface PayCard {
  icon: string;
  title: string;
  text: string;
}

export interface BenefitCard {
  icon: string;
  title: string;
  text: string;
}

export interface ConditionCard {
  title: string;
  text: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  letterParagraphs: string[];
  signatureName: string;
  signatureRole: string;
  meta: { label: string; value: string }[];
}

export interface AboutContent {
  kicker: string;
  title: string;
  lead: string;
  benefits: BenefitCard[];
  paySubkicker: string;
  payCards: PayCard[];
}

export interface OnboardingTier {
  range: string;
  pricePerUnit: string;
}

export interface OnboardingContent {
  code: string;
  title: string;
  intro: string;
  includedNote: string;
  tiers: OnboardingTier[];
  scaleBanner: { icon: string; heading: string; text: string };
}

export interface NextStep {
  week: string;
  text: string;
  future?: boolean;
}

export interface NextStepsContent {
  title: string;
  intro: string;
  timeline: NextStep[];
}

export interface TermsContent {
  title: string;
  items: string[];
  footerLine1: string;
  footerLine2: string;
}

export interface CanvasContent {
  title: string;
  subtitle: string;
  alternativesHeading: string;
  buttons: { consulta: string; pdf: string; reject: string; accept: string };
  quadrants?: { title: string; items: string[] }[];
  roadmap?: { phase: string; week: string; milestone?: string; actions: string[] }[];
}

export interface TcoContent {
  title: string;
  intro: string;
  saasPerDeviceUsd: number;
  deviceCount: number;
  years: number;
}

export interface DecisionModalContent {
  acceptTitle: string;
  rejectTitle: string;
  acceptHint: string;
  rejectHint: string;
  acceptSubmitLabel: string;
  rejectSubmitLabel: string;
  summaryLabel: string;
  okTitle: string;
  okText: string;
}

export interface ConsultaModalContent {
  title: string;
  hint: string;
  submitLabel: string;
  okTitle: string;
  okText: string;
}

export interface ModalsContent {
  decision: DecisionModalContent;
  consulta: ConsultaModalContent;
}

/** Full site content, ported 1:1 from public/araucanos/index.html (source of truth: docs/reference/original-index.html) */
export interface ProposalContent {
  proposalId: string;
  exchangeRate: number;
  deviceCount: number;
  hero: HeroContent;
  about: AboutContent;
  conditions: ConditionCard[];
  overview: OverviewContent;
  glanceCards: GlanceCard[];
  groups: OptionGroupContent[];
  onboarding: OnboardingContent;
  nextSteps: NextStepsContent;
  terms: TermsContent;
  canvas: CanvasContent;
  tco: TcoContent;
  modals: ModalsContent;
}

export interface Selection {
  group: GroupId;
  optionId: string;
}

/** ids de addons marcados por el usuario, por grupo */
export type AddonSelections = Record<GroupId, string[]>;

export interface Totals {
  totalUsd: number;
  recurUsd: number;
  hwUsd: number;
  devUsd: number;
  perDeviceUsd: number;
}

export interface DecisionPayload {
  proposalId: string;
  decision: 'accept' | 'reject';
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  comments?: string;
  selections: SelectionSummary[];
  totals: { total: string; recurrent: string };
}

export interface ConsultaPayload {
  proposalId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}

/** Enriched per-selection summary sent to /api/pdf so the server can render a detailed, professional quote */
export interface SelectionSummary {
  group: GroupId;
  code: string;
  name: string;
  price: string;
  id: string;
  description?: string;
  costBreakdown?: CostLine[];
}
