import { AppState } from '../app.js';
import { hideBackButton } from '../telegram.js';
import { getCurrentUser, createUser } from '../api.js';
import { loadScreen } from './router.js';
import { loadScreenTemplate } from '../utils/templates.js';

export async function showScreen() {
  const app = document.getElementById('app');
  await loadScreenTemplate('welcome', app); // шаблон вставляется в DOM

  hideBackButton();

  document.getElementById('start-btn').addEventListener('click', async () => {
    try {
      let user;
      try {
        user = await getCurrentUser();
      } catch {
        /*const tgUser = window.Telegram.WebApp.initDataUnsafe?.user || {
          id: 123456789,
          username: 'mock_user',
          first_name: 'Mock',
          language_code: 'ru',
        };
        user = await createUser({
          telegram_id: tgUser.id,
          username: tgUser.username,
          first_name: tgUser.first_name,
          language_code: tgUser.language_code?.startsWith('uk') ? 'ua' : 'ru',
        });*/
      }

      AppState.user = user;
      AppState.language = user.language_code;

      loadScreen('home');
    } catch (err) {
      alert('Ошибка при входе. Попробуйте позже.');
      console.error(err);
    }
  });
}