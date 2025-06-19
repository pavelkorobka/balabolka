import ru from '../../i18n/ru.json' assert { type: 'json' };
import ua from '../../i18n/ua.json' assert { type: 'json' };
import { initTelegram } from './telegram.js';

const langs = { ru, ua };

const userLang = initTelegram()?.user?.language_code || 'ru';
const dict = langs[userLang] || langs['ru'];

export function t(key) {
  return dict[key] || key;
}
