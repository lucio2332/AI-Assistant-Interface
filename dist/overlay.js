"use strict";
const electron_1 = require("electron");
electron_1.ipcRenderer.on('update-background', () => {
    document.body.style.opacity = '1'; // Fades in the body
    document.body.style.backdropFilter = 'blur(16px)'; // Apply the blur
});
function updateBackground() {
    const path = '../assets/desktop.png';
    document.body.style.backgroundImage = `url("${path}?v=${Date.now()}")`; // cache bust
}
window.electronAPI.onUpdateBackground(() => {
    updateBackground();
});
window.onload = updateBackground;
module.exports = {};
