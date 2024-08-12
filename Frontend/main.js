// const { app, BrowserWindow } = require('electron');
// const path = require('path');
import { app, BrowserWindow, ipcMain } from 'electron';
// const path = require('path');
// import path from "path";
// const Store = require('electron-store');
import Store from "electron-store"
import axios from 'axios';

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

// ipcMain.on('register', (event, userData) => {
//     const users = store.get('users') || [];
//     const existingUser = users.find(user => user.username === userData.username);

//     if (existingUser) {
//         event.reply('register-response', { success: false, message: 'Username already exists' });
//     } else {
//         users.push(userData);
//         store.set('users', users);
//         event.reply('register-response', { success: true, message: 'Registration successful' });
//     }
// });

// ipcMain.on('login', (event, credentials) => {
//     const users = store.get('users') || [];
//     const user = users.find(u => u.username === credentials.username && u.password === credentials.password);

//     if (user) {
//         event.reply('login-response', { success: true, message: 'Login successful' });
//     } else {
//         event.reply('login-response', { success: false, message: 'Invalid credentials' });
//     }
// });

const API_URL = 'http://localhost:3000/api'; // Replace with your backend URL

ipcMain.on('register', async (event, userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        const token = response.data.token;
        store.set('authToken', token);
        store.set('userEmail', userData.email);
        event.reply('register-response', { success: true, message: response.message, userId: response.data.userId });
    } catch (error) {
        event.reply('register-response', { success: false, message: error.response?.data || 'Registration failed' });
    }
});

ipcMain.on('login', async (event, credentials) => {
    try {
        console.log(credentials)
        const response = await axios.post(`${API_URL}/login`, {
            email: credentials.email,
            password: credentials.password
        });
        const token = response.data.token;
        store.set('authToken', token);
        store.set('userEmail', credentials.email);
        event.reply('login-response', {
            success: true,
            message: response.message,
            userId: response.data.userId,
            isVerified: response.data.isVerified,
            hasSubscription: response.data.hasSubscription
        });
    } catch (error) {
        console.log(error)
        event.reply('login-response', { success: false, message: error.response?.data.message || 'Login failed' });
    }
});

ipcMain.on('verify-code', async (event, data) => {
    try {
        // const response = await axios.post(`${API_URL}/verify-code`, data);
        // const token = store.get('authToken');
        // const response = await axios.post(`${API_URL}/verify-code`, data, {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // });
        const token = store.get('authToken');
        const userEmail = store.get('userEmail');
        const response = await axios.post(`${API_URL}/verify-code`,
            { code: data.code, email: userEmail },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        event.reply('verify-code-response', { success: true, message: response.message });
    } catch (error) {
        event.reply('verify-code-response', { success: false, message: error.response?.data || 'Verification failed' });
    }
});