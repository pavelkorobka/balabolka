// frontend/js/screens/repeat.js
import { AppState } from '../app.js';
import { getPhrasesToRepeat, sendReview } from '../api.js';
import { loadScreen } from './router.js';
import { setBackButton } from '../telegram.js';
import { t } from '../i18n.js';

let current = 0;
let phrases = [];

export async function showScreen() {
  const app = document.getElementById('app');
  app.innerHTML = `<p>${t('repeat.loading')}</p>`;

  setBackButton(() => loadScreen('home'));

  try {
    phrases = await getPhrasesToRepeat();
    current = 0;

    if (phrases.length === 0) {
      app.innerHTML = `<p>${t('repeat.empty')}</p>`;
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
    app.innerHTML = `<p>${t('repeat.done')}</p>`;
    setTimeout(() => {
      loadScreen('home');
    }, 3000); // автопереход через 3 секунды
    return;
  }

  // Локализованный перевод по языку
  const userLang = AppState.language || 'ru';
  const translation =
    userLang === 'ua' ? phrase.text_translation_ua : phrase.text_translation_ru;


  app.innerHTML = `
    <section class="screen repeat-screen">
      <p>${t('repeat.progress')} ${current + 1} / ${phrases.length}</p>

      <img src="assets/${phrase.image_url}" alt="image" class="repeat-image" />

      <button id="show-original">${t('repeat.show_original')}</button>
      <button id="show-translation">${t('repeat.show_translation')}</button>
      <p id="original" style="display:none;"></p>
      <p id="translation" style="display:none; font-weight: bold;"></p>

      <button id="play-audio">${t('repeat.listen')}</button>

      <div class="ratings">
        <button data-rating="forgot">${t('repeat.forgot')}</button>
        <button data-rating="hard">${t('repeat.hard')}</button>
        <button data-rating="medium">${t('repeat.medium')}</button>
        <button data-rating="easy">${t('repeat.easy')}</button>
      </div>

      <button id="back-btn">${t('repeat.back')}</button>
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

  document.querySelectorAll('.ratings button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const rating = btn.dataset.rating;
      try {
        console.log(phrase);
        //return;
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
