function setWelcomeModal(open) {
  const display = open ? 'block' : 'none';
  document.querySelectorAll('.modal-bienvenida, .modal-backdrop').forEach(element => {
    element.style.display = display;
  });

  const video = document.querySelector('.modal-bienvenida .bienvenidavideo');
  if (!video) return;

  const player = video.querySelector('#playermodalbienvenida');
  if (!open) {
    player?.remove();
    return;
  }

  const id = video.getAttribute('video');
  if (player || !/^[a-zA-Z0-9_-]{11}$/.test(id || '')) return;

  const iframe = document.createElement('iframe');
  iframe.id = 'playermodalbienvenida';
  iframe.title = document.documentElement.lang === 'ca' ? 'Vídeo de benvinguda' : 'Vídeo de bienvenida';
  iframe.allowFullscreen = true;
  iframe.width = '640';
  iframe.height = '360';
  iframe.style.cssText = 'display:block;width:100%;height:auto;aspect-ratio:16/9;border:0';
  iframe.src = 'https://www.youtube.com/embed/' + id;
  video.append(iframe);
}
