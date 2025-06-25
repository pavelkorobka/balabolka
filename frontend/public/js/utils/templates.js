export async function loadScreenTemplate(name, containerEl) {
  const res = await fetch(`/templates/${name}.html`);
  if (!res.ok) throw new Error(`Не удалось загрузить шаблон ${name}`);
  const html = await res.text();
  containerEl.innerHTML = html;
}