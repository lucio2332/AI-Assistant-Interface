"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/preload.ts
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateBackground: (callback) => electron_1.ipcRenderer.on('update-background', callback)
});
