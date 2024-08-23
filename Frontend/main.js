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
        autoHideMenuBar: true,
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
        event.reply('register-response', {
            success: true,
            message: response.message,
            email: response.data.email,
            token: response.data.token,
            firstName: response.data.firstName
        });
    } catch (error) {
        event.reply('register-response', { success: false, message: error.response?.data.message || error.response?.data || 'Registration failed' });
    }
});

// ipcMain.on('login', async (event, credentials) => {
//     store.delete('authToken');
//     store.delete('userEmail');
//     try {
//         console.log(credentials)
//         const response = await axios.post(`${API_URL}/login`, {
//             email: credentials.email,
//             password: credentials.password
//         });
//         console.log(store.get('authToken'), store.get('userEmail'))
//         // if (store.get('authToken') || store.get('userEmail')) {
//         //     const token = response.data.token;
//         //     store.set('authToken', token);
//         //     store.set('userEmail', credentials.email);
//         //     event.reply('login-response', {
//         //         success: true,
//         //         message: response.message,
//         //         userId: response.data.userId,
//         //         isVerified: response.data.isVerified,
//         //         hasSubscription: response.data.hasSubscription
//         //     });
//         // }
//         const token = response.data.token;
//         store.set('authToken', token);
//         store.set('userEmail', credentials.email);
//         event.reply('login-response', {
//             success: true,
//             message: response.message,
//             userId: response.data.userId,
//             isVerified: response.data.isVerified,
//             hasSubscription: response.data.hasSubscription
//         });

//     } catch (error) {
//         console.log(error)
//         event.reply('login-response', { success: false, message: error.response?.data.message || error.response?.data || 'Login failed' });
//     }
// });

// ipcMain.on('login', async (event, credentials) => {
//     // Check if the keys exist before deleting

//     console.log('Old authToken:', store.get('authToken'));
//     console.log('Old userEmail:', store.get('userEmail'));

//     if (store.has('authToken')) {
//         store.delete('authToken');
//     }
//     if (store.has('userEmail')) {
//         store.delete('userEmail');
//     }

//     try {
//         console.log(credentials);
//         const response = await axios.post(`${API_URL}/login`, {
//             email: credentials.email,
//             password: credentials.password
//         });

//         const token = response.data.token;

//         // Set new values
//         store.set('authToken', token);
//         store.set('userEmail', credentials.email);

//         // Log the values to check if they're set correctly


//         event.reply('login-response', {
//             success: true,
//             message: response.data.message, // Make sure this is correct
//             userId: response.data.userId,
//             isVerified: response.data.isVerified,
//             hasSubscription: response.data.hasSubscription
//         });

//     } catch (error) {
//         console.log(error);
//         event.reply('login-response', {
//             success: false,
//             message: error.response?.data.message || error.response?.data || 'Login failed'
//         });
//     }
// });

ipcMain.on('login', async (event, credentials) => {
    console.log('Login attempt for:', credentials.email);

    try {
        // Clear existing data
        // store.clear();
        // console.log('Store cleared');

        const response = await axios.post(`${API_URL}/login`, {
            email: credentials.email,
            password: credentials.password
        });
        event.reply('login-response', {
            success: true,
            message: response.data.message,
            userId: response.data.userId,
            isVerified: response.data.isVerified,
            hasSubscription: response.data.hasSubscription,
            token: response.data.token,
            email: response.data.email,
            firstName: response.data.firstName
        });

        // const token = response.data.token;

        // Set new values with error checking
        // try {
        //     store.set('authToken', token);
        //     console.log('authToken set successfully');
        // } catch (storeError) {
        //     console.error('Error setting authToken:', storeError);
        // }

        // try {
        //     store.set('userEmail', credentials.email);
        //     console.log('userEmail set successfully');
        // } catch (storeError) {
        //     console.error('Error setting userEmail:', storeError);
        // }

        // Verify stored data
        // console.log('Stored authToken:', store.get('authToken'));
        // console.log('Stored userEmail:', store.get('userEmail'));


    } catch (error) {
        console.error('Login error:', error);
        event.reply('login-response', {
            success: false,
            message: error.response?.data.message || error.response?.data || 'Login failed'
        });
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
        // const token = store.get('authToken');
        // const userEmail = store.get('userEmail');
        console.log(data.token)
        const response = await axios.post(`${API_URL}/verify-code`,
            { code: data.code, email: data.email },
            {
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            }
        );


        event.reply('verify-code-response', {
            success: true,
            message: response.data.message,
            email: response.data.email,
            token: response.data.token
        });
    } catch (error) {
        event.reply('verify-code-response', { success: false, message: error.response?.data.message || error.response?.data || 'Verification failed' });
    }
});

ipcMain.on("resend-code", async (event, data) => {
    try {
        const response = await axios.post(`${API_URL}/resend-code`,
            { email: data.email },
            {
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            }
        )
        event.reply('resend-verify-code-response', {
            success: true,
            message: response.data.message,
            // email: response.data.email,
            // token: response.data.token
        });
    }
    catch (error) {
        event.reply('resend-verify-code-response', { success: false, message: error.response?.data.message || error.response?.data || 'Error resending verification' });
    }
});

ipcMain.on("activate-trial", async (event, data) => {
    try {
        const response = await axios.patch(`${API_URL}/activate-trial`,
            { email: data.email },
            {
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            }
        )
        event.reply('activate-trial', {
            success: true,
            message: response.data.message,
            // email: response.data.email,
            // token: response.data.token
        });
    }
    catch (error) {
        event.reply('activate-trial', { success: false, message: error.response?.data.message || error.response?.data || 'Error starting the free trial' });
    }
});

ipcMain.on("yearly-subscription", async (event, data) => {
    try {
        const response = await axios.post(`${API_URL}/payment-checkout`,
            {
                email: data.email,
                productName: data.productName,
                productPrice: data.productPrice
            },
            {
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            }
        )
        event.reply('yearly-subscription', {
            success: true,
            message: response.data.message,
            sessionId: response.data.id
            // email: response.data.email,
            // token: response.data.token
        });
    }
    catch (error) {
        event.reply('yearly-subscription', { success: false, message: error.response?.data.message || error.response?.data || 'Error in the payment checkout' });
    }
});

ipcMain.on("monthly-subscription", async (event, data) => {
    try {
        const response = await axios.post(`${API_URL}/payment-checkout`,
            {
                email: data.email,
                productName: data.productName,
                productPrice: data.productPrice
            },
            {
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            }
        )
        event.reply('monthly-subscription', {
            success: true,
            message: response.data.message,
            // email: response.data.email,
            // token: response.data.token
        });
    }
    catch (error) {
        event.reply('monthly-subscription', { success: false, message: error.response?.data.message || error.response?.data || 'Error in the payment checkout' });
    }
});