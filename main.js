const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, "src", "vista", "index.html"));
}

app.whenReady().then(createWindow);

ipcMain.on("window:minimize", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.minimize();
});

ipcMain.on("window:maximize", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.isMaximized() ? win.unmaximize() : win.maximize();
});

ipcMain.on("window:close", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.close();
});
