// frontend/js/screens/repeat.js
import { AppState } from '../app.js';
import { getPhrasesToRepeat, sendReview } from '../api.js';
import { loadScreen } from './router.js';
import { setBackButton } from '../telegram.js';
import { t } from '../i18n.js';
import { loadScreenTemplate } from '../utils/templates.js';

let current = 0;
let phrases = [];

export async function showScreen() {
  const app = document.getElementById('app');
  await loadScreenTemplate('repeat', app);

  setBackButton(() => loadScreen('home'));

  try {
    phrases = await getPhrasesToRepeat();
    current = 0;

    if (phrases.length === 0) {
      app.innerHTML = `<p class="empty">${t('repeat.empty')}</p>`;
      return;
    }

    renderCurrentPhrase();
  } catch (err) {
    app.innerHTML = `<p>Ошибка загрузки фраз</p>`;
    console.error(err);
  }
}

function renderCurrentPhrase() {
  const app = document.getElementById('app');
  const phrase = phrases[current];
  if (!phrase) {
    app.innerHTML = `<p class="done">${t('repeat.done')}</p>`;
    setTimeout(() => {
      loadScreen('home');
    }, 3000); // автопереход через 3 секунды
    return;
  }

  // Локализованный перевод по языку
  const userLang = AppState.language || 'ru';
  const translation =
    userLang === 'ua' ? phrase.text_translation_ua : phrase.text_translation_ru;

  document.getElementById('repeat-progress').textContent =
    `${t('repeat.progress')} ${current + 1} / ${phrases.length}`;

  const img = document.getElementById('repeat-image');
  img.src = `assets/${phrase.image_url}`;
  img.alt = 'image';

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

  document.querySelectorAll('.ratings button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const rating = btn.dataset.rating;
      try {
        console.log(phrase);
        await sendReview(phrase.id, rating);
        current++;
        renderCurrentPhrase();
      } catch (err) {
        alert('Ошибка отправки ответа');
        console.error(err);
      }
    });
  });
}
