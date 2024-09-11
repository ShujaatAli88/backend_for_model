const { ipcRenderer } = require('electron');
const dotenv = require('dotenv');
// import { loadStripe } from '@stripe/stripe-js';
let Stripe = require("stripe")
let stripe = Stripe(process.env.STRIPE_PUBLIC_KEY)

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
                    email: email,
                    token: token,
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
            console.log("login function")
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
                    console.log(response.email, response.token)
                    // window.location.href = 'verify.html';
                    setTimeout("window.location.href = 'verify.html';", 3000);
                } else if (!response.hasSubscription || response.message === 'Your trial period has expired.') {

                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('userEmail', response.email);
                    localStorage.setItem('firstName', response.firstName);
                    // window.location.href = 'subscription.html';
                    setTimeout("window.location.href = 'subscription.html';", 3000);
                }
                else if (!response.subStatus || response.message === 'Your subscription period has expired.') {

                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('userEmail', response.email);
                    localStorage.setItem('firstName', response.firstName);
                    // window.location.href = 'subscription.html';
                    setTimeout("window.location.href = 'subscription.html';", 3000);
                }
                else {
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('userEmail', response.email);
                    localStorage.setItem('firstName', response.firstName);
                    // window.location.href = 'dashboard.html';
                    setTimeout("window.location.href = 'dashboard.html';", 3000);
                }
            }
            else if (!response.success) {
                message.classList.add('pop-up', 'alert', 'alert-danger');
                message.textContent = response.message;
                setTimeout(() => {
                    message.classList.add('hide');
                }, 2000);
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000)
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
                window.location.href = 'login.html';
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
