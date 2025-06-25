// frontend/js/app.js
import { initTelegram } from './telegram.js';
import { createUser, getCurrentUser } from './api.js';
import { showScreen as showWelcome } from './screens/welcome.js';
import { loadTranslations } from './i18n.js';
import { loadScreen } from './screens/router.js';


// Глобальное состояние
export const AppState = {
  user: null,
  language: 'ru',
};

async function initApp() {
  // Инициализация Telegram WebApp
  const tg = initTelegram();

  // Пытаемся получить initData (обязательно!)
  const initDataUnsafe = tg.initDataUnsafe;
  const initData = {
    telegram_id: initDataUnsafe.user.id,
    username: initDataUnsafe.user.username,
    first_name: initDataUnsafe.user.first_name,
    language_code: initDataUnsafe.user.language_code?.startsWith('uk') ? 'ua' : 'ru',
  };

  AppState.language = initData.language_code;

  // Пытаемся получить пользователя
  try {
    const user = await getCurrentUser();
    AppState.user = user;
  } catch (err) {
    // Если пользователь не найден — создаём нового
    const user = await createUser(initData);
    AppState.user = user;
  }

  await loadTranslations();

  const debugScreen = new URLSearchParams(location.search).get('screen');
  if (debugScreen) {
    loadScreen(debugScreen);
  } else {
    showWelcome(); // welcome по умолчанию
  }
}

// Запускаем
initApp();
