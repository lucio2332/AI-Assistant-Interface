"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/main.ts
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const screenshot_desktop_1 = __importDefault(require("screenshot-desktop"));
let tray;
let overlayWindow = null;
const assetsPath = path.join(__dirname, '../assets');
const screenshotPath = path.join(assetsPath, 'desktop.png');
async function createOverlayWindow() {
    if (overlayWindow)
        return;
    overlayWindow = new electron_1.BrowserWindow({
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
        const img = await (0, screenshot_desktop_1.default)({ format: 'png' });
        fs.writeFileSync(screenshotPath, img);
    }
    catch (err) {
        console.error('Screenshot failed:', err);
        return;
    }
    await createOverlayWindow();
}
electron_1.app.whenReady().then(() => {
    // Create Tray
    const trayIcon = electron_1.nativeImage.createFromPath(path.join(assetsPath, 'tray.png'));
    tray = new electron_1.Tray(trayIcon);
    tray.setToolTip('AI Overlay App');
    tray.on('click', () => {
        if (overlayWindow) {
            overlayWindow.close();
            overlayWindow = null;
        }
    });
    // Global shortcut to toggle
    electron_1.globalShortcut.register('Control+Shift+B', () => {
        if (overlayWindow) {
            overlayWindow.close();
            overlayWindow = null;
        }
        else {
            activateOverlay();
        }
    });
});
electron_1.app.on('will-quit', () => {
    electron_1.globalShortcut.unregisterAll();
});
