// const { app, BrowserWindow } = require('electron');
// const path = require('path');
import { app, BrowserWindow, ipcMain } from 'electron';
// const path = require('path');
import path from "path";
// const Store = require('electron-store');
import Store from "electron-store"

const store = new Store();

// function createWindow() {
//     const mainWindow = new BrowserWindow({
//         width: 800,
//         height: 600,
//         webPreferences: {
//             preload: path.join(__dirname, 'preload.js'), // Optional if you need preload scripts
//             nodeIntegration: true,
//             contextIsolation: false,
//         },
//     });

//     mainWindow.loadURL(`file://${path.join(__dirname, '../renderer/app.jsx')}`);
// }

// app.whenReady().then(() => {
//     createWindow();

//     app.on('activate', () => {
//         if (BrowserWindow.getAllWindows().length === 0) {
//             createWindow();
//         }
//     });
// });

// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
// });


let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('login.html');
}

app.whenReady().then(createWindow);

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

ipcMain.on('register', (event, userData) => {
    const users = store.get('users') || [];
    const existingUser = users.find(user => user.username === userData.username);

    if (existingUser) {
        event.reply('register-response', { success: false, message: 'Username already exists' });
    } else {
        users.push(userData);
        store.set('users', users);
        event.reply('register-response', { success: true, message: 'Registration successful' });
    }
});

ipcMain.on('login', (event, credentials) => {
    const users = store.get('users') || [];
    const user = users.find(u => u.username === credentials.username && u.password === credentials.password);

    if (user) {
        event.reply('login-response', { success: true, message: 'Login successful' });
    } else {
        event.reply('login-response', { success: false, message: 'Invalid credentials' });
    }
});