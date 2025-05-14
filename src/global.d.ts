// global.d.ts (or any name ending in .d.ts)
export {};

declare global {
  interface Window {
    electronAPI: {
      onUpdateBackground: (callback: () => void) => void;
    };
  }
}
