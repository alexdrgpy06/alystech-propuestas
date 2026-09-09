const english = {
  'website-example': {
    seller: 'Horizon Studio (example)', client: 'Example client', title: 'A site built to grow', description: 'A clear, fast and easy-to-maintain web presence. Choose the scope that best supports your business.', terms: ['Fictional prices for product demonstration.', 'Final scope and schedule are agreed separately.', 'Amounts exclude taxes. Annual charges are shown separately and are not part of the initial payment.'],
    groups: [{ title: 'Choose your site', options: [{ name: 'Essential', description: 'For presenting your business clearly.', features: ['Up to 5 pages', 'Responsive design', 'Contact form'] }, { name: 'Growth', description: 'For turning visits into enquiries.', features: ['Up to 12 pages', 'Editable blog', 'Analytics and initial SEO'] }, { name: 'Complete', description: 'For launching with content and guidance.', features: ['Everything in Growth', 'Initial copy included', 'Two training sessions'] }], addons: [{ name: 'Initial copy' }, { name: 'Annual maintenance' }] }],
  },
  'it-example': {
    seller: 'Horizon Studio (example)', client: 'Example client', title: 'Simpler operations', description: 'Set up an orderly technology base and the level of support your team needs.', terms: ['Fictional prices for product demonstration.', 'Final scope and schedule are agreed separately.', 'Amounts exclude taxes. Annual charges are shown separately and are not part of the initial payment.'],
    groups: [{ title: 'Getting started', options: [{ name: 'Foundation', description: 'Organization and initial configuration.', features: ['Initial inventory', 'Backup configuration'] }, { name: 'Team', description: 'A shared base for better work.', features: ['Everything in Foundation', 'Onboarding for up to 10 users', 'Process documentation'] }], addons: [{ name: 'Training workshop' }] }, { title: 'Ongoing support', options: [{ name: 'No recurring plan', description: 'Documented handover.', features: ['Post-delivery support quoted separately'] }, { name: 'Care plan', description: 'Preventive annual follow-up.', features: ['Monthly review', '4 hours of assistance per month'] }], addons: [] }],
  },
  'consulting-example': {
    seller: 'Horizon Studio (example)', client: 'Example client', title: 'From idea to a clear plan', description: 'A consulting project with concrete decisions, priorities and an implementation path.', terms: ['Fictional prices for product demonstration.', 'Final scope and schedule are agreed separately.', 'Amounts exclude taxes. Annual charges are shown separately and are not part of the initial payment.'],
    groups: [{ title: 'Consulting scope', options: [{ name: 'Diagnostic', description: 'Understand the situation and agree priorities.', features: ['Two interviews', 'Findings report'] }, { name: 'Action plan', description: 'Turn priorities into next steps.', features: ['Everything in Diagnostic', '90-day roadmap', 'Prioritization workshop'] }], addons: [{ name: 'Additional workshop' }, { name: '30-day follow-up' }] }],
  },
}

export function templateForLocale(template, locale) {
  if (locale !== 'en' || !english[template.id]) return structuredClone({ ...template, locale })
  const localized = english[template.id]
  return {
    ...structuredClone(template),
    ...localized,
    locale: 'en',
    groups: template.groups.map((group, groupIndex) => ({
      ...group,
      title: localized.groups[groupIndex]?.title || group.title,
      options: group.options.map((option, optionIndex) => ({
        ...option,
        name: localized.groups[groupIndex]?.options[optionIndex]?.name || option.name,
        description: localized.groups[groupIndex]?.options[optionIndex]?.description || option.description,
        features: localized.groups[groupIndex]?.options[optionIndex]?.features || option.features,
      })),
      addons: group.addons.map((addon, addonIndex) => ({
        ...addon,
        name: localized.groups[groupIndex]?.addons[addonIndex]?.name || addon.name,
      })),
    })),
  }
}
