// src/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateBackground: (callback: () => void) =>
    ipcRenderer.on('update-background', callback)
});
