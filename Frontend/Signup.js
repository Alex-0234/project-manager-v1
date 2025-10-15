import { parseJwt } from './parseJwt.js';

export function SignupButtons(container) {
    /* All buttons */
    const login = document.createElement('button');
    const register = document.createElement('button');
    /* All event listeners */
    login.addEventListener('click', (e)=> {
        e.preventDefault();
        const childrenArray = Array.from(container.querySelectorAll('*'));
        const open = childrenArray.find(t => t.classList.contains('window'));
        if(open) {
             open.parentNode.removeChild(open);
        }
        /* All DOM elements */
        const modal = document.createElement('div');
        const closeIcon = document.createElementNS('http://www.w3.org/2000/svg','svg');
            const path = document.createElementNS('http://www.w3.org/2000/svg','path');
        const usernameLabel = document.createElement('label');
        const usernameInput = document.createElement('input');
        const emailInput = document.createElement('input');
        const passwordLabel = document.createElement('label');
        const passwordInput = document.createElement('input');
        const confirmLogin = document.createElement('button');

        /* Setting CSS / properties */
        modal.classList.add('login-window');
        modal.classList.add('window');
        path.setAttribute('d', 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z');
        closeIcon.setAttribute('height', '20px');
        closeIcon.setAttribute('width', '20px');
        closeIcon.setAttribute('viewBox', '0 0 24 24');
        closeIcon.classList.add('close-icon');
         /* Username */
        usernameLabel.classList.add('label');
        usernameLabel.setAttribute('for', 'login-username');
        usernameLabel.textContent = 'Username:';
        usernameInput.setAttribute('type', 'text');
        usernameInput.setAttribute('id', 'login-username');
        usernameInput.setAttribute('required', true);
        usernameInput.classList.add('username');
        /* Password */
        passwordLabel.classList.add('label');
        passwordLabel.setAttribute('for', 'login-password');
        passwordLabel.textContent = 'Password:';
        passwordInput.setAttribute('type', 'password');
        passwordInput.setAttribute('id', 'login-password');
        passwordInput.setAttribute('required', true);
        passwordInput.classList.add('password');

        confirmLogin.classList.add('confirm');
        confirmLogin.textContent = 'Login';
        /* Event listeners */
        closeIcon.addEventListener('click', ()=> {
            modal.remove();
        })
        confirmLogin.addEventListener('click', async(e)=> {
        e.preventDefault();

        const username = document.querySelector('.username');
        const email = document.querySelector('.email');
        const password = document.querySelector('.password');  /* Can add email toggle later */ 

        const user = {
            username: username.value,
            password: password.value
            }

        const response = await fetch('http://localhost:5000/users/login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
            });

            const data = await response.json();
            console.log(data.token); 
            localStorage.setItem('token', data.token); 

            location.reload();
        });
        /* Appending all */
        closeIcon.appendChild(path);
        modal.appendChild(closeIcon);
        modal.appendChild(usernameLabel);
        modal.appendChild(usernameInput);
        modal.appendChild(passwordLabel);
        modal.appendChild(passwordInput);
        modal.appendChild(confirmLogin);
        container.appendChild(modal);
    })
    register.addEventListener('click', (e)=> {
        e.preventDefault();
        const childrenArray = Array.from(container.querySelectorAll('*'));
        const open = childrenArray.find(t => t.classList.contains('window'));
        if(open) {
             open.parentNode.removeChild(open);
        }
        /* All DOM elements */
        const modal = document.createElement('div');
        const closeIcon = document.createElementNS('http://www.w3.org/2000/svg','svg');
            const path = document.createElementNS('http://www.w3.org/2000/svg','path');
        const usernameLabel = document.createElement('label');
        const usernameInput = document.createElement('input');
        const emailLabel = document.createElement('label');
        const emailInput = document.createElement('input');
        const passwordLabel = document.createElement('label');
        const passwordInput = document.createElement('input');
        const confirmRegister = document.createElement('button');
        /* Setting CSS / properties */
        modal.classList.add('register-window');
        modal.classList.add('window');
        path.setAttribute('d', 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z');
        closeIcon.setAttribute('height', '20px');
        closeIcon.setAttribute('width', '20px');
        closeIcon.setAttribute('viewBox', '0 0 24 24');
        closeIcon.classList.add('close-icon');
        /* Username */
        usernameLabel.classList.add('label');
        usernameLabel.setAttribute('for', 'register-username');
        usernameLabel.textContent = 'Username:';
        usernameInput.setAttribute('type', 'text');
        usernameInput.setAttribute('id', 'register-username');
        usernameInput.setAttribute('required', true);
        usernameInput.classList.add('username');
        /* Email */
        emailLabel.classList.add('label');
        emailLabel.setAttribute('for', 'register-email');
        emailLabel.textContent = 'Email:';
        emailInput.setAttribute('type', 'email');
        emailInput.setAttribute('id', 'register-email');
        emailInput.setAttribute('required', true);
        emailInput.classList.add('email');
        /* Password */
        passwordLabel.classList.add('label');
        passwordLabel.setAttribute('for', 'register-password');
        passwordLabel.textContent = 'Password:';
        passwordInput.setAttribute('type', 'password');
        passwordInput.setAttribute('id', 'register-password');
        passwordInput.setAttribute('required', true);
        passwordInput.classList.add('password');

        confirmRegister.classList.add('confirm');
        confirmRegister.textContent = 'Register';
        /* Event listeners */
        closeIcon.addEventListener('click', ()=> {
            modal.remove();
        })
        confirmRegister.addEventListener('click', async (e)=> {
            e.preventDefault();

        const username = document.querySelector('.username');
        const email = document.querySelector('.email');
        const password = document.querySelector('.password');

        const user = {
            username: username.value,
            email: email.value,
            password: password.value
            };

        const response = await fetch('http://localhost:5000/users/register', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
            });
            const data = await response.json();
            console.log(data.token); 
            localStorage.setItem('token', data.token); 

        location.reload();
        });
        /* Appending all */
        closeIcon.appendChild(path);
        modal.appendChild(closeIcon);
        modal.appendChild(usernameLabel);
        modal.appendChild(usernameInput);
        modal.appendChild(emailLabel);
        modal.appendChild(emailInput);
        modal.appendChild(passwordLabel);
        modal.appendChild(passwordInput);
        modal.appendChild(confirmRegister);
        container.appendChild(modal);
    })
    /* CSS / Visuals */
    login.classList.add('main-page-login-button');
    login.textContent = 'Login';
    register.classList.add('main-page-register-button');
    register.textContent = 'Register';

    /* Final appending */
    container.appendChild(login);
    container.appendChild(register);
}
export function Profile(container) {
    /* DOM elements */
    const logout = document.createElement('button');
    const avatar = document.createElement('img');
    const usernameOut = document.createElement('h3');
    /* CSS / Visuals */
    logout.classList.add('logout-button');
    logout.textContent = 'Logout';
    avatar.classList.add('avatar');
    usernameOut.classList.add('active-user');
    const token = localStorage.getItem('token');
     if (!token) return;
     const decoded = parseJwt(token);
    usernameOut.textContent = `${decoded.username}`;
    /* Event listeners */
    logout.addEventListener('click', () => {
        localStorage.removeItem('token');
        console.log('User has been logged out');
        container.removeChild(avatar);
        container.removeChild(usernameOut);
        container.removeChild(logout);
        /* Rendering login / register buttons */
        SignupButtons(container);
        location.reload();
    })
    /* Final appending */
    container.appendChild(avatar);
    container.appendChild(usernameOut);
    container.appendChild(logout);
}
