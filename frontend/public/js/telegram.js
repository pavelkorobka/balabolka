export const tg = window.Telegram.WebApp;

export function initTelegram() {
  tg.expand();
  tg.ready();
  return tg.initDataUnsafe; // сюда включены user и другие поля
}
