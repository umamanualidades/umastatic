function setWelcomeModal() {}

(() => {
  const template = document.querySelector('.modal-bienvenida');
  const closeTemplate = template?.querySelector('.close');
  if (!closeTemplate) return;

  const catalan = document.documentElement.lang === 'ca';
  const label = catalan ? 'Vídeo de benvinguda' : 'Vídeo de bienvenida';
  const dialog = document.createElement('dialog');
  dialog.className = template.className;
  dialog.id = template.id || 'uma-welcome-dialog';
  dialog.setAttribute('aria-label', label);
  Object.assign(dialog.style, {
    width: '100%', height: '100%', maxWidth: 'none', maxHeight: 'none',
    margin: '0', padding: '0', border: '0', color: 'inherit', background: 'rgba(0, 0, 0, .5)',
  });
  dialog.append(...template.childNodes);
  template.replaceWith(dialog);

  const close = document.createElement('button');
  close.type = 'button';
  close.className = closeTemplate.className;
  close.style.cssText = closeTemplate.style.cssText;
  close.textContent = closeTemplate.textContent;
  close.setAttribute('aria-label', catalan ? 'Tanca el vídeo de benvinguda' : 'Cerrar vídeo de bienvenida');
  closeTemplate.replaceWith(close);

  const triggers = [...document.querySelectorAll('.ytplayfixed')];
  let opener;
  triggers.forEach(trigger => {
    trigger.setAttribute('role', 'button');
    trigger.tabIndex = 0;
    trigger.setAttribute('aria-label', label);
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', dialog.id);
    trigger.addEventListener('click', () => { opener = trigger; }, {capture: true});
    trigger.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      if (!event.repeat) trigger.click();
    });
  });

  const video = dialog.querySelector('.bienvenidavideo');
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (dialog.open) return;
    dialog.style.display = 'none';
    video?.querySelector('#playermodalbienvenida')?.remove();
    opener?.focus();
    opener = undefined;
  });

  window.setWelcomeModal = open => {
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    if (dialog.open) return;

    opener ||= triggers[0];
    dialog.showModal();
    dialog.style.display = 'block';
    close.focus();

    const id = video?.getAttribute('video');
    if (!/^[a-zA-Z0-9_-]{11}$/.test(id || '') || video.querySelector('#playermodalbienvenida')) return;
    const iframe = document.createElement('iframe');
    iframe.id = 'playermodalbienvenida';
    iframe.title = label;
    iframe.allowFullscreen = true;
    iframe.width = '640';
    iframe.height = '360';
    iframe.style.cssText = 'display:block;width:100%;height:auto;aspect-ratio:16/9;border:0';
    iframe.src = 'https://www.youtube.com/embed/' + id;
    video.append(iframe);
  };
})();
