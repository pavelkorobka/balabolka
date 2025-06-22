// frontend/js/screens/repeat.js

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
    return;
  }

  app.innerHTML = `
    <section class="screen repeat-screen">
      <p>${t('repeat.progress')} ${current + 1} / ${phrases.length}</p>

      <img src="${phrase.image_url}" alt="image" class="repeat-image" />

      <h3>${phrase.text_translation}</h3>

      <button id="play-audio">${t('repeat.listen')}</button>

      <div class="ratings">
        <button data-rating="forgot">${t('repeat.forgot')}</button>
        <button data-rating="hard">${t('repeat.hard')}</button>
        <button data-rating="medium">${t('repeat.medium')}</button>
        <button data-rating="easy">${t('repeat.easy')}</button>
      </div>
    </section>
  `;

  document.getElementById('play-audio').addEventListener('click', () => {
    const audio = new Audio(phrase.audio_url);
    audio.play();
  });

  document.querySelectorAll('.ratings button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const rating = btn.dataset.rating;
      try {
        await sendReview(phrase.phrase_id, rating);
        current++;
        renderCurrentPhrase();
      } catch (err) {
        alert('Ошибка отправки ответа');
        console.error(err);
      }
    });
  });
}
