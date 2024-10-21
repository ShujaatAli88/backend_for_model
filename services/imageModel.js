
// const multer = require('multer');
// const { spawn } = require('child_process');
// const sharp = require('sharp');
// const fs = require('fs');
// const path = require('path');
// const archiver = require('archiver');
// const { v4: uuidv4 } = require('uuid');
// const fileURLToPath = require('url')

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const MAX_FILES = 5;

// function allowedFile(filename) {
//     const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
//     return allowedExtensions.includes(path.extname(filename).toLowerCase());
// }

// async function ensureUploadsDirectory() {
//     const uploadsDir = path.join(__dirname, 'uploads');
//     try {
//         await fs.access(uploadsDir);
//     } catch {
//         await fs.mkdir(uploadsDir, { recursive: true });
//     }
//     return uploadsDir;
// }

// async function backgroundRemover(files) {
//     if (!files || files.length === 0) {
//         throw new Error("No file found, Please upload a file");
//     }

//     if (files.length > MAX_FILES) {
//         throw new Error(`Maximum ${MAX_FILES} files allowed`);
//     }

//     const uploadsDir = await ensureUploadsDirectory();
//     const results = [];

//     for (const file of files) {
//         if (allowedFile(file.originalname)) {
//             try {
//                 // Create temporary file
//                 const tempFileName = `${uuidv4()}${path.extname(file.originalname)}`;
//                 const tempFilePath = path.join(uploadsDir, tempFileName);

//                 // Write buffer to temporary file
//                 await fs.writeFile(tempFilePath, file.buffer);
//                 console.log('Temporary file created at:', tempFilePath);

//                 // Process with rembg
//                 const processedBuffer = await new Promise((resolve, reject) => {
//                     const pythonProcess = spawn('python3', ['-m', 'rembg', 'i', tempFilePath, '-']);
//                     const chunks = [];

//                     pythonProcess.stdout.on('data', (data) => {
//                         chunks.push(data);
//                     });

//                     pythonProcess.stderr.on('data', (data) => {
//                         console.error('Python process error:', data.toString());
//                     });

//                     pythonProcess.on('error', (error) => {
//                         console.error('Failed to start Python process:', error);
//                         reject(error);
//                     });

//                     pythonProcess.on('close', async (code) => {
//                         try {
//                             if (code !== 0) {
//                                 throw new Error(`Python process exited with code ${code}`);
//                             }

//                             const outputBuffer = Buffer.concat(chunks);
//                             const processedImage = await sharp(outputBuffer)
//                                 .png()
//                                 .toBuffer();
//                             resolve(processedImage);
//                         } catch (error) {
//                             reject(error);
//                         }
//                     });
//                 });

//                 // Convert to base64 and add to results
//                 const base64Image = processedBuffer.toString('base64');
//                 results.push({
//                     filename: file.originalname,
//                     base64: `data:image/png;base64,${base64Image}`
//                 });

//                 // Clean up temp file
//                 await fs.unlink(tempFilePath).catch(console.error);

//             } catch (error) {
//                 console.error('Error processing image:', error);
//                 throw new Error(`Error processing image ${file.originalname}: ${error.message}`);
//             }
//         } else {
//             throw new Error(`File type not allowed for ${file.originalname}`);
//         }
//     }

//     return results;
// }

// // const upload = multer({ storage: multer.memoryStorage() });
// // const MAX_FILES = 5;
// // const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg'];

// // function allowedFile(file) {
// //     const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
// //     return ALLOWED_EXTENSIONS.includes(ext);
// // }

// // async function ensureUploadsDirectory() {
// //     const uploadsDir = path.join(__dirname, 'uploads');
// //     try {
// //         await fs.access(uploadsDir);
// //     } catch {
// //         await fs.mkdir(uploadsDir, { recursive: true });
// //     }
// //     return uploadsDir;
// // }

// // async function backgroundRemover(files) {
// //     if (!files || files.length === 0) {
// //         throw new Error("No file found, Please upload a file");
// //     }

// //     if (files.length > MAX_FILES) {
// //         throw new Error(`Maximum ${MAX_FILES} files allowed`);
// //     }

// //     const uploadsDir = await ensureUploadsDirectory();
// //     const results = [];

// //     // Process each uploaded file
// //     for (const file of files) {
// //         if (allowedFile(file.originalname)) {
// //             try {
// //                 // Create temporary file with unique name
// //                 const tempFileName = `${uuidv4()}${path.extname(file.originalname)}`;
// //                 const tempFilePath = path.join(uploadsDir, tempFileName);

// //                 // Write buffer to temporary file
// //                 await fs.writeFile(tempFilePath, file.buffer);
// //                 console.log('Temporary file created at:', tempFilePath);

// //                 // Process with rembg
// //                 const processedBuffer = await new Promise((resolve, reject) => {
// //                     const pythonProcess = spawn('python3', ['-m', 'rembg', 'i', tempFilePath, '-']);
// //                     const chunks = [];

// //                     pythonProcess.stdout.on('data', (data) => {
// //                         chunks.push(data);
// //                     });

// //                     pythonProcess.stderr.on('data', (data) => {
// //                         console.error('Python process error:', data.toString());
// //                     });

// //                     pythonProcess.on('error', (error) => {
// //                         console.error('Failed to start Python process:', error);
// //                         reject(error);
// //                     });

// //                     pythonProcess.on('close', async (code) => {
// //                         if (code !== 0) {
// //                             reject(new Error(`Python process exited with code ${code}`));
// //                             return;
// //                         }

// //                         try {
// //                             const outputBuffer = Buffer.concat(chunks);
// //                             const processedImage = await sharp(outputBuffer)
// //                                 .png()
// //                                 .toBuffer();
// //                             resolve(processedImage);
// //                         } catch (error) {
// //                             reject(error);
// //                         }
// //                     });

// //                     // Handle input
// //                     pythonProcess.stdin.end(file.buffer);
// //                 });

// //                 // Add to results
// //                 const base64Image = processedBuffer.toString('base64');
// //                 results.push({
// //                     filename: file.originalname,
// //                     base64: `data:image/png;base64,${base64Image}`
// //                 });

// //                 // Clean up temp file
// //                 await fs.unlink(tempFilePath);

// //             } catch (error) {
// //                 console.error('Error processing image:', error);
// //                 throw new Error(`Error processing image ${file.originalname}: ${error.message}`);
// //             }
// //         } else {
// //             throw new Error(`File type not allowed for ${file.originalname}`);
// //         }
// //     }

// //     // Return results
// //     return results;
// // }


// // async function backgroundRemover(body) {
// //     const { images, filename } = body
// //     if (!images || images.length === 0) {
// //         // return res.status(400).json({ error: 'No files uploaded' });
// //         // return "No file found, Please upload a file"
// //         throw new Error("No file found, Please upload a file")
// //     }

// //     if (images.length > MAX_FILES) {
// //         // return res.status(400).json({ error: `Maximum ${MAX_FILES} files allowed` });
// //         throw new Error(`Maximum ${MAX_FILES} files allowed`)
// //     }
// //     const results = [];

// //     // Process each uploaded file
// //     for (const image of images) {
// //         if (allowedFile(image)) {
// //             try {
// //                 // Save file temporarily to disk
// //                 const tempFilePath = path.join(__dirname, 'uploads', uuidv4() + path.extname(image.originalname));
// //                 fs.writeFileSync(tempFilePath, image.buffer);

// //                 // Call Python script using 'rembg' to remove the background
// //                 const pythonProcess = spawn('python3', ['-m', 'rembg', 'i', tempFilePath, '-']);

// //                 const chunks = [];
// //                 pythonProcess.stdout.on('data', (data) => {
// //                     chunks.push(data);
// //                 });

// //                 pythonProcess.on('close', async () => {
// //                     const outputBuffer = Buffer.concat(chunks);

// //                     // Convert the result back into PNG format
// //                     const processedImage = await sharp(outputBuffer)
// //                         .png()
// //                         .toBuffer();

// //                     // Store result in memory
// //                     results.push({
// //                         filename: filename,
// //                         buffer: processedImage,
// //                     });

// //                     // Clean up temp file
// //                     fs.unlinkSync(tempFilePath);

// //                     // If all files are processed, send response
// //                     if (results.length === images.length) {
// //                         if (results.length === 1) {
// //                             // Single file response
// //                             // res.setHeader('Content-Disposition', `attachment; filename=${path.parse(results[0].filename).name}_nobg.png`);
// //                             // res.contentType('image/png');
// //                             // res.send(results[0].buffer);
// //                             // return results[0].buffer
// //                             return results[0].buffer;
// //                         } else {
// //                             // Multiple files: return a ZIP
// //                             const zipFileName = `${filename}.zip`;
// //                             const zipFilePath = path.join(__dirname, 'uploads', zipFileName);
// //                             const output = fs.createWriteStream(zipFilePath);
// //                             const archive = archiver('zip');

// //                             archive.pipe(output);

// //                             // Add each processed image to the ZIP
// //                             results.forEach((result) => {
// //                                 archive.append(result.buffer, { name: `${path.parse(result.filename).name}_nobg.png` });
// //                             });

// //                             await archive.finalize();

// //                             // After zipping, send the ZIP file
// //                             output.on('close', () => {
// //                                 return zipFilePath
// //                                 // return download(zipFilePath, zipFileName, () => {
// //                                 //     // Clean up the zip file after download
// //                                 //     fs.unlinkSync(zipFilePath);
// //                                 // });
// //                             });
// //                         }
// //                     }
// //                 });

// //                 pythonProcess.stderr.on('data', (data) => {
// //                     console.error('Python error:', data.toString());
// //                 });
// //             } catch (error) {
// //                 console.error('Error processing image:', error);
// //                 // return res.status(500).json({ error: 'Error processing image' });
// //                 throw new Error('Error processing image')
// //                 // return res.status(500).json({ error: 'Error processing image' });
// //             }
// //         }
// //     }
// // }

// // async function backgroundRemover(files) {
// //     if (!files || files.length === 0) {
// //         throw new Error("No file found, Please upload a file");
// //     }

// //     if (files.length > MAX_FILES) {
// //         throw new Error(`Maximum ${MAX_FILES} files allowed`);
// //     }

// //     const results = [];

// //     // Process each uploaded file
// //     for (const file of files) {
// //         if (allowedFile(file.originalname)) {
// //             try {
// //                 // Create temporary file
// //                 const tempFilePath = path.join(__dirname, 'uploads', `${uuidv4()}${path.extname(file.originalname)}`);
// //                 await fs.promises.writeFile(tempFilePath, file.buffer);

// //                 // Process with rembg
// //                 const processedBuffer = await new Promise((resolve, reject) => {
// //                     const pythonProcess = spawn('python3', ['-m', 'rembg', 'i', tempFilePath, '-']);
// //                     const chunks = [];

// //                     pythonProcess.stdout.on('data', (data) => {
// //                         chunks.push(data);
// //                     });

// //                     pythonProcess.on('error', (error) => {
// //                         reject(error);
// //                     });

// //                     pythonProcess.on('close', async (code) => {
// //                         if (code !== 0) {
// //                             reject(new Error(`Python process exited with code ${code}`));
// //                             return;
// //                         }

// //                         const outputBuffer = Buffer.concat(chunks);
// //                         try {
// //                             const processedImage = await sharp(outputBuffer)
// //                                 .png()
// //                                 .toBuffer();
// //                             resolve(processedImage);
// //                         } catch (error) {
// //                             reject(error);
// //                         }
// //                     });
// //                 });

// //                 results.push({
// //                     filename: file.originalname,
// //                     buffer: processedBuffer
// //                 });

// //                 // Clean up temp file
// //                 await fs.promises.unlink(tempFilePath);

// //             } catch (error) {
// //                 console.error('Error processing image:', error);
// //                 throw new Error('Error processing image');
// //             }
// //         }
// //     }

// //     // Return results
// //     if (results.length === 1) {
// //         return results[0].buffer;
// //     } else {
// //         // Create ZIP file for multiple images
// //         const zipFileName = `${uuidv4()}.zip`;
// //         const zipFilePath = path.join(__dirname, 'uploads', zipFileName);

// //         return new Promise((resolve, reject) => {
// //             const output = fs.createWriteStream(zipFilePath);
// //             const archive = archiver('zip');

// //             output.on('close', () => resolve(zipFilePath));
// //             archive.on('error', reject);

// //             archive.pipe(output);

// //             results.forEach((result) => {
// //                 archive.append(result.buffer, {
// //                     name: `${path.parse(result.filename).name}_nobg.png`
// //                 });
// //             });

// //             archive.finalize();
// //         });
// //     }
// // }

// module.exports = {
//     backgroundRemover
// }



// // Route for removing background from uploaded images
// // app.post('/remove-background', upload.array('files', MAX_FILES), async (req, res) => {
// //     const files = req.files;

// //     if (!files || files.length === 0) {
// //         return res.status(400).json({ error: 'No files uploaded' });
// //     }

// //     if (files.length > MAX_FILES) {
// //         return res.status(400).json({ error: `Maximum ${MAX_FILES} files allowed` });
// //     }

// //     const results = [];

// //     // Process each uploaded file
// //     for (const file of files) {
// //         if (allowedFile(file)) {
// //             try {
// //                 // Save file temporarily to disk
// //                 const tempFilePath = path.join(__dirname, 'uploads', uuidv4() + path.extname(file.originalname));
// //                 fs.writeFileSync(tempFilePath, file.buffer);

// //                 // Call Python script using 'rembg' to remove the background
// //                 const pythonProcess = spawn('python3', ['-m', 'rembg', 'i', tempFilePath, '-']);

// //                 const chunks = [];
// //                 pythonProcess.stdout.on('data', (data) => {
// //                     chunks.push(data);
// //                 });

// //                 pythonProcess.on('close', async () => {
// //                     const outputBuffer = Buffer.concat(chunks);

// //                     // Convert the result back into PNG format
// //                     const processedImage = await sharp(outputBuffer)
// //                         .png()
// //                         .toBuffer();

// //                     // Store result in memory
// //                     results.push({
// //                         filename: file.originalname,
// //                         buffer: processedImage,
// //                     });

// //                     // Clean up temp file
// //                     fs.unlinkSync(tempFilePath);

// //                     // If all files are processed, send response
// //                     if (results.length === files.length) {
// //                         if (results.length === 1) {
// //                             // Single file response
// //                             res.setHeader('Content-Disposition', `attachment; filename=${path.parse(results[0].filename).name}_nobg.png`);
// //                             res.contentType('image/png');
// //                             res.send(results[0].buffer);
// //                         } else {
// //                             // Multiple files: return a ZIP
// //                             const zipFileName = 'background_removed_images.zip';
// //                             const zipFilePath = path.join(__dirname, 'uploads', zipFileName);
// //                             const output = fs.createWriteStream(zipFilePath);
// //                             const archive = archiver('zip');

// //                             archive.pipe(output);

// //                             // Add each processed image to the ZIP
// //                             results.forEach((result) => {
// //                                 archive.append(result.buffer, { name: `${path.parse(result.filename).name}_nobg.png` });
// //                             });

// //                             await archive.finalize();

// //                             // After zipping, send the ZIP file
// //                             output.on('close', () => {
// //                                 res.download(zipFilePath, zipFileName, () => {
// //                                     // Clean up the zip file after download
// //                                     fs.unlinkSync(zipFilePath);
// //                                 });
// //                             });
// //                         }
// //                     }
// //                 });

// //                 pythonProcess.stderr.on('data', (data) => {
// //                     console.error('Python error:', data.toString());
// //                 });
// //             } catch (error) {
// //                 console.error('Error processing image:', error);
// //                 return res.status(500).json({ error: 'Error processing image' });
// //             }
// //         } else {
// //             return res.status(400).json({ error: 'Invalid file type' });
// //         }
// //     }
// // });

// import { spawn } from 'child_process';
// import path from 'path';
// import fs from 'fs/promises';
// import { v4 as uuidv4 } from 'uuid';
// import sharp from 'sharp';
// import { fileURLToPath } from 'url';

// const currentFilePath = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(currentFilePath);

// const MAX_FILES = 5;

// function allowedFile(filename) {
//     const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
//     return allowedExtensions.includes(path.extname(filename).toLowerCase());
// }

// async function ensureUploadsDirectory() {
//     const uploadsDir = path.join(__dirname, 'uploads');
//     try {
//         await fs.access(uploadsDir);
//     } catch {
//         await fs.mkdir(uploadsDir, { recursive: true });
//     }
//     return uploadsDir;
// }

// async function backgroundRemover(files) {
//     if (!files || files.length === 0) {
//         throw new Error("No file found, Please upload a file");
//     }

//     if (files.length > MAX_FILES) {
//         throw new Error(`Maximum ${MAX_FILES} files allowed`);
//     }

//     const uploadsDir = await ensureUploadsDirectory();
//     const results = [];

//     for (const file of files) {
//         if (allowedFile(file.originalname)) {
//             try {
//                 // Create temporary file
//                 const tempFileName = `${uuidv4()}${path.extname(file.originalname)}`;
//                 const tempFilePath = path.join(uploadsDir, tempFileName);

//                 // Write buffer to temporary file
//                 await fs.writeFile(tempFilePath, file.buffer);
//                 console.log('Temporary file created at:', tempFilePath);

//                 // Process with rembg
//                 const processedBuffer = await new Promise((resolve, reject) => {
//                     const pythonProcess = spawn('python3', ['-m', 'rembg', 'i', tempFilePath, '-']);
//                     const chunks = [];

//                     pythonProcess.stdout.on('data', (data) => {
//                         chunks.push(data);
//                     });

//                     pythonProcess.stderr.on('data', (data) => {
//                         console.error('Python process error:', data.toString());
//                     });

//                     pythonProcess.on('error', (error) => {
//                         console.error('Failed to start Python process:', error);
//                         reject(error);
//                     });

//                     pythonProcess.on('close', async (code) => {
//                         try {
//                             if (code !== 0) {
//                                 throw new Error(`Python process exited with code ${code}`);
//                             }

//                             const outputBuffer = Buffer.concat(chunks);
//                             const processedImage = await sharp(outputBuffer)
//                                 .png()
//                                 .toBuffer();
//                             resolve(processedImage);
//                         } catch (error) {
//                             reject(error);
//                         }
//                     });
//                 });

//                 // Convert to base64 and add to results
//                 const base64Image = processedBuffer.toString('base64');
//                 results.push({
//                     filename: file.originalname,
//                     base64: `data:image/png;base64,${base64Image}`
//                 });

//                 // Clean up temp file
//                 await fs.unlink(tempFilePath).catch(console.error);

//             } catch (error) {
//                 console.error('Error processing image:', error);
//                 throw new Error(`Error processing image ${file.originalname}: ${error.message}`);
//             }
//         } else {
//             throw new Error(`File type not allowed for ${file.originalname}`);
//         }
//     }

//     return results;
// }

// export { backgroundRemover };

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

// const MAX_FILES = 5;

// function allowedFile(filename) {
//     const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
//     return allowedExtensions.includes(path.extname(filename).toLowerCase());
// }

// async function ensureUploadsDirectory() {
//     const uploadsDir = path.join(__dirname, 'uploads');
//     try {
//         await fs.access(uploadsDir);
//     } catch {
//         await fs.mkdir(uploadsDir, { recursive: true });
//     }
//     return uploadsDir;
// }

// async function backgroundRemover(files) {
//     if (!files || files.length === 0) {
//         throw new Error("No file found, Please upload a file");
//     }

//     if (files.length > MAX_FILES) {
//         throw new Error(`Maximum ${MAX_FILES} files allowed`);
//     }

//     const uploadsDir = await ensureUploadsDirectory();
//     const results = [];

//     for (const file of files) {
//         if (allowedFile(file.originalname)) {
//             try {
//                 // Create temporary file
//                 const tempFileName = `${uuidv4()}${path.extname(file.originalname)}`;
//                 const tempFilePath = path.join(uploadsDir, tempFileName);

//                 // Write buffer to temporary file
//                 await fs.writeFile(tempFilePath, file.buffer);
//                 console.log('Temporary file created at:', tempFilePath);

//                 // Process with rembg
//                 const processedBuffer = await new Promise((resolve, reject) => {
//                     // const pythonProcess = spawn('C:\\Python312\\python.exe', ['-m', 'rembg', 'i', tempFilePath, '-']);
//                     const pythonProcess = spawn('rembg', ['i', tempFilePath, '-']);
//                     const chunks = [];

//                     pythonProcess.stdout.on('data', (data) => {
//                         chunks.push(data);
//                     });

//                     pythonProcess.stderr.on('data', (data) => {
//                         console.error('Python process error:', data.toString());
//                     });

//                     pythonProcess.on('error', (error) => {
//                         console.error('Failed to start Python process:', error);
//                         reject(error);
//                     });

//                     pythonProcess.on('close', async (code) => {
//                         try {
//                             if (code !== 0) {
//                                 throw new Error(`Python process exited with code ${code}`);
//                             }

//                             const outputBuffer = Buffer.concat(chunks);
//                             const processedImage = await sharp(outputBuffer)
//                                 .png()
//                                 .toBuffer();
//                             resolve(processedImage);
//                         } catch (error) {
//                             reject(error);
//                         }
//                     });

//                     // Write input to Python process
//                     pythonProcess.stdin.write(file.buffer);
//                     pythonProcess.stdin.end();
//                 });

//                 // Convert to base64 and add to results
//                 const base64Image = processedBuffer.toString('base64');
//                 results.push({
//                     filename: file.originalname,
//                     base64: `data:image/png;base64,${base64Image}`
//                 });

//                 // Clean up temp file
//                 await fs.unlink(tempFilePath).catch(console.error);

//             } catch (error) {
//                 console.error('Error processing image:', error);
//                 throw new Error(`Error processing image ${file.originalname}: ${error.message}`);
//             }
//         } else {
//             throw new Error(`File type not allowed for ${file.originalname}`);
//         }
//     }

//     return results;
// }

// async function backgroundRemover(files) {
//     if (!files || files.length === 0) {
//         throw new Error("No file found, Please upload a file");
//     }

//     if (files.length > MAX_FILES) {
//         throw new Error(`Maximum ${MAX_FILES} files allowed`);
//     }

//     const uploadsDir = await ensureUploadsDirectory();
//     const results = [];

//     for (const file of files) {
//         if (allowedFile(file.originalname)) {
//             try {
//                 // Create temporary file
//                 const tempFileName = `${uuidv4()}${path.extname(file.originalname)}`;
//                 const tempFilePath = path.join(uploadsDir, tempFileName);

//                 // Write buffer to temporary file
//                 await fs.writeFile(tempFilePath, file.buffer);
//                 console.log('Temporary file created at:', tempFilePath);

//                 // Process with rembg
//                 const processedBuffer = await new Promise((resolve, reject) => {
//                     // Use Python executable path directly
//                     // const pythonProcess = spawn('python', ['-m', 'rembg', 'i', tempFilePath, '-']);
//                     const pythonProcess = spawn('rembg', ['i', tempFilePath, '-']);
//                     const chunks = [];

//                     pythonProcess.stdout.on('data', (data) => {
//                         chunks.push(data);
//                     });

//                     pythonProcess.stderr.on('data', (data) => {
//                         console.error('Python process error:', data.toString());
//                     });

//                     pythonProcess.stdin.on('error', (error) => {
//                         console.error('stdin error:', error);
//                         reject(error);
//                     });

//                     pythonProcess.stdout.on('error', (error) => {
//                         console.error('stdout error:', error);
//                         reject(error);
//                     });

//                     pythonProcess.on('error', (error) => {
//                         console.error('Failed to start Python process:', error);
//                         reject(error);
//                     });

//                     pythonProcess.on('close', async (code) => {
//                         try {
//                             if (code !== 0) {
//                                 throw new Error(`Python process exited with code ${code}`);
//                             }

//                             if (chunks.length === 0) {
//                                 throw new Error('No data received from Python process');
//                             }

//                             const outputBuffer = Buffer.concat(chunks);
//                             const processedImage = await sharp(outputBuffer)
//                                 .png()
//                                 .toBuffer();
//                             resolve(processedImage);
//                         } catch (error) {
//                             reject(error);
//                         }
//                     });

//                     // Write input to Python process with error handling
//                     try {
//                         if (file.buffer.length > 0) {
//                             pythonProcess.stdin.write(file.buffer, (error) => {
//                                 if (error) {
//                                     console.error('Error writing to stdin:', error);
//                                     reject(error);
//                                 }
//                                 pythonProcess.stdin.end();
//                             });
//                         } else {
//                             reject(new Error('Empty file buffer'));
//                         }
//                     } catch (error) {
//                         console.error('Error in write process:', error);
//                         reject(error);
//                     }
//                 });

//                 // Convert to base64 and add to results
//                 const base64Image = processedBuffer.toString('base64');
//                 results.push({
//                     filename: file.originalname,
//                     base64: `data:image/png;base64,${base64Image}`
//                 });

//                 // Clean up temp file
//                 await fs.unlink(tempFilePath).catch(console.error);

//             } catch (error) {
//                 console.error('Error processing image:', error);
//                 throw new Error(`Error processing image ${file.originalname}: ${error.message}`);
//             }
//         } else {
//             throw new Error(`File type not allowed for ${file.originalname}`);
//         }
//     }

//     return results;
// }

const MAX_FILES = 5;

function allowedFile(filename) {
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
    return allowedExtensions.includes(path.extname(filename).toLowerCase());
}

async function ensureUploadsDirectory() {
    const uploadsDir = path.join(__dirname, 'uploads');
    try {
        await fs.access(uploadsDir);
    } catch {
        await fs.mkdir(uploadsDir, { recursive: true });
    }
    return uploadsDir;
}

async function backgroundRemover(files) {
    if (!files || files.length === 0) {
        throw new Error("No file found, Please upload a file");
    }

    if (files.length > MAX_FILES) {
        throw new Error(`Maximum ${MAX_FILES} files allowed`);
    }

    const uploadsDir = await ensureUploadsDirectory();
    const results = [];

    for (const file of files) {
        if (allowedFile(file.originalname)) {
            try {
                // Create temporary input and output file names
                const inputFileName = `input_${uuidv4()}${path.extname(file.originalname)}`;
                const outputFileName = `output_${uuidv4()}.png`;
                const inputFilePath = path.join(uploadsDir, inputFileName);
                const outputFilePath = path.join(uploadsDir, outputFileName);

                // Write input file
                await fs.writeFile(inputFilePath, file.buffer);
                console.log('Input file created at:', inputFilePath);

                // Process with rembg using files instead of pipes
                await new Promise((resolve, reject) => {
                    // Adjust the Python path according to your system
                    // const pythonProcess = spawn('python', [
                    //     '-m',
                    //     'rembg',
                    //     'i',
                    //     inputFilePath,
                    //     outputFilePath
                    // ]);
                    const pythonProcess = spawn('rembg', ['i', inputFilePath,
                        outputFilePath]);

                    let errorOutput = '';

                    pythonProcess.stderr.on('data', (data) => {
                        errorOutput += data.toString();
                        console.error('Python process error:', data.toString());
                    });

                    pythonProcess.on('error', (error) => {
                        console.error('Failed to start Python process:', error);
                        reject(error);
                    });

                    pythonProcess.on('close', async (code) => {
                        if (code !== 0) {
                            reject(new Error(`Python process exited with code ${code}. Error: ${errorOutput}`));
                            return;
                        }
                        resolve();
                    });
                });


                const processedBuffer = await fs.readFile(outputFilePath);

                // Convert to base64 with proper formatting
                const base64Image = processedBuffer.toString('base64');
                results.push({
                    filename: file.originalname,
                    base64: `data:image/png;base64,${base64Image}`
                });

                // Clean up temporary files
                await Promise.all([
                    fs.unlink(inputFilePath).catch(console.error),
                    fs.unlink(outputFilePath).catch(console.error)
                ]);
                // Read the output file
                // const processedBuffer = await fs.readFile(outputFilePath);

                // // Convert to base64
                // const base64Image = processedBuffer.toString('base64');
                // results.push({
                //     filename: file.originalname,
                //     base64: `data:image/png;base64,${base64Image}`
                // });

                // // Clean up temporary files
                // await Promise.all([
                //     fs.unlink(inputFilePath).catch(console.error),
                //     fs.unlink(outputFilePath).catch(console.error)
                // ]);

            } catch (error) {
                console.error('Error processing image:', error);
                throw new Error(`Error processing image ${file.originalname}: ${error.message}`);
            }
        } else {
            throw new Error(`File type not allowed for ${file.originalname}`);
        }
    }

    return results;
}

module.exports = { backgroundRemover };