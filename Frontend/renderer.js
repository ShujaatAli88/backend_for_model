const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    // const message = document.getElementById('message');
    const verifyForm = document.getElementById('verifyForm');
    const resendVerifyForm = document.getElementById('resendVerifyForm');
    const logout = document.getElementById('logout');
    const message = document.getElementById('message');
    const freeTrial = document.getElementById('freeTrial');
    const yearlySub = document.getElementById('yearlySub');
    const monthlySub = document.getElementById('monthlySub');

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
            // setTimeout("message.textContent = response.message; message.classList.add('pop-up', 'alert', 'alert-primary');", 2000)
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
                } else if (!response.hasSubscription) {

                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('userEmail', response.email);
                    localStorage.setItem('firstName', response.firstName);
                    // window.location.href = 'subscription.html';
                    setTimeout("window.location.href = 'subscription.html';", 3000);
                } else {
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
    if (yearlySub) {
        yearlySub.addEventListener('click', (e) => {
            e.preventDefault();
            const email = localStorage.getItem('userEmail');
            const token = localStorage.getItem('authToken');
            console.log(token, email)
            const productName = 'Yearly Subsciption';
            const productPrice = 4444.8 + 755.616
            ipcRenderer.send('yearly-subscription', { email, token, productName, productPrice });
        });
        ipcRenderer.on('yearly-subscription', (event, response) => {
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
    if (monthlySub) {
        monthlySub.addEventListener('click', (e) => {
            e.preventDefault();
            const email = localStorage.getItem('userEmail');
            const token = localStorage.getItem('authToken');
            console.log(token, email)
            const productName = 'Monthly Subsciption';
            const productPrice = 463 + 78.71
            ipcRenderer.send('monthly-subscription', { email, token, productName, productPrice });
        });
        ipcRenderer.on('monthly-subscription', (event, response) => {
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