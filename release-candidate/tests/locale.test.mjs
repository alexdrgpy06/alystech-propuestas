import test from 'node:test';
import assert from 'node:assert/strict';
import { templates } from '../src/templates.mjs';
import { templateForLocale } from '../src/templateLocales.mjs';
import { validate } from '../src/domain.mjs';

test('english template localization preserves the proposal contract', () => {
  const localized = templateForLocale(templates[0], 'en');
  assert.equal(localized.locale, 'en');
  assert.equal(localized.title, 'A site built to grow');
  assert.equal(localized.groups[0].options[0].name, 'Essential');
  assert.equal(localized.groups[0].addons[0].name, 'Initial copy');
  assert.doesNotThrow(() => validate(localized));
});

test('spanish localization remains the source language', () => {
  const localized = templateForLocale(templates[0], 'es');
  assert.equal(localized.locale, 'es');
  assert.equal(localized.title, templates[0].title);
  assert.equal(localized.groups[0].options[0].name, 'Esencial');
});
