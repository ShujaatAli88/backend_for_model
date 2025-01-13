import { app, BrowserWindow, ipcMain, dialog } from 'electron';

// import dotenv from 'dotenv'
// import 'dotenv/config'

import axios from 'axios';
import { writeFile, createReadStream, unlinkSync, existsSync } from 'node:fs';
import { writeFile as writeFilePromise } from 'node:fs/promises';
import FormData from 'form-data';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// dotenv.config()


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

// app.whenReady().then(createWindow);

app.whenReady().then(() => {
    createWindow();

    // Set the app as the default protocol client for "your-electron-app"
    // app.setAsDefaultProtocolClient('myapp');
    // Register custom protocol
    if (process.defaultApp) {
        // For development, use this for debugging when running with 'electron' binary
        if (process.argv.length >= 2) {
            app.setAsDefaultProtocolClient('myapp', process.execPath, [path.resolve(process.argv[1])]);
        }
    } else {
        // For packaged Electron apps
        app.setAsDefaultProtocolClient('myapp');
    }
});

// app.on('open-url', (event, url) => {
//     event.preventDefault();

//     const urlParams = new URL(url);
//     const email = urlParams.searchParams.get('email');
//     const priceId = urlParams.searchParams.get('priceId');

//     console.log('Payment successful:', { email, priceId });

//     // Send data to the renderer process if the main window is available
//     if (mainWindow && mainWindow.webContents) {
//         mainWindow.webContents.send('payment-success', { email, priceId });
//     } else {
//         console.error('Main window not available to send payment success data.');
//     }
// });

app.on("open-url", (event, url) => {
    event.preventDefault();
    const params = new URL(url);
    console.log('URL opened:', params);
    if (params.protocol === "myapp:") {
        if (params.hostname === "success") {
            // Handle success (e.g., show confirmation page)
            // window.location = response.sessionUrl;
            window.location = 'dashboard.html'
        } else if (params.hostname === "cancel") {
            // Handle cancellation (e.g., show retry message)
            window.location = 'subError.html'
        }
    }
});

// const handleDeepLink = (url) => {
//     if (mainWindow) {
//         const queryParams = new URL(url).searchParams;
//         const status = queryParams.get('status'); // Read status (success or failure) from URL

//         // Send message to the renderer process to update the UI
//         mainWindow.webContents.send('payment-status', status);
//     }
// };

// // Ensure only one instance of the app runs
// const isFirstInstance = app.requestSingleInstanceLock();
// if (!isFirstInstance) {
//     app.quit();
// } else {
//     app.on('second-instance', (event, commandLine) => {
//         if (mainWindow) {
//             mainWindow.focus();
//         }

//         const deepLink = commandLine.find((arg) => arg.startsWith('myapp://'));
//         if (deepLink) {
//             handleDeepLink(deepLink);
//         }
//     });
// }

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


// const API_URL = 'http://127.0.0.1:3000/api' || process.env.API_URL_BACKEND_API; // Replace with your backend URL
// const API_URL = 'http://ec2-3-94-9-72.compute-1.amazonaws.com:3000/api'; // Replace with your backend URL
const API_URL = 'https://backend-for-model-w5hd.onrender.com/api'; // Replace with your backend URL
// const API_URL = process.env.API_URL_BACKEND_API; // Replace with your backend URL

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
        const response = await axios.post(`${API_URL}/login`, {
            email: credentials.email,
            password: credentials.password
        });
        event.reply('login-response', {
            success: true,
            message: response.data.message,
            userId: response.data.userId,
            isVerified: response.data.isVerified,
            trial: response.data.trial,
            token: response.data.token,
            email: response.data.email,
            firstName: response.data.firstName,
            subStatus: response.data.subStatus
        });

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

// ipcMain.on('create-subscription', async (event, data) => {
//     try {
//         // Make an API call to your backend server
//         const response = await axios.post(`${API_URL}/payment-checkout`, {
//             // paymentMethodId: data.paymentMethodId,
//             // email: data.email,
//             // name: data.name,
//             priceId: data.priceId,
//             // token: data.token // Assuming you need to pass the auth token
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${data.token}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (response.data.success) {
//             event.reply('subscription-result', {
//                 success: true,
//                 clientSecret: response.data.session // If your API returns this
//             });
//         } else {
//             throw new Error(response.data.message || 'Subscription creation failed');
//         }
//     }
//     catch (error) {
//         event.reply('subscription-result', { success: false, message: error.response?.data.message || error.response?.data || 'Error in the payment checkout' });
//     }
// });



ipcMain.on('create-checkout-session', async (event, data) => {
    // console.log('Stripe Key:', process.env.STRIPE_SECRET_KEY);
    try {
        const response = await axios.post(`${API_URL}/payment-checkout`,
            {
                email: data.email,
                priceId: data.priceId
            },
            {
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            }
        )

        event.reply('checkout-session-created', {
            success: true,
            sessionUrl: response.data.session.url
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        event.reply('checkout-session-created', {
            success: false,
            message: 'Failed to create checkout session'
        });
    }
});

ipcMain.on("monthly-subscription", async (event, data) => {
    try {
        const response = await axios.post(`${API_URL}/payment-checkout`,
            {
                email: data.email,
                priceId: data.priceId,
                // success_url: "myapp://success", // Custom scheme
                // cancel_url: "myapp://cancel",
            },
            {
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            }
        )
        event.reply('monthly-subscription-result', {
            success: true,
            sessionUrl: response.data.session.url
            // email: response.data.email,
            // token: response.data.token
        });
    }
    catch (error) {
        event.reply('monthly-subscription-result', { success: false, message: error.response?.data.message || error.response?.data || 'Error in the payment checkout' });
    }
});

ipcMain.on("yearly-subscription", async (event, data) => {
    try {
        console.log("Date", data.email, data.token)
        const response = await axios.post(`${API_URL}/payment-checkout`,
            {
                email: data.email,
                priceId: data.priceId,
                // success_url: "myapp://success", // Custom scheme
                // cancel_url: "myapp://cancel",
            },
            {
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            }
        )
        event.reply('yearly-subscription-result', {
            success: true,
            sessionUrl: response.data.session.url
            // email: response.data.email,
            // token: response.data.token
        });
    }
    catch (error) {
        // console.log("error", error.response?.data.message)
        event.reply('yearly-subscription-result', { success: false, message: error.response?.data.message || error.response?.data || 'Error in the payment checkout' });
    }
});

// ipcMain.on('remove-background', async (event, data) => {
//     try {
//         console.log('Starting background removal process...');

//         // Create FormData
//         const formData = new FormData();

//         // Convert base64 to buffer and append directly to FormData
//         const imageBuffer = Buffer.from(data.imageBuffer, 'base64');
//         formData.append('files', imageBuffer, {
//             filename: data.fileName,
//             contentType: 'image/png'
//         });

//         console.log('Sending request...');
//         const response = await axios.post(
//             'http://localhost:3000/imageModel/remove-background',
//             formData,
//             {
//                 headers: {
//                     'Authorization': `Bearer ${data.token}`,
//                     ...formData.getHeaders()
//                 },
//                 maxContentLength: Infinity,
//                 maxBodyLength: Infinity
//             }
//         );
//         console.log('Request completed');

//         // Send the entire result array
//         event.reply("remove-background-result", {
//             success: true,
//             images: response.data.result,  // This should be an array of {filename, base64} objects
//             message: response.data.message,
//         });
//     }
//     catch (error) {
//         console.error('Final error catch:', error);
//         event.reply('remove-background-result', {
//             success: false,
//             message: error.response?.data?.message || error.message || 'Error processing the image'
//         });
//     }
// });

const requestQueue = [];
const processedCache = new Map();
let isProcessing = false;

async function processNextInQueue() {
    if (isProcessing || requestQueue.length === 0) return;

    isProcessing = true;
    const { event, data } = requestQueue.shift();

    try {
        // Create form data and check if we're dealing with a single image or multiple images
        const formData = new FormData();
        const images = Array.isArray(data.images) ? data.images : [{ base64: data.imageBuffer, fileName: data.fileName }];
        if (data.backgroundColor) {
            formData.append('backgroundColor', data.backgroundColor);
        }
        // Check cache and add images to formData
        const cacheResults = [];
        let allCached = true;

        for (let imageData of images) {
            const cacheKey = imageData.base64 || imageData.imageBuffer;
            if (processedCache.has(cacheKey)) {
                cacheResults.push(processedCache.get(cacheKey));
            } else {
                allCached = false;
                const imageBuffer = Buffer.from(cacheKey, 'base64');
                formData.append('files', imageBuffer, {
                    filename: imageData.fileName,
                    contentType: 'image/png'
                });
            }
        }

        // If all images were cached, return the cached results
        if (allCached) {
            event.reply("remove-background-result", {
                success: true,
                images: cacheResults,
                message: "Retrieved from cache",
            });
            return;
        }

        // If not cached, make request to backend
        const response = await axios.post(
            'https://backend-for-model-w5hd.onrender.com/imageModel/remove-background',
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${data.token}`,
                    ...formData.getHeaders()
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        // Cache and reply with the response for each processed image
        response.data.result.forEach((result, index) => {
            const cacheKey = images[index].base64 || images[index].imageBuffer;
            processedCache.set(cacheKey, result);
            cacheResults.push(result);
        });

        // Limit cache size
        if (processedCache.size > 50) {
            const firstKey = processedCache.keys().next().value;
            processedCache.delete(firstKey);
        }

        event.reply("remove-background-result", {
            success: true,
            images: cacheResults,
            message: response.data.message,
        });
    } catch (error) {
        event.reply('remove-background-result', {
            success: false,
            message: error.response?.data?.message || error.message
        });
    } finally {
        isProcessing = false;
        processNextInQueue();
    }
}

// Main process for background remover
ipcMain.on('remove-background', async (event, data) => {
    requestQueue.push({ event, data });
    console.log("Started processing")
    processNextInQueue();
    console.log("Ended processing")
});

// Main process for human remover
ipcMain.on('remove-human', async (event, data) => {
    requestQueue.push({ event, data });
    const processNextInQueue = async () => {
        if (isProcessing || requestQueue.length === 0) return;

        isProcessing = true;
        const { event, data } = requestQueue.shift();

        try {
            // Create form data and check if we're dealing with a single image or multiple images
            const formData = new FormData();
            const images = Array.isArray(data.images) ? data.images : [{ base64: data.imageBuffer, fileName: data.fileName }];
            if (data.backgroundColor) {
                formData.append('backgroundColor', data.backgroundColor);
            }
            // Check cache and add images to formData
            const cacheResults = [];
            let allCached = true;

            for (let imageData of images) {
                const cacheKey = imageData.base64 || imageData.imageBuffer;
                if (processedCache.has(cacheKey)) {
                    cacheResults.push(processedCache.get(cacheKey));
                } else {
                    allCached = false;
                    const imageBuffer = Buffer.from(cacheKey, 'base64');
                    formData.append('files', imageBuffer, {
                        filename: imageData.fileName,
                        contentType: 'image/png'
                    });
                }
            }

            // If all images were cached, return the cached results
            if (allCached) {
                event.reply("remove-background-result", {
                    success: true,
                    images: cacheResults,
                    message: "Retrieved from cache",
                });
                return;
            }

            // If not cached, make request to backend
            const response = await axios.post(
                'https://backend-for-model-w5hd.onrender.com/imageModel/remove-human',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        ...formData.getHeaders()
                    },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                }
            );

            // Cache and reply with the response for each processed image

            response.data.result.forEach((result, index) => {
                const cacheKey = images[index].base64 || images[index].imageBuffer;
                processedCache.set(cacheKey, result);
                cacheResults.push(result);
            });


            // Limit cache size
            if (processedCache.size > 50) {
                const firstKey = processedCache.keys().next().value;
                processedCache.delete(firstKey);
            }

            event.reply("remove-human-result", {
                success: true,
                images: cacheResults,
                message: response.data.message,
            });
        } catch (error) {
            event.reply('remove-human-result', {
                success: false,
                message: error.response?.data?.message || error.message
            });
        } finally {
            isProcessing = false;
            processNextInQueue();
        }
    }

    // ipcMain.on('remove-background', async (event, data) => {
    //     requestQueue.push({ event, data });
    //     processNextInQueue();
    // })
    processNextInQueue();
});

// Main process for dummy remover
// ipcMain.on('remove-dummy', async (event, data) => {
//     requestQueue.push({ event, data });
//     const processNextInQueue = async () => {
//         if (isProcessing || requestQueue.length === 0) return;

//         isProcessing = true;
//         const { event, data } = requestQueue.shift();

//         try {
//             // Create form data and check if we're dealing with a single image or multiple images
//             const formData = new FormData();
//             const images = Array.isArray(data.images) ? data.images : [{ base64: data.imageBuffer, fileName: data.fileName }];
//             if (data.backgroundColor) {
//                 formData.append('backgroundColor', data.backgroundColor);
//             }
//             // Check cache and add images to formData
//             const cacheResults = [];
//             let allCached = true;

//             for (let imageData of images) {
//                 const cacheKey = imageData.base64 || imageData.imageBuffer;
//                 if (processedCache.has(cacheKey)) {
//                     cacheResults.push(processedCache.get(cacheKey));
//                 } else {
//                     allCached = false;
//                     const imageBuffer = Buffer.from(cacheKey, 'base64');
//                     formData.append('files', imageBuffer, {
//                         filename: imageData.fileName,
//                         contentType: 'image/png'
//                     });
//                 }
//             }

//             // If all images were cached, return the cached results
//             if (allCached) {
//                 event.reply("remove-dummy-result", {
//                     success: true,
//                     images: cacheResults,
//                     message: "Retrieved from cache",
//                 });
//                 return;
//             }

//             // If not cached, make request to backend
//             const response = await axios.post(
//                 'http://localhost:8000/remove-dummy',
//                 // 'http://localhost:3000/imageModel/remove-dummy',
//                 formData,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${data.token}`,
//                         ...formData.getHeaders()
//                     },
//                     maxContentLength: Infinity,
//                     maxBodyLength: Infinity
//                 }
//             );

//             // Cache and reply with the response for each processed image

//             response.data.result.forEach((result, index) => {
//                 const cacheKey = images[index].base64 || images[index].imageBuffer;
//                 processedCache.set(cacheKey, result);
//                 cacheResults.push(result);
//             });


//             // Limit cache size
//             if (processedCache.size > 50) {
//                 const firstKey = processedCache.keys().next().value;
//                 processedCache.delete(firstKey);
//             }

//             event.reply("remove-dummy-result", {
//                 success: true,
//                 images: cacheResults,
//                 message: response.data.message,
//             });
//         } catch (error) {
//             event.reply('remove-dummy-result', {
//                 success: false,
//                 message: error.response?.data?.message || error.message
//             });
//         } finally {
//             isProcessing = false;
//             processNextInQueue();
//         }
//     }

//     processNextInQueue();
// });

ipcMain.on('remove-dummy', async (event, data) => {
    requestQueue.push({ event, data });

    const processNextInQueue = async () => {
        if (isProcessing || requestQueue.length === 0) return;

        isProcessing = true;
        const { event, data } = requestQueue.shift();

        try {
            const formData = new FormData();
            const images = Array.isArray(data.images) ? data.images : [{ base64: data.imageBuffer, fileName: data.fileName }];

            if (data.backgroundColor) {
                formData.append('backgroundColor', data.backgroundColor);
            }

            const cacheResults = [];
            let allCached = true;

            // Prepare images for processing
            for (let imageData of images) {
                const cacheKey = imageData.base64 || imageData.imageBuffer;

                if (processedCache.has(cacheKey)) {
                    cacheResults.push({
                        ...processedCache.get(cacheKey),
                        cachedResult: true
                    });
                } else {
                    allCached = false;
                    const imageBuffer = Buffer.from(cacheKey, 'base64');
                    formData.append('files', imageBuffer, {
                        filename: imageData.fileName,
                        contentType: 'image/png'
                    });
                }
            }

            // If all images were cached, return cached results
            if (allCached) {
                event.reply("remove-dummy-result", {
                    success: true,
                    images: cacheResults,
                    message: "Retrieved from cache",
                });
                return;
            }

            // Make request to backend
            const response = await axios.post(
                'http://ec2-3-94-9-72.compute-1.amazonaws.com:8000/remove-dummy',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        ...formData.getHeaders()
                    },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                }
            );

            // Process and cache results
            const processedResults = response.data.result.map(result => {
                if (result.success) {
                    const matchingImage = images.find(img =>
                        img.fileName === result.originalFileName
                    );
                    const cacheKey = matchingImage.base64 || matchingImage.imageBuffer;

                    const processedResult = {
                        id: result.id,
                        fileName: result.originalFileName,
                        processedImage: result.processedImageBase64,
                        success: result.success
                    };

                    processedCache.set(cacheKey, processedResult);
                    return processedResult;
                }
                return result;
            });

            // Limit cache size
            if (processedCache.size > 50) {
                const firstKey = processedCache.keys().next().value;
                processedCache.delete(firstKey);
            }

            // Reply with processed results
            event.reply("remove-dummy-result", {
                success: true,
                images: processedResults,
                message: response.data.message,
            });

        } catch (error) {
            event.reply('remove-dummy-result', {
                success: false,
                message: error.response?.data?.message || error.message
            });
        } finally {
            isProcessing = false;
            processNextInQueue();
        }
    }

    processNextInQueue();
});
// async function processNextInQueueImage() {
//     if (isProcessing || requestQueue.length === 0) return;

//     isProcessing = true;
//     const { event, data } = requestQueue.shift();

//     try {
//         // Check cache first
//         const cacheKey = data.imageBuffer;
//         if (processedCache.has(cacheKey)) {
//             event.reply("remove-background-result", {
//                 success: true,
//                 images: processedCache.get(cacheKey),
//                 message: "Retrieved from cache",
//             });
//             return;
//         }

//         const formData = new FormData();
//         const imageBuffer = Buffer.from(data.imageBuffer, 'base64');
//         formData.append('files', imageBuffer, {
//             filename: data.fileName,
//             contentType: 'image/png'
//         });

//         const response = await axios.post(
//             'http://localhost:3000/imageModel/remove-background',
//             formData,
//             {
//                 headers: {
//                     'Authorization': `Bearer ${data.token}`,
//                     ...formData.getHeaders()
//                 },
//                 maxContentLength: Infinity,
//                 maxBodyLength: Infinity
//             }
//         );

//         // Cache the result
//         processedCache.set(cacheKey, response.data.result);
//         if (processedCache.size > 50) { // Limit cache size
//             const firstKey = processedCache.keys().next().value;
//             processedCache.delete(firstKey);
//         }

//         event.reply("remove-background-result", {
//             success: true,
//             images: response.data.result,
//             message: response.data.message,
//         });
//     } catch (error) {
//         event.reply('remove-background-result', {
//             success: false,
//             message: error.response?.data?.message || error.message
//         });
//     } finally {
//         isProcessing = false;
//         processNextInQueueImage();
//     }
// }

// ipcMain.on('remove-background-image', async (event, data) => {
//     requestQueue.push({ event, data });
//     console.log("Sending picture ")
//     processNextInQueueImage();
//     console.log("Picture recieved")
// });

// Modifications for main.js

// async function processNextInQueue() {
//     if (isProcessing || requestQueue.length === 0) return;

//     isProcessing = true;
//     const { event, data } = requestQueue.shift();

//     try {
//         const formData = new FormData();

//         data.images.forEach((imageData, index) => {
//             const imageBuffer = Buffer.from(imageData.base64, 'base64');
//             formData.append('files', imageBuffer, {
//                 filename: imageData.fileName,
//                 contentType: 'image/png'
//             });
//         });

//         const response = await axios.post(
//             'http://localhost:3000/imageModel/remove-background',
//             formData,
//             {
//                 headers: {
//                     'Authorization': `Bearer ${data.token}`,
//                     ...formData.getHeaders()
//                 },
//                 maxContentLength: Infinity,
//                 maxBodyLength: Infinity
//             }
//         );

//         // Handle multiple images

//         event.reply("remove-background-result", {
//             success: true,
//             images: response.data.result,
//             message: response.data.message,
//         });
//     } catch (error) {
//         event.reply('remove-background-result', {
//             success: false,
//             message: error.response?.data?.message || error.message
//         });
//     } finally {
//         isProcessing = false;
//         processNextInQueue();
//     }
// }

// Handle file saving
ipcMain.on('save-file', async (event, filePath) => {
    try {
        const { filePath: savePath } = await dialog.showSaveDialog({
            defaultPath: path.basename(filePath)
        });

        if (savePath) {
            await fs.copyFile(filePath, savePath);
            event.sender.send('save-complete', { success: true });
        }
    } catch (error) {
        event.sender.send('save-complete', {
            success: false,
            error: error.message
        });
    }
});
