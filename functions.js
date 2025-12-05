export function createElement(el, className, text = '', attributes = {}) {
    const element = document.createElement(el);

    if (className) {
        element.classList.add(className);
    }

    element.textContent = text;

    for (const key in attributes) {
        if (Object.hasOwnProperty.call(attributes, key)) {
            element.setAttribute(key, attributes[key]);
        }
    }

    return element;
}
export function createElementNS(el, className, attributes = {}) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', el);
    element.classList.add(className);

    for (const key in attributes) {
        if (Object.hasOwnProperty.call(attributes, key)) {
            element.setAttribute(key, attributes[key]);
        }
    }
    return element;
}
export function SignupWrapper(events) {
    const wrapper = createElement('div', 'signup-wrapper');
    const signup = createElement('button', 'header-button', 'Sign-up');
    const login = createElement('button', 'header-button', 'Log-in');

    signup.addEventListener('click', () => {
        events.emit('UI:render:window', 'sign-up');
    })
    login.addEventListener('click', () => {
        events.emit('UI:render:window', 'log-in');
    })
    wrapper.append(login, signup);
    document.querySelector('.main-page-user').appendChild(wrapper);
}
export function renderWindow(events, type) {

    const modal = createElement('div','signup-modal','',{

    })
    const emailInput = createElement('input','email-input','',{
        placeholder: 'Email',
    })
    const usernameInput = createElement('input','username-input','',{
        placeholder: 'Username',
    })
    const passwordInput = createElement('input','password-input','',{
        placeholder: 'Password',
    })
    const Submit = createElement('button','signup-button');

    Submit.addEventListener('click', () => {
        const user = {
            username: usernameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        }
        if (type === 'sign-up') {
            events.emit('user:register:attempt', user);
        }
        else if (type === 'log-in') {
            events.emit('user:login:attempt', user);
        }
        
    })

    modal.append(usernameInput, emailInput, passwordInput, Submit);
    document.body.appendChild(modal);
    
    return modal;
}