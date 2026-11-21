function setWelcomeModal(open) {
  const display = open ? 'block' : 'none';
  document.querySelectorAll('.modal-bienvenida, .modal-backdrop').forEach(element => {
    element.style.display = display;
  });

  if (!open) {
    const player = document.querySelector('#playermodalbienvenida');
    const source = player?.getAttribute('src');
    if (source) player.setAttribute('src', source);
  }
}
