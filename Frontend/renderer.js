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
                    console.log(response.email, response.token)
                    window.location.href = 'verify.html';
                } else if (!response.hasSubscription) {
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('userEmail', response.email);
                    window.location.href = 'subscription.html';
                } else {
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('userEmail', response.email);
                    window.location.href = 'dashboard.html';
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
                window.location.href = 'verify.html';
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
                window.location.href = 'subscription.html';
            }
        })
    }
})

document.getElementById("welcome-message").innerHTML = `Welcome ${localStorage.getItem('userEmail')}`
