import { tg } from '../telegram.js';

export function showHomeScreen(container) {
  tg.MainButton.hide();

  const title = document.createElement('h1');
  title.textContent = 'Главная';

  container.appendChild(title);
}
