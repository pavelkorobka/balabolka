// frontend/js/screens/dialog_bonus.js

import { AppState } from '../app.js';
import { getDialogBonus } from '../api.js';
import { loadScreen } from './router.js';
import { setBackButton } from '../telegram.js';
import { t } from '../i18n.js';

export async function showScreen() {
  const app = document.getElementById('app');
  app.innerHTML = `<p>${t('bonus.loading')}</p>`;

  setBackButton(() => loadScreen('home'));

  try {
    const dialogId = AppState.dialogId;
    if (!dialogId) {
      app.innerHTML = `<p>dialogId не задан</p>`;
      return;
    }

    const bonus = await getDialogBonus(dialogId);

    app.innerHTML = `
      <section class="screen dialog-bonus-screen">
        <h2>${t('bonus.title')}</h2>
        <p>${t('bonus.subtitle')}</p>

        <video controls width="100%" poster="">
          <source src="/assets/${bonus.video_url}" type="video/mp4" />
          ${t('bonus.no_support')}
        </video>

        <button id="back-btn">${t('bonus.back')}</button>
      </section>
    `;

    document.getElementById('back-btn').addEventListener('click', () => {
      loadScreen('home');
    });

  } catch (err) {
    app.innerHTML = `<p>${t('bonus.error')}</p>`;
    console.error(err);
  }
}
