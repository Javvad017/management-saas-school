// Preload script to expose safe APIs to renderer process
// This helps avoid blocking the main process

window.addEventListener('DOMContentLoaded', () => {
  console.log('Preload script loaded');
});
