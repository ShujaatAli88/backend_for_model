const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const message = document.getElementById('message');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            ipcRenderer.send('login', { username, password });
        });

        ipcRenderer.on('login-response', (event, response) => {
            message.textContent = response.message;
            if (response.success) {
                // Redirect to a dashboard or home page
                alert('Login successful!');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            ipcRenderer.send('register', { username, password });
        });

        ipcRenderer.on('register-response', (event, response) => {
            message.textContent = response.message;
            if (response.success) {
                // Redirect to login page or show success message
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            }
        });
    }
});