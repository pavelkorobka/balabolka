// frontend/js/i18n.js

import { AppState } from './app.js';

const translations = {};

export async function loadTranslations() {
  try {
    const ru = await fetch('/i18n/ru.json').then((res) => res.json());
    translations.ru = ru;
  } catch (e) {
    console.error('Ошибка загрузки ru.json', e);
    translations.ru = {};
  }

  try {
    const ua = await fetch('/i18n/ua.json').then((res) => res.json());
    translations.ua = ua;
  } catch (e) {
    console.error('Ошибка загрузки ua.json', e);
    translations.ua = {};
  }
}

export function t(key) {
  const lang = AppState.language || 'ru';
  const dict = translations[lang] || {};

  const parts = key.split('.');
  let value = dict;

  for (let part of parts) {
    value = value?.[part];
    if (value === undefined) return key;
  }

  return value;
}
