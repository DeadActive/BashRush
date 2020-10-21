import { create } from 'domain'
import { icon } from './config'
import { app, BrowserWindow, Tray, nativeImage } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path')
        .join(__dirname, '/static')
        .replace(/\\/g, '\\\\')
}

let mainWindow
const winURL =
    process.env.NODE_ENV === 'development'
        ? `http://localhost:9080`
        : `file://${__dirname}/index.html`

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 500,
        width: 300,
        frame: false,
        show: false,
        fullscreenable: false,
        resizable: false,
        transparent: true,
        webPreferences: {
            backgroundThrottling: false,
        },
    })

    mainWindow.loadURL(winURL)
    mainWindow.webContents.closeDevTools()

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    mainWindow.on('blur', () => {
        if (!mainWindow.webContents.isDevToolsOpened()) mainWindow.hide()
    })
}

let tray = null

const showWindow = () => {
    const position = getWindowPosition()
    mainWindow.setPosition(position.x, position.y, false)
    mainWindow.show()
    mainWindow.focus()
}

const toggleWindow = () => {
    if (mainWindow.isVisible()) mainWindow.hide()
    else showWindow()
}

const getWindowPosition = () => {
    const windowBounds = mainWindow.getBounds()
    const trayBounds = tray.getBounds()

    // Center window horizontally below the tray icon
    const x = Math.round(
        trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
    )

    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4)

    return { x: x, y: y }
}

const createTray = () => {
    tray = new Tray(nativeImage.createFromDataURL(icon))
    tray.setToolTip('BashRush')

    tray.on('click', toggleWindow)
    tray.on('double-click', toggleWindow)
    tray.on('right-click', event => {
        if (event.metaKey)
            mainWindow.webContents.openDevTools({ mode: 'detach' })
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

app.on('ready', () => {
    createTray()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
