// frontend/js/screens/purchase.js

import { createPayment } from '../api.js';
import { loadScreen } from './router.js';
import { setBackButton } from '../telegram.js';
import { t } from '../i18n.js';

export function showScreen() {
  const app = document.getElementById('app');

  setBackButton(() => loadScreen('home'));

  app.innerHTML = `
    <section class="screen purchase-screen">
      <h2>${t('purchase.title')}</h2>

      <ul class="purchase-benefits">
        <li>${t('purchase.benefit_1')}</li>
        <li>${t('purchase.benefit_2')}</li>
        <li>${t('purchase.benefit_3')}</li>
      </ul>

      <p class="purchase-price">${t('purchase.price')}</p>

      <button id="pay-btn" class="primary-button">${t('purchase.pay')}</button>
    </section>
  `;

  document.getElementById('pay-btn').addEventListener('click', async () => {
    const confirmed = confirm(t('purchase.confirm'));
    if (!confirmed) return;

    try {
      const result = await createPayment();
      if (result.payment_url) {
        window.location.href = result.payment_url;
      } else {
        alert(t('purchase.failed'));
      }
    } catch (err) {
      alert(t('purchase.failed'));
      console.error(err);
    }
  });
}
