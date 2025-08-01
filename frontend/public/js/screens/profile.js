// frontend/js/screens/profile.js

import { AppState } from '../app.js';
import { loadScreen } from './router.js';
import { getCurrentUser, updateUser } from '../api.js';
import { hideMainButton, setBackButton } from '../telegram.js';
import { t } from '../i18n.js';
import { loadScreenTemplate } from '../utils/templates.js';

export async function showScreen() {
  const app = document.getElementById('app');
  await loadScreenTemplate('profile', app);

  setBackButton(() => loadScreen('home'));

  try {
    const user = await getCurrentUser();
    AppState.user = user;

    const avatarUrl = '';
    //  window.Telegram.WebApp.initDataUnsafe?.user?.photo_url ||
    //  'https://via.placeholder.com/100?text=👤';

    document.getElementById('avatar').src = avatarUrl;
    document.getElementById('first-name').value = user.first_name || '';
    document.getElementById('language').value = user.language_code || 'ru';

    document.getElementById('save-btn').addEventListener('click', async () => {
      const first_name = document.getElementById('first-name').value.trim();
      const language_code = document.getElementById('language').value;

      try {
        await updateUser({
          first_name,
          last_name: AppState.user.last_name || '1',
          username: AppState.user.username || '1',
          language_code
        });

        AppState.user.first_name = first_name;
        AppState.language = language_code;
        alert(t('profile.saved'));
        loadScreen('home');
      } catch (err) {
        alert('Ошибка при сохранении');
        console.error(err);
      }
    });

    document.getElementById('back-btn').addEventListener('click', () => {
      loadScreen('home');
    });

  } catch (err) {
    app.innerHTML = `<p class="error">Ошибка загрузки профиля</p>`;
    console.error(err);
  }
}
