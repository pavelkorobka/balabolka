import { AppState } from '../app.js';
import { getDialog, markPhraseAsLearned } from '../api.js';
import { loadScreen } from './router.js';
import { setBackButton } from '../telegram.js';
import { t } from '../i18n.js';

let phrases = [];
let current = 0;

export async function showScreen() {
  const app = document.getElementById('app');
  app.innerHTML = `<p>${t('dialog.loading')}</p>`;

  setBackButton(() => loadScreen('home'));

  try {
    const dialogId = AppState.dialogId;
    if (!dialogId) {
      app.innerHTML = `<p>dialogId не задан</p>`;
      return;
    }

    const data = await getDialog(dialogId);
    phrases = data.phrases;

    // Найти первую невыученную фразу
    current = phrases.findIndex(phrase => !phrase.is_learned);
    if (current === -1) current = 0;

    if (!phrases.length) {
      app.innerHTML = `<p>${t('dialog.empty')}</p>`;
      return;
    }

    renderCurrentPhrase(data.title);
  } catch (err) {
    app.innerHTML = `<p>Ошибка загрузки диалога</p>`;
    console.error(err);
  }
}

function renderCurrentPhrase(title) {
  const app = document.getElementById('app');
  const phrase = phrases[current];

  // Локализованный перевод по языку
  const userLang = AppState.language || 'ru';
  const translation =
    userLang === 'ua' ? phrase.text_translation_ua : phrase.text_translation_ru;

  // Подсчёт выученных фраз
  const learnedCount = phrases.filter(p => p.is_learned).length;

  app.innerHTML = `
    <section class="screen dialog-screen">
      <h2>${title}</h2>
      <p>${t('dialog.progress')} ${current + 1} / ${phrases.length} (${t('dialog.learned')}: ${learnedCount})</p>

      <img src="/assets/${phrase.image_url}" class="dialog-image${phrase.is_learned ? ' learned' : ''}" />

      <button id="play-audio">${t('dialog.listen')}</button>
      <button id="show-original">${t('dialog.show_original')}</button>
      <button id="show-translation">${t('dialog.show_translation')}</button>
      <p id="original" style="display:none;"></p>
      <p id="translation" style="display:none; font-weight: bold;"></p>

      <div class="dialog-controls">
        ${
          current < phrases.length - 1
            ? `<button id="next-btn">${t('dialog.next')}</button>`
            : `<button id="finish-btn">${t('dialog.finish')}</button>`
        }
        <button id="back-btn">${t('dialog.back')}</button>
      </div>
    </section>
  `;

  document.getElementById('play-audio').addEventListener('click', () => {
    const audio = new Audio(`/assets/${phrase.audio_url}`);
    audio.play();
  });

  document.getElementById('show-translation').addEventListener('click', () => {
    document.getElementById('translation').textContent = translation;
    document.getElementById('translation').style.display = 'block';
  });

  document.getElementById('show-original').addEventListener('click', () => {
    document.getElementById('original').textContent = phrase.text_original;
    document.getElementById('original').style.display = 'block';
  });

  document.getElementById('back-btn').addEventListener('click', () => {
    loadScreen('home');
  });

  if (current < phrases.length - 1) {
    document.getElementById('next-btn').addEventListener('click', async () => {
      if (!phrase.is_learned) {
        try {
          await markPhraseAsLearned(phrase.id);
          phrase.is_learned = true;
        } catch (err) {
          console.error('Failed to mark phrase as learned:', err);
        }
      }
      current++;
      renderCurrentPhrase(title);
    });
  } else {
    document.getElementById('finish-btn').addEventListener('click', () => {
      loadScreen('dialog_bonus');
    });
  }
}
