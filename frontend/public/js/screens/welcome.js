import { tg } from '../telegram.js';

export function showWelcomeScreen(container) {
  const title = document.createElement('h1');
  title.textContent = 'Добро пожаловать в Balabolka';

  const description = document.createElement('p');
  description.textContent = 'Изучай английский с помощью живых диалогов и повторений.';

  tg.MainButton.setText('Начать');
  tg.MainButton.show();
  tg.MainButton.onClick(() => {
    window.showScreen('home');
  });

  container.appendChild(title);
  container.appendChild(description);
}
