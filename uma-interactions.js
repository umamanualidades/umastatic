function responsivemenu() {
  const menu = document.getElementById('myTopnav');
  const toggle = document.getElementById('myTopbutton');
  if (!menu || !toggle) return;
  const expanded = menu.classList.toggle('responsive');
  toggle.classList.toggle('menu_is_opened', expanded);
  toggle.setAttribute('aria-expanded', String(expanded));
}

function addelvideo(video) {
  const player = document.getElementById('YTplayer');
  if (!player || !/^[a-zA-Z0-9_-]{11}$/.test(video)) return;
  const iframe = document.createElement('iframe');
  iframe.id = 'player';
  iframe.title = document.documentElement.lang === 'ca' ? 'Vídeo de la manualitat' : 'Vídeo de la manualidad';
  iframe.width = '640';
  iframe.height = '390';
  iframe.allowFullscreen = true;
  iframe.src = 'https://www.youtube.com/embed/' + video + '?enablejsapi=1';
  player.replaceChildren(iframe);
}

function prepareTableOfContents() {
  const container = document.getElementById('toc_container');
  const list = container?.querySelector('.toc_list');
  const title = container?.querySelector('.toc_title');
  if (!list || !title) return;

  if (!list.querySelector('a[href]')) {
    const article = container.closest('.entry-content, article');
    if (!article) return;
    const items = document.createDocumentFragment();
    const usedIds = new Set();
    for (const heading of article.querySelectorAll('h2')) {
      const target = heading.id ? heading : heading.querySelector('[id]');
      const label = heading.textContent.trim();
      if (!label || !target?.id || usedIds.has(target.id)) continue;
      usedIds.add(target.id);
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#' + encodeURIComponent(target.id);
      link.textContent = label;
      item.append(link);
      items.append(item);
    }
    if (!items.hasChildNodes()) {
      container.hidden = true;
      return;
    }
    list.replaceChildren(items);
  }

  const isCatalan = document.documentElement.lang === 'ca';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'toc_toggle';
  list.id ||= 'uma-table-of-contents';
  toggle.setAttribute('aria-controls', list.id);
  function setExpanded(expanded) {
    list.hidden = !expanded;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.textContent = expanded ? (isCatalan ? 'Amaga' : 'Ocultar') : (isCatalan ? 'Mostra' : 'Mostrar');
  }
  setExpanded(false);
  title.append(' ', toggle);
  toggle.addEventListener('click', () => setExpanded(list.hidden));
}

const menuToggle = document.getElementById('myTopbutton');
if (menuToggle) {
  menuToggle.setAttribute('role', 'button');
  menuToggle.setAttribute('aria-controls', 'myTopnav');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.tabIndex = 0;
  menuToggle.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    menuToggle.click();
  });
}

const comment = document.getElementById('comment');
comment?.addEventListener('click', () => {
  document.querySelectorAll('.comment-form-author, .comment-form-email, .comment-form-url, .comment-form-cookies-consent')
    .forEach(field => { field.style.display = 'block'; });
});

prepareTableOfContents();
