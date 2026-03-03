import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { net } from 'electron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Performance optimizations - apply before app is ready
app.commandLine.appendSwitch('disable-http-cache', 'false');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder');

let mainWindow;
let splashWindow;

// Create splash screen that shows immediately
function createSplashScreen() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    center: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Simple HTML splash screen
  const splashHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .splash-content {
            text-align: center;
            color: white;
          }
          .logo {
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .spinner {
            width: 50px;
            height: 50px;
            margin: 20px auto;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .loading-text {
            font-size: 14px;
            opacity: 0.9;
          }
        </style>
      </head>
      <body>
        <div class="splash-content">
          <div class="logo">🎓</div>
          <h1>School Management</h1>
          <div class="spinner"></div>
          <div class="loading-text">Loading...</div>
        </div>
      </body>
    </html>
  `;

  splashWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(splashHTML)}`);
}

// Check if Vite dev server is ready (non-blocking)
function checkViteServer(url) {
  return new Promise((resolve) => {
    const request = net.request(url);
    
    request.on('response', (response) => {
      resolve(response.statusCode === 200);
    });
    
    request.on('error', () => {
      resolve(false);
    });
    
    request.end();
  });
}

// Wait for Vite dev server (only in development)
async function waitForVite(url, maxRetries = 20) {
  for (let i = 0; i < maxRetries; i++) {
    const isReady = await checkViteServer(url);
    if (isReady) {
      console.log('✓ Vite dev server is ready!');
      return true;
    }
    console.log(`⏳ Waiting for Vite... (${i + 1}/${maxRetries})`);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  console.error('✗ Vite dev server timeout');
  return false;
}

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Don't show until ready
    backgroundColor: '#f3f4f6',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      devTools: process.env.NODE_ENV === 'development',
      backgroundThrottling: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Show main window and close splash when ready
  mainWindow.once('ready-to-show', () => {
    console.log('✓ Main window ready');
    
    // Close splash screen
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close();
      splashWindow = null;
    }
    
    // Show main window
    mainWindow.show();
    mainWindow.focus();
  });

  // Handle page load completion
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('✓ Page loaded');
  });

  // Handle load failures
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('✗ Load failed:', errorCode, errorDescription);
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    const viteUrl = 'http://localhost:5173';
    console.log('🚀 Development mode');
    
    const isReady = await waitForVite(viteUrl);
    
    if (isReady) {
      await mainWindow.loadURL(viteUrl);
      mainWindow.webContents.openDevTools();
    } else {
      console.error('✗ Failed to connect to Vite');
    }
  } else {
    // Production mode
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('📦 Production mode');
    await mainWindow.loadFile(indexPath);
  }
}

// App ready event
app.whenReady().then(async () => {
  console.log('⚡ Electron ready');
  
  // Show splash immediately
  createSplashScreen();
  
  // Create main window (will show when ready)
  await createMainWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Reactivate on macOS
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createSplashScreen();
    createMainWindow();
  }
});

// Cleanup on quit
app.on('before-quit', () => {
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.close();
  }
});
