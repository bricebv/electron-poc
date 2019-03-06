/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
const moment = require('moment')
const Caspar = require('caspar-cg')

let ccg = new Caspar("127.0.0.1", 5250)
let timeInterval

ccg.connect(() => {
    console.log('[CasparCG] Connected')
    ccg.sendCommand('CG 1 ADD 1 main/MAIN 1')
    timeInterval = setInterval(timeCheck, 1000)
})

function timeCheck(){
    ccg.sendCommand("CG 1 INVOKE 1 \"leftTab('on', '" + moment().format('hh:mm') + "')\"")
}

// import MenuBuilder from './menu';

ipcMain.on('strap', (event, arg) => {
  if(arg) {
    ccg.sendCommand("CG 1 INVOKE 1 \"leftTab('on', '" + moment().format('hh:mm') + "')\"")
    timeInterval = setInterval(timeCheck, 1000)
  } else {
    clearInterval(timeInterval)
    ccg.sendCommand("CG 1 INVOKE 1 \"leftTab('off')\"")
  }
})

ipcMain.on('ticker', (event, arg) => {
  if(arg) ccg.sendCommand("CG 1 INVOKE 1 \"leftTab('on', '" + moment().format('hh:mm') + "', 'Ticker text')\"")
  else ccg.sendCommand("CG 1 INVOKE 1 \"leftTab('tickerOff')\"")
})

ipcMain.on('breakingNews', (event, arg) => {
  ccg.sendCommand("CG 1 INVOKE 1 \"leftTab('bnews', "+arg+")\"")
})

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 220,
    resizable: false
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    clearInterval(timeInterval);
    ccg.sendCommand("CG 1 INVOKE 1 \"leftTab('off')\"")
    mainWindow = null;
  });

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
});
