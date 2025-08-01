import { AppState } from '../app.js';
import { getDialog, markPhraseAsLearned } from '../api.js';
import { loadScreen } from './router.js';
import { setBackButton } from '../telegram.js';
import { t } from '../i18n.js';
import { loadScreenTemplate } from '../utils/templates.js';

let phrases = [];
let current = 0;

export async function showScreen() {
  const app = document.getElementById('app');
  await loadScreenTemplate('dialog', app);

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
    app.innerHTML = `<p class="error">Ошибка загрузки диалога</p>`;
    console.error(err);
  }
}

function renderCurrentPhrase(title) {
  const app = document.getElementById('app');
  const phrase = phrases[current];

  const userLang = AppState.language || 'ru';
  const translation =
    userLang === 'ua' ? phrase.text_translation_ua : phrase.text_translation_ru;

  const learnedCount = phrases.filter(p => p.is_learned).length;

  document.getElementById('dialog-title').textContent = title;
  document.getElementById('dialog-progress').textContent = `${t('dialog.progress')} ${current + 1} / ${phrases.length} (${t('dialog.learned')}: ${learnedCount})`;

  const imageEl = document.getElementById('dialog-image');
  imageEl.src = `/assets/${phrase.image_url}`;
  imageEl.className = 'dialog-image' + (phrase.is_learned ? ' learned' : '');

  const originalEl = document.getElementById('original');
  const translationEl = document.getElementById('translation');
  originalEl.style.display = 'none';
  translationEl.style.display = 'none';
  originalEl.textContent = '';
  translationEl.textContent = '';

  document.getElementById('play-audio').addEventListener('click', () => {
    const audio = new Audio(`/assets/${phrase.audio_url}`);
    audio.play();
  });

  document.getElementById('show-translation').addEventListener('click', () => {
    translationEl.textContent = translation;
    translationEl.style.display = 'block';
  });

  document.getElementById('show-original').addEventListener('click', () => {
    originalEl.textContent = phrase.text_original;
    originalEl.style.display = 'block';
  });

  document.getElementById('back-btn').addEventListener('click', () => {
    loadScreen('home');
  });

  const nextBtn = document.getElementById('next-btn');
  const finishBtn = document.getElementById('finish-btn');
  nextBtn.style.display = 'none';
  finishBtn.style.display = 'none';

  if (current < phrases.length - 1) {
    nextBtn.style.display = 'inline-block';
    nextBtn.onclick = async () => {
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
    };
  } else {
    finishBtn.style.display = 'inline-block';
    finishBtn.onclick = () => {
      loadScreen('dialog_bonus');
    };
  }
}
