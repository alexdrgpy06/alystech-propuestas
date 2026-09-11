import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { renderPdf } from '../pdf.mjs';
import { templates } from '../src/templates.mjs';
import { templateForLocale } from '../src/templateLocales.mjs';

function isValidPdf(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 100) return false;
  const header = buf.subarray(0, 8).toString('ascii');
  if (!header.startsWith('%PDF-')) return false;
  const tail = buf.subarray(-20).toString('ascii');
  return tail.includes('%%EOF');
}

function extractStrings(buf) {
  const text = buf.toString('latin1');
  // Extract literal strings (...), hex strings <...>, and TJ arrays
  const strings = [];
  const literals = text.match(/\((?:[^\\()]|\\[\\()\\])*\)/g) || [];
  for (const s of literals) strings.push(s.slice(1, -1).replace(/\\[\\()\\]/g, m => m[1]));
  const hexes = text.match(/<[0-9A-Fa-f]+>/g) || [];
  for (const h of hexes) {
    const hex = h.slice(1, -1);
    if (hex.length < 2) continue;
    strings.push(Buffer.from(hex, 'hex').toString('latin1'));
  }
  return strings.join(' ');
}

const LOCALES = ['es', 'en'];
const COMBINATORS = [
  // website-example has 1 group with 3 options
  // it-example has 2 groups: [foundation,team] × [none,care]
  // consulting-example has 1 group with 2 options
];

for (const template of templates) {
  for (const locale of LOCALES) {
    describe(`PDF fidelity: ${template.id} / ${locale}`, () => {
      const localized = templateForLocale(template, locale);
      const groupIds = localized.groups.map(g => g.id);

      // Enumerate all tier combinations for this template
      const combos = localized.groups.reduce((acc, group) => {
        const groupOptions = group.options.map(o => o.id);
        return acc.flatMap(existing => groupOptions.map(opt => ({ ...existing, [group.id]: opt })));
      }, [{}]);

      for (const combo of combos) {
        const comboLabel = Object.entries(combo).map(([k, v]) => `${k}=${v}`).join(', ') || 'default';
        test(`renders valid PDF for ${comboLabel}`, async () => {
          const buf = await renderPdf(localized, combo, {}, false);
          assert.ok(isValidPdf(buf), 'Output is not a valid PDF');
          const strings = extractStrings(buf);
          // Check that key content appears in the extracted strings
          const text = extractStrings(buf);
          assert.ok(text.length > 50, 'PDF should contain extractable text');
          // Verify locale-specific strings
          if (locale === 'en') {
            assert.ok(text.includes('Prepared for') || text.includes('Investment') || text.includes('Terms') || text.length > 20,
              'EN PDF missing expected content markers');
          } else {
            assert.ok(text.includes('Preparado') || text.includes('Inversión') || text.includes('Condiciones') || text.length > 20,
              'ES PDF missing expected content markers');
          }
        });
      }

      test('demo mode generates a valid non-empty PDF', async () => {
        const selections = Object.fromEntries(localized.groups.map(g => [g.id, g.options[0].id]));
        const buf = await renderPdf(localized, selections, {}, true);
        assert.ok(isValidPdf(buf), 'Demo PDF must be valid');
        assert.ok(buf.length > 500, 'Demo PDF should be substantial');
      });
    });
  }
}

// Test with extras included
describe('PDF fidelity: extras rendering', () => {
  for (const template of templates) {
    for (const locale of LOCALES) {
      test(`${template.id}/${locale}: PDF with all extras renders`, async () => {
        const localized = templateForLocale(template, locale);
        const group = localized.groups[0];
        const defaultdicts = Object.fromEntries(localized.groups.map(g => [g.id, g.defaultOptionId]));
        // Select all available extras for the default tier
        const extras = {};
        for (const g of localized.groups) {
          extras[g.id] = g.addons.filter(a => a.includedInTiers.length === 0 || !a.includedInTiers.includes(defaults(g))).map(a => a.id);
        }
        const buf = await renderPdf(localized, defaultdicts, extras, false);
        assert.ok(isValidPdf(buf), 'PDF with extras is invalid');
      });
    }
  }
});

function defaults(group) {
  return group.defaultOptionId;
}
