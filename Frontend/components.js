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

export function createCloseIcon() {
    const icon = createElementNS('svg','close-icon',{
        height: '20px',
        width: '20px',
        stroke: 'black',
        viewbox: '0 0 20 20',
    });
    const path = createElementNS('path','close-icon-path',{
        d: 'M18 6L6 18M6 6l12 12'
    });
    icon.appendChild(path);
    return icon;
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

export function userWrapper(events, user) {
    const wrapper = createElement('div', 'user-wrapper');
    const profileLink = createElement('a', 'user-link',`${user.username}`);

    profileLink.addEventListener('click', ()=> {
        document.querySelector('.user-options').classList.toggle('invisible')

    });
    wrapper.appendChild(profileLink);
    document.querySelector('.main-page-user').appendChild(wrapper);
}

export function mobileViewProjectList(events) {
    const modal = createElement('div','mobile-project-list-window','',{

    });
    const projectSlider = createElement('div','mobile-project-list','',{

    })
    modal.appendChild(projectSlider);
    document.body.appendChild(modal);
    return modal;
}

export function renderWindow(events, param) {
    const type = param;
    let modal;

    const closeIcon = createCloseIcon();
    closeIcon.addEventListener('click', () => {
        modal.remove();
    });

    if (type === 'projectSetup') {
        modal = createElement('div','project-setup-modal','',{ });
        const projectNameInput = createElement('input','project-name-input','',{
            placeholder: 'Project Name',
            name: 'project-name',
            required: true,
        });
        const projectDescInput = createElement('textarea','project-desc-input','',{
            placeholder: 'Project Description',
            name: 'project-desc',
            required: true,
        });

        const Create = createElement('button','create-button');

        modal.append(closeIcon, projectNameInput, projectDescInput, Create);
        document.body.appendChild(modal);
        return modal;
    }
    else if (type === 'sign-up') {
        modal = createElement('div','signup-modal','',{ });
        const emailInput = createElement('input','email-input','',{
            placeholder: 'Email',
            name: 'email',
            required: true, 
        });
        const usernameInput = createElement('input','username-input','',{
            placeholder: 'Username',
            name: 'username',
            required: true,
        });
        const passwordInput = createElement('input','password-input','',{
            placeholder: 'Password',
            name: 'password',
            required: true,
        });
        const Submit = createElement('button','signup-button');

        Submit.addEventListener('click', () => {
            const user = {
                username: usernameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            }
            events.emit('user:register:attempt', user);
        })

        modal.append(closeIcon, usernameInput, emailInput, passwordInput, Submit);
        document.body.appendChild(modal);
        return modal;

    }
    else if (type === 'log-in') {
        const modal = createElement('div','login-modal','',{ });
        const usernameInput = createElement('input','username-input','',{
            placeholder: 'Username',
            name: 'username',
            required: true,
        });
        const passwordInput = createElement('input','password-input','',{
            placeholder: 'Password',
            name: 'password',
            required: true,
        });
        const Submit = createElement('button','login-button');
        Submit.addEventListener('click', () => {
               const user = {
                username: usernameInput.value,
                password: passwordInput.value
            }
            events.emit('user:login:attempt', user);
            modal.remove();
        })

        modal.append(closeIcon, usernameInput, passwordInput, Submit);
        document.body.appendChild(modal);
        return modal;
    }
    
    
}
