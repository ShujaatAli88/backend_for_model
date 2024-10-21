const { ipcRenderer } = require('electron');
const dotenv = require('dotenv');

dotenv.config();

// async function loadStripe(key) {
//     return new Promise((resolve, reject) => {
//         if (window.Stripe) {
//             resolve(window.Stripe(key));
//         } else {
//             document.querySelector('script[src="https://js.stripe.com/v3/"]').addEventListener('load', () => {
//                 resolve(window.Stripe(key));
//             });
//         }
//     });
// }

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    // const message = document.getElementById('message');
    const verifyForm = document.getElementById('verifyForm');
    const resendVerifyForm = document.getElementById('resendVerifyForm');
    const logout = document.getElementById('logout');
    const message = document.getElementById('message');
    const freeTrial = document.getElementById('freeTrial');
    const monthlySub = document.getElementById('monthlySub');
    const upgrade = document.getElementById('upgrade');
    // const data = {}
    let authCredentials = {}
    // const stripe = loadStripe(process.env.STRIPE_PUBLIC_KEY);
    // const elements = stripe.elements();
    // const cardElement = elements.create('card');
    // cardElement.mount('#card-element');
    const yearlySub = document.getElementById('yearlySub');
    // const monthlySub = document.getElementById('monthlySub');
    // const stripeInstance = stripe(process.env.STRIPE_PUBLIC_KEY);
    // const elements = stripe.elements();
    // const cardElement = elements.create('card');
    // cardElement.mount('#card-element');

    const form = document.getElementById('payment-form');
    const submitButton = document.getElementById('submit-button');
    // const paymentType = document.getElementById('price-select');

    const uploadArea = document.getElementById('upload-area');
    const imageUpload = document.getElementById('image-upload');
    const uploadedImageContainer = document.getElementById('uploaded-image-container');
    const processBtn = document.getElementById('process-btn');
    const processedImageContainer = document.getElementById('processed-image-container');

    // if (uploadArea && imageUpload && processBtn) {
    //     uploadArea.addEventListener('click', () => {
    //         imageUpload.click();
    //     });

    //     imageUpload.addEventListener('change', (event) => {
    //         const file = imageUpload.files[0]; // Select the first file only
    //         if (file) {
    //             const reader = new FileReader();
    //             reader.onload = (e) => {
    //                 uploadedImageContainer.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image">`;
    //                 processBtn.disabled = false; // Enable the process button
    //             };
    //             reader.readAsDataURL(file); // Read the first file
    //         }
    //     });

    //     const token = localStorage.getItem('authToken');

    //     processBtn.addEventListener('click', async () => {
    //         try {
    //             processBtn.disabled = true;
    //             processBtn.textContent = 'Processing...';

    //             const file = imageUpload.files[0];

    //             if (!file) {
    //                 // alert('Please upload an image first.');
    //                 message.classList.add('pop-up', 'alert', 'alert-danger');
    //                 message.textContent = 'Please upload an image first.';
    //                 setTimeout(() => {
    //                     message.classList.add('hide');
    //                 }, 2000);
    //                 return;
    //             }

    //             const reader = new FileReader();
    //             reader.onload = () => {
    //                 const imageBuffer = reader.result; // Get the file content as ArrayBuffer or base64 string

    //                 // Send the image buffer to the main process via ipcRenderer
    //                 ipcRenderer.send('remove-background', {
    //                     token,
    //                     imageBuffer, // Send the image content
    //                     fileName: file.name // Include the file name
    //                 })
    //                 // Create FormData for the image file
    //                 // const formData = new FormData();
    //                 // formData.append('file', file); // The backend API will expect a 'file' field

    //                 // ipcRenderer.send('remove-background', {
    //                 //     token,
    //                 //     formData
    //                 // })
    //                 ipcRenderer.on('remove-background-result', (event, response) => {
    //                     if (response.success) {
    //                         // Display the processed image
    //                         // message.textContent = 'Processing complete!';
    //                         message.classList.add('pop-up', 'alert', 'alert-danger');
    //                         message.textContent = response.message;
    //                         setTimeout(() => {
    //                             message.classList.add('hide');
    //                         }, 2000);
    //                         // displayResult(result.processedImageUrl); // Assuming backend returns a URL
    //                         displayResult(response.images); // Assuming backend returns a URL
    //                     } else if (!response.success && response.message === 'Not Authorized' || 'Not Authorized, No Token') {
    //                         message.classList.add('pop-up', 'alert', 'alert-danger');
    //                         console.log('Error: ', response.message)
    //                         message.textContent = response.message;
    //                         setTimeout(() => {
    //                             message.classList.add('hide');
    //                         }, 2000);
    //                         // throw new Error(result.message || 'Failed to process the image');
    //                         setTimeout("window.location.href = 'dashboard.html';", 3000);
    //                     }
    //                 })
    //             };

    //             // Start reading the file as an ArrayBuffer (or Data URL)
    //             reader.readAsArrayBuffer(file);
    //             // const response = await fetch('http://localhost:3000/api/remove-background', {
    //             //     method: 'POST',
    //             //     headers: {
    //             //         'Authorization': `Bearer ${token}`
    //             //     },
    //             //     body: formData // Send the form data with the image
    //             // });

    //             // const result = await response.json();

    //         } catch (error) {
    //             message.classList.add('pop-up', 'alert', 'alert-danger');
    //             message.textContent = error.message || 'An error occurred while processing the image';
    //         } finally {
    //             processBtn.disabled = false;
    //             processBtn.textContent = 'Process Image';
    //         }
    //     });
    // }
    if (uploadArea && imageUpload && processBtn) {
        uploadArea.addEventListener('click', () => {
            imageUpload.click();
        });

        imageUpload.addEventListener('change', (event) => {
            const file = imageUpload.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    uploadedImageContainer.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image">`;
                    processBtn.disabled = false;
                };
                reader.readAsDataURL(file);
            }
        });

        const token = localStorage.getItem('authToken');

        processBtn.addEventListener('click', async () => {
            try {
                processBtn.disabled = true;
                processBtn.textContent = 'Processing...';

                const file = imageUpload.files[0];

                if (!file) {
                    message.classList.add('pop-up', 'alert', 'alert-danger');
                    message.textContent = 'Please upload an image first.';
                    setTimeout(() => {
                        message.classList.add('hide');
                    }, 2000);
                    return;
                }

                const reader = new FileReader();
                reader.onload = async () => {
                    // Convert ArrayBuffer to Base64
                    const base64Image = arrayBufferToBase64(reader.result);

                    // Send the base64 image to main process
                    ipcRenderer.send('remove-background', {
                        token,
                        imageBuffer: base64Image,
                        fileName: file.name
                    });
                };

                // Listen for the response
                // ipcRenderer.on('remove-background-result', (event, response) => {
                //     if (response.success) {
                //         message.classList.add('pop-up', 'alert', 'alert-success');
                //         message.textContent = response.message;
                //         setTimeout(() => {
                //             message.classList.add('hide');
                //         }, 2000);
                //         displayResult(response.images);
                //     } else if (!response.success && (response.message === 'Not Authorized' || response.message === 'Not Authorized, No Token')) {
                //         message.classList.add('pop-up', 'alert', 'alert-danger');
                //         console.log('Error: ', response.message);
                //         message.textContent = response.message;
                //         setTimeout(() => {
                //             message.classList.add('hide');
                //         }, 2000);
                //         setTimeout(() => {
                //             window.location.href = 'dashboard.html';
                //         }, 3000);
                //     }
                // });
                // Listen for the response
                ipcRenderer.on('remove-background-result', (event, response) => {
                    if (response.success && response.images && response.images.length > 0) {
                        message.classList.add('pop-up', 'alert', 'alert-success');
                        message.textContent = response.message;
                        setTimeout(() => {
                            message.classList.add('hide');
                        }, 2000);
                        displayResult(response.images);
                    } else if (!response.success && (response.message === 'Not Authorized' || response.message === 'Not Authorized, No Token')) {
                        message.classList.add('pop-up', 'alert', 'alert-danger');
                        console.log('Error: ', response.message);
                        message.textContent = response.message;
                        setTimeout(() => {
                            message.classList.add('hide');
                        }, 2000);
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }, 3000);
                    } else {
                        message.classList.add('pop-up', 'alert', 'alert-danger');
                        message.textContent = response.message || 'Error processing image';
                        setTimeout(() => {
                            message.classList.add('hide');
                        }, 2000);
                    }
                });
                reader.readAsArrayBuffer(file);
            } catch (error) {
                message.classList.add('pop-up', 'alert', 'alert-danger');
                message.textContent = error.message || 'An error occurred while processing the image';
            } finally {
                processBtn.disabled = false;
                processBtn.textContent = 'Process Image';
            }
        });
    }

    // Helper function to convert ArrayBuffer to Base64
    function arrayBufferToBase64(buffer) {
        const binary = new Uint8Array(buffer);
        const bytes = binary.reduce((data, byte) => data + String.fromCharCode(byte), '');
        return btoa(bytes);
    }

    function displayResult(images) {
        if (Array.isArray(images) && images.length > 0) {
            const image = images[0]; // Get first image if multiple
            processedImageContainer.innerHTML = `
                <h3>Processed Image:</h3>
                <img src="${image.base64}" alt="Processed Image">
                <button class="download-btn" onclick="saveImage('${image.filename}', '${image.base64}')">Save Image</button>
            `;
        }
    }

    // Add this function to handle image saving
    function saveImage(filename, base64Data) {
        const link = document.createElement('a');
        link.href = base64Data;
        link.download = `processed_${filename}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // function displayResult(imageUrl) {
    //     processedImageContainer.innerHTML = `
    //     <h3>Processed Image:</h3>
    //     <img src="${imageUrl}" alt="Processed Image">
    //     <button class="download-btn" onclick="saveImage('${imageUrl}')">Save Image</button>
    // `;
    // }

    // function saveImage(imageUrl) {
    //     ipcRenderer.send('save-file', imageUrl); // Send the URL to main process to save the file
    // }

    // if (uploadArea && imageUpload && processBtn) {
    //     uploadArea.addEventListener('click', () => {
    //         imageUpload.click();
    //     });

    //     imageUpload.addEventListener('change', (event) => {
    //         const file = imageUpload.files[0]; // Select the first file only
    //         if (file) {
    //             const reader = new FileReader();
    //             reader.onload = (e) => {
    //                 uploadedImageContainer.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image">`;
    //                 processBtn.disabled = false; // Enable the process button
    //                 console.log(imageUpload.files); // See what files are selected
    //                 console.log(e.target.result); // Check if the file is correctly read
    //             };
    //             reader.readAsDataURL(file); // Read the first file
    //         }
    //     });
    //     const token = localStorage.getItem('authToken');
    //     // processBtn.addEventListener('click', () => {
    //     //     setTimeout(() => {
    //     //         const uploadedImage = uploadedImageContainer.querySelector('img');
    //     //         if (uploadedImage) {
    //     //             processedImageContainer.innerHTML = `
    //     //         <h3>Processed Image:</h3>
    //     //         <img src="${uploadedImage.src}" alt="Processed Image">
    //     //     `;
    //     //         }
    //     //     }, 1000); // Simulating processing delay
    //     // });
    //     processBtn.addEventListener('click', async () => {
    //         try {
    //             processBtn.disabled = true;
    //             // processBtn.textContent = 'Processing...';
    //             // message.innerHTML = '';

    //             // Create FormData
    //             const formData = new FormData();
    //             for (let i = 0; i < imageUpload.files.length; i++) {
    //                 formData.append('files', imageUpload.files[i]);
    //             }

    //             // Convert FormData to array of file paths
    //             const files = Array.from(imageUpload.files).map(file => file.path);

    //             // Send to main process
    //             ipcRenderer.send('remove-background', { files, token });

    //             // Listen for progress updates
    //             ipcRenderer.on('background-remove-progress', (event, data) => {
    //                 message.classList.add('pop-up', 'alert', 'alert-info');
    //                 message.textContent = `Processing: ${data.progress}%`;
    //             });

    //             // Listen for completion
    //             ipcRenderer.once('background-remove-complete', (event, response) => {
    //                 if (response.success) {
    //                     message.classList.remove('alert-info');
    //                     message.classList.add('pop-up', 'alert', 'alert-success');
    //                     message.textContent = 'Processing complete!';

    //                     if (response.files.length === 1) {
    //                         displayResult(response.files[0]);
    //                     } else {
    //                         downloadZip(response.zipPath);
    //                     }
    //                 } else {
    //                     message.classList.add('pop-up', 'alert', 'alert-danger');
    //                     message.textContent = response.error || 'Processing failed';
    //                 }
    //             });

    //             // Listen for errors
    //             ipcRenderer.once('background-remove-error', (event, error) => {
    //                 message.classList.add('pop-up', 'alert', 'alert-danger');
    //                 message.textContent = error.message || 'An error occurred';
    //             });

    //         } catch (error) {
    //             message.classList.add('pop-up', 'alert', 'alert-danger');
    //             message.textContent = 'An error occurred while processing the images';
    //         } finally {
    //             processBtn.disabled = false;
    //             processBtn.textContent = 'Process Image';
    //         }
    //     });
    // }



    // function displayResult(filePath) {
    //     processedImageContainer.innerHTML = `
    //     <h3>Processed Image:</h3>
    //     <img src="${filePath}" alt="Processed Image">
    //     <button class="download-btn" onclick="ipcRenderer.send('save-file', '${filePath}')">
    //         Save Image
    //     </button>
    // `;
    // }

    // function downloadZip(zipPath) {
    //     processedImageContainer.innerHTML = `
    //     <h3>Processing Complete:</h3>
    //     <button class="download-btn" onclick="ipcRenderer.send('save-file', '${zipPath}')">
    //         Download ZIP
    //     </button>
    // `;
    // }

    // if (form) {
    //     let elements, cardElement;

    //     (async function () {
    //         // stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY);
    //         elements = stripe.elements();
    //         cardElement = elements.create('card');
    //         cardElement.mount('#card-element');
    //     })();
    //     form.addEventListener('submit', async (event) => {
    //         event.preventDefault();
    //         submitButton.disabled = true;

    //         if (!stripe) {
    //             try {
    //                 stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY);
    //                 elements = stripe.elements();
    //                 cardElement = elements.create('card');
    //                 cardElement.mount('#card-element');
    //             } catch (error) {
    //                 console.error('Error loading Stripe:', error);
    //                 alert('Failed to load payment system. Please try again later.');
    //                 submitButton.disabled = false;
    //                 return;
    //             }
    //         }
    //         // const { paymentMethod, error } = await stripe.createPaymentMethod({
    //         //     type: 'card',
    //         //     card: cardElement,
    //         //     billing_details: {
    //         //         name: document.getElementById('name').value,
    //         //         email: document.getElementById('email').value,
    //         //     },
    //         // });

    //         try {
    //             const { paymentMethod, error } = await stripe.createPaymentMethod({
    //                 type: 'card',
    //                 card: cardElement,
    //                 billing_details: {
    //                     name: document.getElementById('name').value,
    //                     email: document.getElementById('email').value,
    //                 },
    //             });

    //             if (error) {
    //                 alert(error.message);
    //                 submitButton.disabled = false;
    //                 return;
    //             }

    //             const email = localStorage.getItem('userEmail');
    //             const token = localStorage.getItem('authToken');
    //             const priceSelect = document.getElementById('price-select');
    //             const selectedOption = priceSelect.options[priceSelect.selectedIndex];
    //             const priceId = selectedOption.value;
    //             const productName = selectedOption.textContent;

    //             ipcRenderer.send('create-subscription', {
    //                 paymentMethodId: paymentMethod.id,
    //                 name: document.getElementById('name').value,
    //                 email: email,
    //                 token: token,
    //                 productName: productName,
    //                 priceId: priceId
    //             });
    //         } catch (error) {
    //             console.error('Error processing payment:', error);
    //             alert('An error occurred while processing your payment. Please try again.');
    //             submitButton.disabled = false;
    //         }
    //     });

    //     //     if (error) {
    //     //         alert(error.message);
    //     //         submitButton.disabled = false;
    //     //         return;
    //     //     }

    //     //     const email = localStorage.getItem('userEmail');
    //     //     const token = localStorage.getItem('authToken');
    //     //     const priceSelect = document.getElementById('price-select');
    //     //     const selectedOption = priceSelect.options[priceSelect.selectedIndex];
    //     //     const priceId = selectedOption.value;
    //     //     const productName = selectedOption.textContent;

    //     //     ipcRenderer.send('create-subscription', {
    //     //         paymentMethodId: paymentMethod.id,
    //     //         name: document.getElementById('name').value,
    //     //         email: email,
    //     //         token: token,
    //     //         productName: productName,
    //     //         priceId: priceId
    //     //     });
    //     // });

    //     ipcRenderer.on('subscription-result', async (event, response) => {
    //         if (response.success) {
    //             if (response.clientSecret) {
    //                 const { error } = await stripe.confirmCardPayment(response.clientSecret);
    //                 if (error) {
    //                     alert(error.message);
    //                 } else {
    //                     alert('Success! Check your email for the invoice.');
    //                     setTimeout(() => {
    //                         window.location.href = 'dashboard.html';
    //                     }, 3000);
    //                 }
    //             } else {
    //                 alert('Success! Check your email for the invoice.');
    //                 setTimeout(() => {
    //                     window.location.href = 'dashboard.html';
    //                 }, 3000);
    //             }
    //         } else {
    //             alert(response.message || 'An error occurred. Please try again.');
    //         }
    //         submitButton.disabled = false;
    //     });
    // }
    if (monthlySub) {
        monthlySub.addEventListener("submit", (event) => {
            event.preventDefault();
            // submitButton.disabled = true;
            // console.log("entering try block")
            try {
                const email = localStorage.getItem('userEmail');
                const token = localStorage.getItem('authToken');
                // const priceSelect = document.getElementById('price-select');
                // const selectedOption = priceSelect.options[priceSelect.selectedIndex];
                const priceId = "price_1PuHu3GQqr36Qs460fS9Pvc0";
                // price_1PuHq2GQqr36Qs46jpbkwAaR
                // price_1PqK5dGQqr36Qs46jCT3Kamr
                console.log(priceId)
                // 'price_1PqK5dGQqr36Qs46jCT3Kamr'

                ipcRenderer.send('monthly-subscription', {
                    email: email,
                    token: token,
                    // productName: productName,
                    priceId: priceId
                });
            } catch (error) {
                // console.log(error)
                console.error('Error creating checkout session:', error);
                alert('An error occurred while setting up the payment. Please try again.', error);
                submitButton.disabled = false;
            }
        });

        ipcRenderer.on('monthly-subscription-result', (event, response) => {
            if (response.success && response.sessionUrl) {
                window.location = response.sessionUrl;
            } else {
                alert(response.message || 'An error occurred. Please try again.');
                submitButton.disabled = false;
            }
        });
    }

    if (yearlySub) {
        yearlySub.addEventListener("submit", (event) => {
            event.preventDefault();
            // submitButton.disabled = true;
            // console.log("entering try block")
            try {
                const email = localStorage.getItem('userEmail');
                const token = localStorage.getItem('authToken');
                // const priceSelect = document.getElementById('price-select');
                // const selectedOption = priceSelect.options[priceSelect.selectedIndex];
                const priceId = "price_1PuHucGQqr36Qs46UXec6dUw";
                // price_1PqK7JGQqr36Qs46An76ntuG
                // console.log(priceId)
                // 'price_1PqK5dGQqr36Qs46jCT3Kamr'

                ipcRenderer.send('yearly-subscription', {
                    email: email || authCredentials["email"],
                    token: token || authCredentials["token"],
                    priceId: priceId
                });
            } catch (error) {
                // console.log(error)
                console.error('Error creating checkout session:', error);
                alert('An error occurred while setting up the payment. Please try again.', error);
                submitButton.disabled = false;
            }
        });

        ipcRenderer.on('yearly-subscription-result', (event, response) => {
            if (response.success && response.sessionUrl) {
                window.location = response.sessionUrl;
            } else {
                alert(response.message || 'An error occurred. Please try again.');
                submitButton.disabled = false;
            }
        });
    }

    // if (form) {
    //     form.addEventListener('submit', async (event) => {
    //         event.preventDefault();
    //         submitButton.disabled = true;

    //         try {
    //             const email = localStorage.getItem('userEmail');
    //             const token = localStorage.getItem('authToken');
    //             const priceSelect = document.getElementById('price-select');
    //             const selectedOption = priceSelect.options[priceSelect.selectedIndex];
    //             const priceId = selectedOption.value;

    //             // 'price_1PqK5dGQqr36Qs46jCT3Kamr'
    //             const productName = selectedOption.textContent;

    //             ipcRenderer.send('create-checkout-session', {
    //                 email: email,
    //                 token: token,
    //                 // productName: productName,
    //                 priceId: priceId
    //             });
    //         } catch (error) {
    //             console.log(error)
    //             console.error('Error creating checkout session:', error);
    //             alert('An error occurred while setting up the payment. Please try again.', error);
    //             submitButton.disabled = false;
    //         }
    //     });

    //     ipcRenderer.on('checkout-session-created', (event, response) => {
    //         if (response.success && response.sessionUrl) {
    //             window.location = response.sessionUrl;
    //         } else {
    //             alert(response.message || 'An error occurred. Please try again.');
    //             submitButton.disabled = false;
    //         }
    //     });
    // }

    // ... (keep your existing code for other functionalities)


    // ... (keep your existing helper functions)
    // async function loadStripe(key) {
    //     return new Promise((resolve, reject) => {
    //         if (window.Stripe) {
    //             resolve(window.Stripe(key));
    //         } else {
    //             document.querySelector('script[src="https://js.stripe.com/v3/"]').addEventListener('load', () => {
    //                 resolve(window.Stripe(key));
    //             });
    //         }
    //     });
    // }
    // if (registerForm) {
    //     registerForm.addEventListener('submit', (e) => {
    //         e.preventDefault();
    //         const username = document.getElementById('username').value;
    //         const password = document.getElementById('password').value;
    //         ipcRenderer.send('register', { username, password });
    //     });

    //     ipcRenderer.on('register-response', (event, response) => {
    //         message.textContent = response.message;
    //         if (response.success) {
    //             // Redirect to login page or show success message
    //             alert('Registration successful! Please login.');
    //             window.location.href = 'login.html';
    //         }
    //     });
    // }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            localStorage.getItem('authToken')
            ipcRenderer.send('login', { email, password });
        });
        ipcRenderer.on('login-response', (event, response) => {

            if (response.success) {
                message.classList.add('pop-up', 'alert', 'alert-primary');
                message.textContent = response.message;
                if (!response.isVerified) {
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('userEmail', response.email);
                    localStorage.setItem('firstName', response.firstName);
                    authCredentials.authToken = response.token
                    authCredentials.userEmail = response.email
                    authCredentials.firstName = response.firstName
                    console.log(response.email, response.token)
                    // window.location.href = 'verify.html';
                    setTimeout("window.location.href = 'verify.html';", 3000);

                }
                // response.message === 'Your trial period has expired.'
                else if (!response.trial && !response.subStatus) {

                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('userEmail', response.email);
                    localStorage.setItem('firstName', response.firstName);
                    authCredentials.authToken = response.token
                    authCredentials.userEmail = response.email
                    authCredentials.firstName = response.firstName
                    // window.location.href = 'subscription.html';
                    setTimeout("window.location.href = 'subscription.html';", 3000);
                }
                // else if (!response.subStatus || response.message === 'Your subscription period has expired.') {
                //     localStorage.setItem('authToken', response.token);
                //     localStorage.setItem('userEmail', response.email);
                //     localStorage.setItem('firstName', response.firstName);
                //     // window.location.href = 'subscription.html';
                //     setTimeout("window.location.href = 'subscription.html';", 3000);
                // }
                // if (response.subStatus || response.hasSubscription)
                else {
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('userEmail', response.email);
                    localStorage.setItem('firstName', response.firstName);
                    authCredentials.authToken = response.token
                    authCredentials.userEmail = response.email
                    authCredentials.firstName = response.firstName
                    // sessionStorage.setItem('authToken', response.token);
                    // sessionStorage.setItem('userEmail', response.email);
                    // sessionStorage.setItem('firstName', response.firstName);
                    // if (response.trial) {
                    //     upgrade.classList.remove('hidden');
                    // }
                    // else {
                    //     upgrade.style.display = 'none';
                    // }
                    setTimeout("window.location.href = 'dashboard.html';", 3000);
                    // window.location.href = 'dashboard.html';
                }
            }
            else if (!response.success) {
                message.classList.add('pop-up', 'alert', 'alert-danger');
                message.textContent = response.message;
                if (response.message === 'Your trial period has expired.' || response.message === 'Your subscription period has expired.') {
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('userEmail', response.email);
                    localStorage.setItem('firstName', response.firstName);
                    // window.location.href = 'subscription.html';
                    setTimeout("window.location.href = 'subscription.html';", 3000);
                }
                else {
                    setTimeout(() => {
                        message.classList.add('hide');
                    }, 2000);
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1000)
                }
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            ipcRenderer.send('register', { firstName, lastName, email, password });
        });

        ipcRenderer.on('register-response', (event, response) => {
            // message.textContent = response.message;
            if (response.success) {
                message.classList.add('pop-up', 'alert', 'alert-primary');
                message.textContent = response.message;
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userEmail', response.email);
                localStorage.setItem('firstName', response.firstName);
                // window.location.href = 'verify.html';
                setTimeout("window.location.href = 'verify.html';", 3000);

            }
            else if (!response.success) {
                message.classList.add('pop-up', 'alert', 'alert-danger');
                message.textContent = response.message;
                setTimeout(() => {
                    message.classList.add('hide');
                }, 2000);
                setTimeout(() => {
                    window.location.href = 'register.html';
                }, 1000)
            }
        })
    }

    if (verifyForm) {
        verifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const code = document.getElementById('verificationCode').value;
            const email = localStorage.getItem('userEmail');
            const token = localStorage.getItem('authToken');
            console.log(token, email)
            ipcRenderer.send('verify-code', { email, code, token });
        });

        ipcRenderer.on('verify-code-response', (event, response) => {
            // message.textContent = response.message;
            if (response.success) {
                message.classList.add('pop-up', 'alert', 'alert-primary');
                message.textContent = response.message;
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userEmail', response.email);
                // window.location.href = 'subscription.html';
                setTimeout("window.location.href = 'subscription.html';", 3000);
            }
            else if (!response.success && response.message === 'Not Authorized' || 'Not Authorized, No Token') {
                message.classList.add('pop-up', 'alert', 'alert-danger');
                message.textContent = response.message;
                setTimeout("window.location.href = 'login.html';", 3000);
            }
            else if (response.succes) {
                message.classList.add('pop-up', 'alert', 'alert-danger');
                message.textContent = response.message;
                setTimeout(() => {
                    message.classList.add('hide');
                }, 2000);
                setTimeout(() => {
                    window.location.href = 'verify.html';
                }, 1000)
            }
        })
    }


    if (resendVerifyForm) {
        resendVerifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('resendCode').value;
            // const email = localStorage.getItem('userEmail');
            const token = localStorage.getItem('authToken');
            console.log(token, email)
            ipcRenderer.send('resend-code', { email, token });
        });

        ipcRenderer.on('verify-code-response', (event, response) => {
            // setTimeout("message.textContent = response.message; message.classList.add('pop-up', 'alert', 'alert-primary');", 2000)
            // message.textContent = response.message;

            if (response.success) {
                message.classList.add('pop-up', 'alert', 'alert-primary');
                message.textContent = response.message;
                // localStorage.setItem('authToken', response.token);
                // localStorage.setItem('userEmail', response.email);
                // window.location.href = 'verify.html';
                setTimeout("window.location.href = 'verify.html';", 3000);
            }
            else if (!response.success && response.message === 'Not Authorized' || 'Not Authorized, No Token') {
                message.classList.add('pop-up', 'alert', 'alert-danger');
                message.textContent = response.message;
                setTimeout("window.location.href = 'login.html';", 3000);
            }
            else if (!response.success) {
                // message.classList.add('pop-up', 'alert', 'alert-danger');
                // message.textContent = response.message;
                // setTimeout("window.location.href = 'login.html';", 3000);
                message.classList.add('pop-up', 'alert', 'alert-danger');
                message.textContent = response.message;
                setTimeout(() => {
                    message.classList.add('hide');
                }, 2000);
                setTimeout(() => {
                    window.location.href = 'resendverify.html';
                }, 1000)
            }
        })
    }
    if (logout) {
        logout.addEventListener('submit', (e) => {
            e.preventDefault();
            localStorage.clear();
            message.classList.add('pop-up', 'alert', 'alert-danger');
            message.textContent = "Logout SuccessFul";
            setTimeout(() => {
                message.classList.add('hide');
            }, 2000);
            setTimeout(() => {
                window.location.href = 'http://localhost:3000/api/login';
            }, 1000)
        })
    }

    if (freeTrial) {
        freeTrial.addEventListener('click', (e) => {
            e.preventDefault();

            const email = localStorage.getItem('userEmail');
            const token = localStorage.getItem('authToken');
            console.log(token, email)
            ipcRenderer.send('activate-trial', { email, token });
        });
        ipcRenderer.on('activate-trial', (event, response) => {
            // message.textContent = response.message;
            if (response.success) {
                message.classList.add('pop-up', 'alert', 'alert-primary');
                message.textContent = response.message;

                // localStorage.setItem('authToken', response.token);
                // localStorage.setItem('userEmail', response.email);
                // localStorage.setItem('firstName', response.firstName);
                // window.location.href = 'verify.html';
                setTimeout("window.location.href = 'dashboard.html';", 3000);

            }
            else if (!response.success) {
                message.classList.add('pop-up', 'alert', 'alert-danger');
                message.textContent = response.message;
                setTimeout(() => {
                    message.classList.add('hide');
                }, 2000);
                setTimeout(() => {
                    window.location.href = 'subscription.html';
                }, 1000)
            }
        })
    }
    //     if (yearlySub) {
    //     // const Stripe = async () => {
    //     //     const stripe = await stripe(process.env.STRIPE_PUBLIC_KEY)
    //     //     return stripe
    //     // }
    //     yearlySub.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         const email = localStorage.getItem('userEmail');
    //         const token = localStorage.getItem('authToken');
    //         console.log(token, email)
    //         // const body = {
    //         //     productName: 'Yearly Subsciption',
    //         //     productPrice: 4444.8
    //         // }
    //         // const headers = {
    //         //     "Content-Type": "application/json"
    //         // }

    //         const productName = 'Yearly Plan';
    //         const productPrice = 4444.8
    //         ipcRenderer.send('yearly-subscription', { email, token, productName, productPrice });
    //     });
    //     ipcRenderer.on('yearly-subscription', (event, response) => {
    //         // message.textContent = response.message;
    //         if (response.success) {
    //             message.classList.add('pop-up', 'alert', 'alert-primary');
    //             message.textContent = response.message;
    //             // localStorage.setItem('authToken', response.token);
    //             // localStorage.setItem('userEmail', response.email);
    //             // localStorage.setItem('firstName', response.firstName);
    //             // window.location.href = 'verify.html';
    //             // setTimeout
    //             const result = stripe.redirectToCheckout({
    //                 sessionId: response.session.id
    //             })
    //             if (result.error) {
    //                 console.log(result.error)
    //             }
    //             else {
    //                 setTimeout("window.location.href = 'dashboard.html';", 3000);
    //             }
    //         }
    //         else if (!response.success) {
    //             message.classList.add('pop-up', 'alert', 'alert-danger');
    //             message.textContent = response.message;
    //             setTimeout(() => {
    //                 message.classList.add('hide');
    //             }, 2000);
    //             setTimeout(() => {
    //                 window.location.href = 'subscription.html';
    //             }, 1000)
    //         }
    //     })
    // }
    // if (form) {
    //     (async function () {
    //         const stripeInstance = await stripe;

    //         // const elements = stripeInstance.elements();
    //         console.log(elements)
    //         // const cardElement = elements.create('card');
    //         // cardElement.mount('#card-element');
    //         form.addEventListener('submit', async (event) => {
    //             event.preventDefault();
    //             submitButton.disabled = true;
    //             const { paymentMethod, error } = await stripeInstance.createPaymentMethod({
    //                 type: 'card',
    //                 card: cardElement,
    //                 billing_details: {
    //                     name: document.getElementById('name').value,
    //                     email: document.getElementById('email').value,
    //                 },
    //             });

    //             if (error) {
    //                 alert(error.message);
    //                 submitButton.disabled = false;
    //                 return;
    //             }

    //             const email = localStorage.getItem('userEmail');
    //             const token = localStorage.getItem('authToken');
    //             const productName = '';
    //             const productPrice = 0;
    //             const priceId = '';
    //             const payment = paymentType

    //             for (let i = 0; i < payment.length; i++) {
    //                 let option = a.options[i];
    //                 if (option.value == "Monthly Plan - €463/month") {
    //                     productName = 'Monthly plan';
    //                     productPrice = 463;
    //                     priceId = 'price_1PqK5dGQqr36Qs46jCT3Kamr'
    //                 }
    //                 else if (option.value == "Yearly Plan - €4444.8/year") {
    //                     productName = 'Yearly plan';
    //                     productPrice = 4444.8;
    //                     priceId = 'price_1PqK7JGQqr36Qs46An76ntuG'
    //                 }
    //             }
    //             // if (paymentType === "Monthly Plan - €463/month") {
    //             //     productName = 'Monthly plan';
    //             //     productPrice = 463;
    //             //     priceId = 'price_1PqK5dGQqr36Qs46jCT3Kamr'
    //             // }
    //             // else if (paymentType === "Yearly Plan - €4444.8/year") {
    //             //     productName = 'Yearly plan';
    //             //     productPrice = 4444.8;
    //             //     priceId = 'price_1PqK7JGQqr36Qs46An76ntuG'
    //             // }

    //             ipcRenderer.send('create-subscription', {
    //                 paymentMethodId: paymentMethod.id,
    //                 name: document.getElementById('name').value,
    //                 email: email,
    //                 token: token,
    //                 productName: productName,
    //                 productPrice: productPrice,
    //                 priceId: priceId
    //             });
    //         });

    //         ipcRenderer.on('subscription-result', (event, response) => {
    //             if (response.success) {
    //                 if (response.clientSecret) {
    //                     stripe.confirmCardPayment(response.clientSecret)
    //                         .then(result => {
    //                             if (result.error) {
    //                                 alert(result.error.message);
    //                             } else {
    //                                 alert('Success! Check your email for the invoice.');
    //                                 setTimeout(() => {
    //                                     window.location.href = 'dashboard.html';
    //                                 }, 3000);
    //                             }
    //                         });
    //                 } else {
    //                     alert('Success! Check your email for the invoice.');
    //                     setTimeout(() => {
    //                         window.location.href = 'dashboard.html';
    //                     }, 3000);
    //                 }
    //             } else {
    //                 alert(response.message || 'An error occurred. Please try again.');
    //             }
    //             submitButton.disabled = false;
    //         });
    //     })()
    // }
    // if (yearlySub) {
    //     // const Stripe = async () => {
    //     //     const stripe = await stripe(process.env.STRIPE_PUBLIC_KEY)
    //     //     return stripe
    //     // }
    //     yearlySub.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         const email = localStorage.getItem('userEmail');
    //         const token = localStorage.getItem('authToken');
    //         console.log(token, email)
    //         // const body = {
    //         //     productName: 'Yearly Subsciption',
    //         //     productPrice: 4444.8
    //         // }
    //         // const headers = {
    //         //     "Content-Type": "application/json"
    //         // }

    //         const productName = 'Yearly Plan';
    //         const productPrice = 4444.8
    //         ipcRenderer.send('yearly-subscription', { email, token, productName, productPrice });
    //     });
    //     ipcRenderer.on('yearly-subscription', (event, response) => {
    //         // message.textContent = response.message;
    //         if (response.success) {
    //             message.classList.add('pop-up', 'alert', 'alert-primary');
    //             message.textContent = response.message;
    //             // localStorage.setItem('authToken', response.token);
    //             // localStorage.setItem('userEmail', response.email);
    //             // localStorage.setItem('firstName', response.firstName);
    //             // window.location.href = 'verify.html';
    //             // setTimeout
    //             const result = stripe.redirectToCheckout({
    //                 sessionId: response.session.id
    //             })
    //             if (result.error) {
    //                 console.log(result.error)
    //             }
    //             else {
    //                 setTimeout("window.location.href = 'dashboard.html';", 3000);
    //             }
    //         }
    //         else if (!response.success) {
    //             message.classList.add('pop-up', 'alert', 'alert-danger');
    //             message.textContent = response.message;
    //             setTimeout(() => {
    //                 message.classList.add('hide');
    //             }, 2000);
    //             setTimeout(() => {
    //                 window.location.href = 'subscription.html';
    //             }, 1000)
    //         }
    //     })
    // }


})

document.getElementById("welcome-message").innerHTML = `Welcome ${localStorage.getItem('firstName')}`


// (function () {

//     'use strict';

//     var elToggle = document.querySelector('#formCheck'),
//         passwordInput = document.getElementById('password');

//     elToggle.addEventListener('click', (e) => {
//         e.preventDefault();

//         if (elToggle.classList.contains('active')) {
//             passwordInput.setAttribute('type', 'password');
//             elToggle.classList.remove('active');
//         } else {
//             passwordInput.setAttribute('type', 'text');
//             elToggle.classList.add('active');
//         }
//     })

// })()

function showPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}


// async function loadStripe(key) {
//     return new Promise((resolve, reject) => {
//         if (window.Stripe) {
//             resolve(window.Stripe(key));
//         } else {
//             document.querySelector('script[src="https://js.stripe.com/v3/"]').addEventListener('load', () => {
//                 resolve(window.Stripe(key));
//             });
//         }
//     });
// }

// (async function () {
//     stripe = await loadStripe(pk_test_51PeLrvGQqr36Qs46HEU1SLOkkajz5x6p2OgrxZHnA7xuoqGuEbjKPLW6soYEBHLJ0oCc5ECKvOtwHZ8VsW7mjejd00WkLPe8YY);
//     elements = stripe.elements();
//     cardElement = elements.create('card');
//     cardElement.mount('#card-element');
// })()
