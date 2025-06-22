// frontend/js/api.js

const IS_MOCK = !(
  window.Telegram &&
  window.Telegram.WebApp &&
  window.Telegram.WebApp.initDataUnsafe &&
  window.Telegram.WebApp.initDataUnsafe.user
);

console.log('[API] Режим:', IS_MOCK ? 'МОК' : 'PROD');

const API_BASE = '/api';
const initData = window.Telegram?.WebApp?.initData || 'mock_token';

// ------------------------
// MOCK DATA
// ------------------------
const mockUser = {
  id: 1,
  telegram_id: 123456789,
  username: 'mock_user',
  first_name: 'Mock',
  language_code: 'ru',
  has_access: true,
};

const mockDialogs = [
  {
    id: 1,
    title: 'В ресторане',
    is_free: true,
    is_unlocked: true,
    progress: { passed: 3, total: 25 },
  },
  {
    id: 2,
    title: 'В аэропорту',
    is_free: false,
    is_unlocked: false,
    progress: { passed: 0, total: 20 },
  },
];

// ------------------------
// HELPER FUNCTION
// ------------------------
async function request(method, endpoint, body = null) {
  /*if (IS_MOCK) {
    return mockHandler(method, endpoint, body);
  }*/

  const headers = {
    'Content-Type': 'application/json',
    'X-Telegram-Init-Data': initData,
  };

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${endpoint}`, options);
  console.log(options);
  console.log(`${API_BASE}${endpoint}`);

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API error: ${error}`);
  }

  return await res.json();
}

// ------------------------
// API METHODS
// ------------------------
export async function createUser(data) {
  return request('POST', '/user/create', data);
}
export async function getCurrentUser() {
  return request('GET', '/user/me');
}
export async function updateUser(data) {
  return request('PUT', '/user/update', data);
}

export async function getDialogs() {
  return request('GET', '/dialogs');
}
export async function getDialog(dialogId) {
  return request('GET', `/dialogs/${dialogId}`);
}
export async function getDialogBonus(dialogId) {
  return request('GET', `/dialogs/${dialogId}/bonus`);
}

export async function getPhrasesToRepeat() {
  return request('GET', '/phrases/today');
}
export async function sendReview(phraseId, rating) {
  return request('POST', '/phrases/review', {
    phrase_id: phraseId,
    rating,
  });
}

export async function getProgressSummary() {
  return request('GET', '/progress/summary');
}
export async function createPayment() {
  return request('POST', '/payments/create', { provider: 'telegram' });
}
export async function getPaymentStatus() {
  return request('GET', '/payments/status');
}

// ------------------------
// MOCK HANDLER
// ------------------------
async function mockHandler(method, endpoint, body) {
  console.log(`[MOCK] ${method} ${endpoint}`, body || '');

  switch (endpoint) {
    case '/user/create':
    case '/user/me':
      return mockUser;
    case '/dialogs':
      return mockDialogs;
    case '/phrases/today':
      return [
        {
          phrase_id: 1,
          text_original: 'How are you?',
          text_translation: 'Как дела?',
          image_url: 'dialogs/dialog_001/phrase_001.jpg',
          audio_url: 'dialogs/dialog_001/phrase_001.mp3',
        },
      ];
    case '/progress/summary':
      return { phrases_learned: 120, words_known: 350, active_days: 5 };
    case '/payments/status':
      return { status: 'success', unlocked: true };
    case '/payments/create':
      return { payment_url: 'https://t.me/your_bot?start=pay_123456' };
    default:
      return {};
  }
}
