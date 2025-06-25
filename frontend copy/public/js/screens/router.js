// frontend/js/screens/router.js

const screens = {
  welcome: () => import('./welcome.js'),
  home: () => import('./home.js'),
  profile: () => import('./profile.js'),
  repeat: () => import('./repeat.js'),
  dialog: () => import('./dialog.js'),
  dialog_bonus: () => import('./dialog_bonus.js'),
  purchase: () => import('./purchase.js'),
};

export async function loadScreen(name) {
  if (!screens[name]) {
    console.warn(`Экран "${name}" не найден.`);
    return;
  }

  const module = await screens[name]();
  if (typeof module.showScreen === 'function') {
    console.log(`screen ${name}`);
    module.showScreen();
  } else {
    console.error(`showScreen() не определён для экрана "${name}"`);
  }
}
