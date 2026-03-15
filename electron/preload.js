const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isDesktop: true,
  sendNotification: (title, body) => ipcRenderer.send('notify', { title, body })
});
