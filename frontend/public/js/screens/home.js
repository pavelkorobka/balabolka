// frontend/js/screens/home.js
import { AppState } from '../app.js';
import { getDialogs, getPhrasesToRepeat, getProgressSummary } from '../api.js';
import { loadScreen } from './router.js';
import { t } from '../i18n.js';
import { setBackButton } from '../telegram.js';

export async function showScreen() {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="screen home-screen"><p>Загрузка...</p></div>`;

  setBackButton(() => {
    window.Telegram.WebApp.close(); // Выход из мини-приложения
  });

  try {
    const [progress, phrasesToday, dialogs] = await Promise.all([
      getProgressSummary(),
      getPhrasesToRepeat(),
      getDialogs(),
    ]);

    const phrasesCount = phrasesToday.length;
    const dialogList = dialogs.map(dialog => {
      const p = dialog.progress;
      return `
        <div class="dialog-card" onclick="window._openDialog(${dialog.id})">
          <h3>${dialog.title}</h3>
          <p>${t('home.progress')} ${p.passed} ${t('home.out_of')} ${p.total}</p>
        </div>
      `;
    }).join('');

    app.innerHTML = `
      <section class="screen home-screen">
        <div class="top-bar">
          <button id="profile-btn">👤 ${t('home.profile')}</button>
        </div>

        <div class="stats">
          <p>${t('home.stats_phrases')}: ${progress.phrases_learned}</p>
          <p>${t('home.stats_words')}: ${progress.words_known}</p>
          <p>${t('home.stats_days')}: ${progress.active_days}</p>
        </div>

        <div class="repeat-block">
          ${phrasesCount > 0
            ? `<button id="repeat-btn">${t('home.review')} (${phrasesCount})</button>`
            : `<p>${t('home.no_review')}</p>`}
        </div>

        <div class="dialogs-block">
          <h2>${t('home.dialogs')}</h2>
          ${dialogList || `<p>${t('home.no_dialogs')}</p>`}
        </div>

        <div class="purchase">
          <button id="purchase-btn">${t('home.purchase')}</button>
        </div>
      </section>
    `;

    document.getElementById('profile-btn').addEventListener('click', () => loadScreen('profile'));
    document.getElementById('purchase-btn').addEventListener('click', () => loadScreen('purchase'));
    if (phrasesCount > 0) {
      document.getElementById('repeat-btn').addEventListener('click', () => loadScreen('repeat'));
    }

    // доступ из HTML onclick — быстрая прокладка
    window._openDialog = (id) => {
      AppState.dialogId = id;
      loadScreen('dialog');
    };
  } catch (err) {
    app.innerHTML = `<p>Ошибка загрузки: ${err.message}</p>`;
    console.error(err);
  }
}
