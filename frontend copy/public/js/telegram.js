// frontend/js/telegram.js

export let tg = null;

export function initTelegram() {
  const isRealTelegram = window.Telegram &&
                         window.Telegram.WebApp &&
                         window.Telegram.WebApp.initDataUnsafe &&
                         window.Telegram.WebApp.initDataUnsafe.user;

  if (isRealTelegram) {
    //console.log('Telegram WebApp API найден.');
    tg = window.Telegram.WebApp;
    tg.ready();
  } else {
    //console.warn('Telegram WebApp API не найден. Используется mock.');
    tg = createMockTelegram();
  }

  applyTheme(tg.themeParams);
  return tg;
}

export function setMainButton(text, onClick) {
  tg.MainButton.setText(text);
  tg.MainButton.show();
  tg.MainButton.onClick(onClick);
}

export function hideMainButton() {
  tg.MainButton.hide();
  tg.MainButton.offClick();
}

export function setBackButton(onClick) {
  tg.BackButton.show();
  tg.BackButton.onClick(onClick);
}

export function hideBackButton() {
  tg.BackButton.hide();
  tg.BackButton.offClick();
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (!theme) return;

  root.style.setProperty('--bg-color', theme.bg_color || '#ffffff');
  root.style.setProperty('--text-color', theme.text_color || '#000000');
  root.style.setProperty('--button-color', theme.button_color || '#2ea6ff');
  root.style.setProperty('--button-text-color', theme.button_text_color || '#ffffff');
}

// Мок Telegram API для локальной разработки
function createMockTelegram() {
  return {
    initData: 'mock_init_data_token',
    initDataUnsafe: {
      user: {
        id: 123456789,
        username: 'mock_user',
        first_name: 'Mock',
        language_code: 'ru',
      },
    },
    MainButton: {
      show: () => console.log('MainButton: show'),
      hide: () => console.log('MainButton: hide'),
      setText: (text) => console.log('MainButton: setText:', text),
      onClick: (cb) => console.log('MainButton: onClick set (mock)'),
      offClick: () => console.log('MainButton: onClick removed (mock)'),
    },
    BackButton: {
      show: () => console.log('BackButton: show'),
      hide: () => console.log('BackButton: hide'),
      onClick: (cb) => console.log('BackButton: onClick set (mock)'),
      offClick: () => console.log('BackButton: onClick removed (mock)'),
    },
    themeParams: {
      bg_color: '#ffffff',
      text_color: '#000000',
      button_color: '#2ea6ff',
      button_text_color: '#ffffff',
    },
    ready: () => console.log('Telegram WebApp: ready (mock)'),
  };
}
