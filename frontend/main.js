const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  // Crear la ventana del navegador.
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Mamays Desktop",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Cargar la app
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, 'build/index.html')}`
  );

  // Abrir herramientas de desarrollo si está en modo dev
  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

// Salir cuando todas las ventanas estén cerradas, excepto en macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
