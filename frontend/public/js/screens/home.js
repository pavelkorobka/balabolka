import { AppState } from '../app.js';
import { getDialogs, getProgressSummary } from '../api.js';
import { loadScreen } from './router.js';
import { loadScreenTemplate } from '../utils/templates.js';

export async function showScreen() {
  const app = document.getElementById('app');
  await loadScreenTemplate('home', app);

  document.getElementById('profile-btn').onclick = () => loadScreen('profile');
  document.getElementById('repeat-btn').onclick = () => loadScreen('repeat');

  const stats = await getProgressSummary();
  document.getElementById('stat-learned').textContent = `Фраз выучено: ${stats.phrases_learned}`;
  document.getElementById('stat-words').textContent = `Слов знаете: ${stats.words_known}`;
  document.getElementById('stat-days').textContent = `Дней активности: ${stats.active_days}`;

  const dialogs = await getDialogs();
  const list = document.getElementById('dialog-list');
  dialogs.forEach(dialog => {
    const li = document.createElement('li');
    li.textContent = `${dialog.title} — ${dialog.progress?.passed || 0} из ${dialog.progress?.total || 0}`;
    li.onclick = () => {
      AppState.dialogId = dialog.id;
      loadScreen('dialog');
    };
    list.appendChild(li);
  });
}