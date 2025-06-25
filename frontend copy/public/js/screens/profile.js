// frontend/js/screens/profile.js

import { AppState } from '../app.js';
import { loadScreen } from './router.js';
import { getCurrentUser, updateUser } from '../api.js';
import { hideMainButton, setBackButton } from '../telegram.js';
import { t } from '../i18n.js';

export async function showScreen() {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="screen profile-screen"><p>Загрузка...</p></div>`;

  setBackButton(() => loadScreen('home'));

  try {
    const user = await getCurrentUser();
    AppState.user = user;

    const avatarUrl = 'tets';
    // isMok
    //  window.Telegram.WebApp.initDataUnsafe?.user?.photo_url ||
    //  'https://via.placeholder.com/100?text=👤';

    app.innerHTML = `
      <section class="screen profile-screen">
        <img src="${avatarUrl}" alt="avatar" class="avatar"/>

        <label>${t('profile.first_name')}</label>
        <input id="first-name" type="text" value="${user.first_name || ''}" />

        <label>${t('profile.language')}</label>
        <select id="language">
          <option value="ru" ${user.language_code === 'ru' ? 'selected' : ''}>Русский</option>
          <option value="ua" ${user.language_code === 'ua' ? 'selected' : ''}>Українська</option>
        </select>

        <div class="actions">
          <button id="save-btn" class="primary-button">${t('profile.save')}</button>
          <button id="back-btn">${t('profile.back')}</button>
        </div>
      </section>
    `;

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
    app.innerHTML = `<p>Ошибка загрузки профиля</p>`;
    console.error(err);
  }
}
