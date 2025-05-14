// src/main.ts
import { app, BrowserWindow, globalShortcut, Tray, nativeImage } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import screenshot from 'screenshot-desktop';

let tray: Tray;
let overlayWindow: BrowserWindow | null = null;

const assetsPath = path.join(__dirname, '../assets');
const screenshotPath = path.join(assetsPath, 'desktop.png');

async function createOverlayWindow() {
  if (overlayWindow) return;

  overlayWindow = new BrowserWindow({
    fullscreen: true,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  overlayWindow.loadFile(path.join(__dirname, 'overlay.html'));

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });

  // Wait for renderer to load before showing
  overlayWindow.once('ready-to-show', () => {
    overlayWindow?.show();
    overlayWindow?.webContents.send('update-background');
  });
}

async function activateOverlay() {
  // Take screenshot and save to assets
  try {
    const img = await screenshot({ format: 'png' });
    fs.writeFileSync(screenshotPath, img);
  } catch (err) {
    console.error('Screenshot failed:', err);
    return;
  }

  await createOverlayWindow();
}

app.whenReady().then(() => {
  // Create Tray
  const trayIcon = nativeImage.createFromPath(path.join(assetsPath, 'tray.png'));
  tray = new Tray(trayIcon);
  tray.setToolTip('AI Overlay App');
  tray.on('click', () => {
    if (overlayWindow) {
      overlayWindow.close();
      overlayWindow = null;
    }
  });

  // Global shortcut to toggle
  globalShortcut.register('Control+Shift+B', () => {
    if (overlayWindow) {
      overlayWindow.close();
      overlayWindow = null;
    } else {
      activateOverlay();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
