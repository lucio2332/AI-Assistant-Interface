import { ipcRenderer } from 'electron';

ipcRenderer.on('update-background', () => {
  document.body.style.opacity = '1';  // Fades in the body
  document.body.style.backdropFilter = 'blur(16px)';  // Apply the blur
});

declare global {
  interface Window {
    electronAPI: {
      onUpdateBackground: (callback: () => void) => void;
    };
  }
}

function updateBackground() {
  const path = '../assets/desktop.png';
  document.body.style.backgroundImage = `url("${path}?v=${Date.now()}")`; // cache bust
}

window.electronAPI.onUpdateBackground(() => {
  updateBackground();
});

window.onload = updateBackground;

export = {};