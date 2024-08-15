const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    // const message = document.getElementById('message');
    const verifyForm = document.getElementById('verifyForm');
    const message = document.getElementById('message');

    // if (loginForm) {
    //     loginForm.addEventListener('submit', (e) => {
    //         e.preventDefault();
    //         const username = document.getElementById('username').value;
    //         const password = document.getElementById('password').value;
    //         ipcRenderer.send('login', { username, password });
    //     });

    //     ipcRenderer.on('login-response', (event, response) => {
    //         message.textContent = response.message;
    //         if (response.success) {
    //             // Redirect to a dashboard or home page
    //             alert('Login successful!');
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
            message.textContent = response.message;
            if (response.success) {
                if (!response.isVerified) {
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('userEmail', response.email);
                    localStorage.setItem('firstName', response.firstName);
                    console.log(response.email, response.token)
                    // window.location.href = 'verify.html';
                    setTimeout("window.location.href = 'verify.html';", 5000);
                } else if (!response.hasSubscription) {
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('userEmail', response.email);
                    localStorage.setItem('firstName', response.firstName);
                    // window.location.href = 'subscription.html';
                    setTimeout("window.location.href = 'subscription.html';", 5000);
                } else {
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('userEmail', response.email);
                    localStorage.setItem('firstName', response.firstName);
                    // window.location.href = 'dashboard.html';
                    setTimeout("window.location.href = 'dashboard.html';", 5000);
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
            message.textContent = response.message;
            if (response.success) {
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userEmail', response.email);
                localStorage.setItem('firstName', response.firstName);
                // window.location.href = 'verify.html';
                setTimeout("window.location.href = 'verify.html';", 5000);

            }
        });
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
            message.textContent = response.message;
            if (response.success) {
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userEmail', response.email);
                // window.location.href = 'subscription.html';
                setTimeout("window.location.href = 'subscription.html';", 5000);
            }
            else if (!response.success || response.message === 'Not Authorized' || 'Not Authorized, No Token') {
                setTimeout("window.location.href = 'login.html';", 5000);
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
            ipcRenderer.send('verify-code', { email, token });
        });

        ipcRenderer.on('verify-code-response', (event, response) => {
            message.textContent = response.message;
            if (response.success) {
                // localStorage.setItem('authToken', response.token);
                // localStorage.setItem('userEmail', response.email);
                // window.location.href = 'verify.html';
                setTimeout("window.location.href = 'verify.html';", 5000);
            }
            else if (!response.success || response.message === 'Not Authorized' || 'Not Authorized, No Token') {
                setTimeout("window.location.href = 'login.html';", 5000);
            }
        })
    }
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

// document.addEventListener()