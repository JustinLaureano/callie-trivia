/* =====================================================================
   Kids Jeopardy! — Electron main process
   Loads the existing static index.html in a desktop window.
   ===================================================================== */

const { app, BrowserWindow, Menu, shell } = require("electron");
const path = require("path");

// One window only; focus it if a second launch is attempted.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: "#040640", // jeopardy-dark, avoids white flash on load
    autoHideMenuBar: true, // hide the menu bar; Alt reveals it
    icon: path.join(__dirname, "..", "build", "icon.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "..", "index.html"));

  // Open external links (if any) in the user's real browser, not the app.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Minimal menu: keep a Quit + fullscreen toggle, drop the dev clutter.
  const template = [
    {
      label: "Game",
      submenu: [
        {
          label: "Toggle Full Screen",
          accelerator: "F11",
          click: () => {
            if (mainWindow) mainWindow.setFullScreen(!mainWindow.isFullScreen());
          },
        },
        { type: "separator" },
        { role: "quit" },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on("window-all-closed", () => {
  // On Windows/Linux, quitting when the last window closes is expected.
  if (process.platform !== "darwin") app.quit();
});
