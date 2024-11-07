import { app, BrowserWindow, ipcMain, dialog } from 'electron';

import dotenv from 'dotenv'

import axios from 'axios';
import { writeFile, createReadStream, unlinkSync, existsSync } from 'node:fs';
import { writeFile as writeFilePromise } from 'node:fs/promises';
import FormData from 'form-data';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config()


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
                priceId: data.priceId
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
                priceId: data.priceId
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

//         // Convert base64 to buffer
//         const imageBuffer = Buffer.from(data.imageBuffer, 'base64');
//         console.log('Buffer created successfully');

//         // Create temporary file with more detailed error handling
//         let tempFilePath;
//         try {
//             tempFilePath = path.join(app.getPath('temp'), data.fileName);
//             console.log('Temp file path:', tempFilePath);

//             fs.writeFileSync(tempFilePath, imageBuffer);
//             console.log('File written successfully');

//             // Verify file exists
//             if (!fs.existsSync(tempFilePath)) {
//                 throw new Error('File was not created successfully');
//             }
//         } catch (fileError) {
//             console.error('Error with file operations:', fileError);
//             throw fileError;
//         }

//         console.log('Creating FormData...');
//         // Create form data with error handling
//         try {
//             const formData = new FormData();
//             console.log('FormData created');

//             const fileStream = fs.createReadStream(tempFilePath);
//             console.log('File stream created');

//             formData.append('files', fileStream);
//             console.log('File appended to FormData');

//             console.log('Sending request...');
//             const response = await axios.post(
//                 'http://localhost:3000/imageModel/remove-background',
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
//             console.log('Request completed');

//             // Clean up temp file
//             try {
//                 fs.unlinkSync(tempFilePath);
//                 console.log('Temp file cleaned up');
//             } catch (cleanupError) {
//                 console.error('Error cleaning up temp file:', cleanupError);
//                 // Continue execution even if cleanup fails
//             }

//             event.reply("remove-background-result", {
//                 success: true,
//                 images: response.data.result,
//                 message: response.data.message,
//             });
//         } catch (processError) {
//             console.error('Error in processing:', processError);
//             throw processError;
//         }
//     }
//     catch (error) {
//         console.error('Final error catch:', error);
//         event.reply('remove-background-result', {
//             success: false,
//             message: error.response?.data.message || error.response?.data || error.message || 'Error processing the image'
//         });
//     }
// });

// ipcMain.on('remove-background', async (event, data) => {
//     try {
//         console.log('Starting background removal process...');

//         // Convert base64 to buffer
//         const imageBuffer = Buffer.from(data.imageBuffer, 'base64');
//         console.log('Buffer created successfully');

//         // Create temporary file with more detailed error handling
//         let tempFilePath;
//         try {
//             tempFilePath = path.join(app.getPath('temp'), data.fileName);
//             console.log('Temp file path:', tempFilePath);

//             // Use Promise-based writeFile instead of writeFileSync
//             await writeFilePromise(tempFilePath, imageBuffer);
//             console.log('File written successfully');

//             // Verify file exists
//             if (!existsSync(tempFilePath)) {
//                 throw new Error('File was not created successfully');
//             }
//         } catch (fileError) {
//             console.error('Error with file operations:', fileError);
//             throw fileError;
//         }

//         console.log('Creating FormData...');
//         try {
//             const formData = new FormData();
//             console.log('FormData created');

//             const fileStream = createReadStream(tempFilePath);
//             console.log('File stream created');

//             formData.append('files', fileStream);
//             console.log('File appended to FormData');

//             console.log('Sending request...');
//             const response = await axios.post(
//                 'http://localhost:3000/imageModel/remove-background',
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
//             console.log('Request completed');

//             // Clean up temp file
//             try {
//                 unlinkSync(tempFilePath);
//                 console.log('Temp file cleaned up');
//             } catch (cleanupError) {
//                 console.error('Error cleaning up temp file:', cleanupError);
//             }

//             event.reply("remove-background-result", {
//                 success: true,
//                 images: response.data.result,
//                 message: response.data.message,
//             });
//         } catch (processError) {
//             console.error('Error in processing:', processError);
//             throw processError;
//         }
//     }
//     catch (error) {
//         console.error('Final error catch:', error);
//         event.reply('remove-background-result', {
//             success: false,
//             message: error.response?.data.message || error.response?.data || error.message || 'Error processing the image'
//         });
//     }
// });

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

//         event.reply("remove-background-result", {
//             success: true,
//             images: response.data.result,
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
            'http://localhost:3000/imageModel/remove-background',
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

ipcMain.on('remove-background', async (event, data) => {
    requestQueue.push({ event, data });
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

// ipcMain.on('remove-background', async (event, data) => {
//     console.log("Images:", data)
//     requestQueue.push({ event, data });
//     console.log("Sending File")
//     processNextInQueue();
//     console.log("Reciving File")
// });


// ipcMain.on('remove-background', async (event, data) => {
//     try {
//         const { files } = data;
//         const results = [];

//         // Create output directory if it doesn't exist
//         const outputDir = path.join(app.getPath('temp'), 'background-removed');
//         await fs.mkdir(outputDir, { recursive: true });

//         // Process each file
//         for (let i = 0; i < files.length; i++) {
//             const inputPath = files[i];
//             const outputPath = path.join(outputDir, `processed-${path.basename(inputPath)}`);

//             // Run Python script
//             await new Promise((resolve, reject) => {
//                 const pythonProcess = spawn('python', [
//                     'background_remover.py',
//                     inputPath,
//                     outputPath
//                 ]);

//                 pythonProcess.on('close', (code) => {
//                     if (code === 0) {
//                         results.push(outputPath);
//                         // Send progress update
//                         event.sender.send('background-remove-progress', {
//                             progress: Math.round(((i + 1) / files.length) * 100)
//                         });
//                         resolve();
//                     } else {
//                         reject(new Error(`Processing failed with code ${code}`));
//                     }
//                 });
//             });
//         }

//         // Handle results
//         if (results.length === 1) {
//             event.sender.send('background-remove-complete', {
//                 success: true,
//                 files: results
//             });
//         } else {
//             // Create ZIP file for multiple images
//             const zipPath = path.join(outputDir, 'processed-images.zip');
//             const archive = archiver('zip');
//             const output = fs.createWriteStream(zipPath);

//             archive.pipe(output);
//             results.forEach(file => {
//                 archive.file(file, { name: path.basename(file) });
//             });
//             await archive.finalize();

//             event.sender.send('background-remove-complete', {
//                 success: true,
//                 zipPath,
//                 files: results
//             });
//         }
//     } catch (error) {
//         event.sender.send('background-remove-error', {
//             success: false,
//             message: error.message
//         });
//     }
// });

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
