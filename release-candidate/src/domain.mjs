// Adapted from original proposal totals: group defaults and included/applicable extras.
export function validate(p) {
  const fail = () => { throw new Error('Invalid proposal configuration / Configuración inválida'); };
  const str = (x) => typeof x === 'string' && x.trim().length > 0 && x.length <= 10000;
  const money = (x) => Number.isSafeInteger(x) && x >= 0 && x <= 1000000000;
  if (!p || !str(p.id) || !str(p.version) || !str(p.title) || !str(p.seller) || !str(p.client) || !['USD','EUR','PYG'].includes(p.currency) || !['en','es'].includes(p.locale) || !Array.isArray(p.groups) || !p.groups.length || p.groups.length > 20 || !Array.isArray(p.terms) || !p.terms.every(str) || !str(p.description)) fail();
  if (p.logo && !/^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(p.logo)) fail();
  if (p.color && !/^#[0-9a-f]{6}$/i.test(p.color)) fail();
  const unique = (a) => new Set(a).size === a.length;
  if (!unique(p.groups.map(g => g.id))) fail();
  for (const g of p.groups) {
    if (!str(g.id) || !str(g.title) || !Array.isArray(g.options) || !g.options.length || g.options.length > 20 || !unique(g.options.map(o => o.id)) || !Array.isArray(g.addons) || g.addons.length > 50 || !unique(g.addons.map(a => a.id)) || !g.options.some(o => o.id === g.defaultOptionId)) fail();
    for (const o of g.options) if (!str(o.id) || !str(o.name) || !str(o.description) || !money(o.price) || !money(o.annual) || !Array.isArray(o.features) || !o.features.every(str)) fail();
    for (const a of g.addons) {
      if (!str(a.id) || !str(a.name) || !money(a.price) || !money(a.annual) || !Array.isArray(a.includedInTiers) || !a.includedInTiers.every(id => g.options.some(o=>o.id===id))) fail();
      if (a.applicableTiers && (!Array.isArray(a.applicableTiers) || !a.applicableTiers.every(id => g.options.some(o=>o.id===id)))) fail();
    }
  }
  return p;
}
export const defaults = p => Object.fromEntries(p.groups.map(g=>[g.id,g.defaultOptionId]));
export const available = (a,id) => !a.includedInTiers.includes(id) && (!a.applicableTiers || a.applicableTiers.includes(id));
export function summary(p, selections, extras={}) {
  validate(p);
  const lines=[];
  for (const g of p.groups) {
    const o=g.options.find(o=>o.id===selections[g.id]);
    if (!o) throw new Error('Select an option for every group');
    lines.push({group:g.id,id:o.id,name:o.name,price:o.price,annual:o.annual});
    for (const id of new Set(extras[g.id] || [])) {
      const a=g.addons.find(a=>a.id===id);
      if (a && available(a,o.id)) lines.push({group:g.id,id:a.id,name:a.name,price:a.price,annual:a.annual,addon:true});
    }
  }
  return {lines,initial:lines.reduce((s,l)=>s+l.price,0),annual:lines.reduce((s,l)=>s+l.annual,0)};
}
export function decision(p,selections,extras,type,demo,message='') {
  if (!['accepted','changes_requested','consultation_requested','rejected'].includes(type)) throw new Error('Invalid decision');
  return {proposalId:p.id,version:p.version,timestamp:new Date().toISOString(),decision:type,sandbox:demo,currency:p.currency,...summary(p,selections,extras),message:String(message).slice(0,4000)};
}
export const money = (p,amount) => new Intl.NumberFormat(p.locale,{style:'currency',currency:p.currency}).format(amount/(p.currency==='PYG'?1:100));
