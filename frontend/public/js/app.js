import { initTelegram } from './telegram.js';
import { showWelcomeScreen } from './screens/welcome.js';
import { showHomeScreen } from './screens/home.js';

const screens = {
  welcome: showWelcomeScreen,
  home: showHomeScreen,
};

let currentScreen = 'welcome';

function showScreen(screenName) {
  currentScreen = screenName;
  const app = document.getElementById('app');
  app.innerHTML = '';
  screens[screenName](app);
}

window.showScreen = showScreen; // для доступа из других файлов

const userData = initTelegram();
console.log('TG user:', userData);

showScreen(currentScreen);
