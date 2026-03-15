const { app, BrowserWindow, shell, Notification } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Expert IA - Alerte Arnaques",
    icon: path.join(__dirname, 'icon.png'),
    autoHideMenuBar: true,
    backgroundColor: '#0a0a0a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // --- CONFIGURATION UNIVERSELLE (CLOUD) ---
  // Remplacez cette URL par celle de votre site une fois hebergé (ex: Vercel)
  const productionUrl = 'https://alerte-arnaques.vercel.app/admin/expert'; 
  const localUrl = 'http://localhost:3000/admin/expert';
  
  console.log("Démarrage du système Expert IA...");

  // Tentative de connexion au serveur Cloud
  win.loadURL(productionUrl).catch(() => {
    console.warn("Serveur Cloud injoignable, bascule sur mode local...");
    win.loadURL(localUrl).catch(() => {
        win.loadFile(path.join(__dirname, 'error.html'));
    });
  });

  // Re-tentative automatique si le serveur démarre après le logiciel
  win.webContents.on('did-fail-load', () => {
    setTimeout(() => {
      win.loadURL(productionUrl).catch(() => {
        win.loadURL(localUrl).catch(() => {});
      });
    }, 5000);
  });

  // Ouvrir les liens externes dans le navigateur par défaut
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

const isFirstInstance = app.requestSingleInstanceLock();

if (!isFirstInstance) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    // Exemple de notification au lancement
    new Notification({
      title: "Expert IA Connecté",
      body: "Le système de surveillance en temps réel est actif sur Windows 11.",
      icon: path.join(__dirname, 'icon.png')
    }).show();
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
