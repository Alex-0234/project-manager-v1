import { SignupWrapper, renderWindow } from '../functions.js';

document.addEventListener('DOMContentLoaded', () => {
    //localStorage.removeItem('token');
    const events = new Emitter();
    const projectManager = new ProjectManager(events);
    const UI = new UIManager(events);
    const User = new Auth(events);
    
    const menu = document.querySelector('.menu-icon');
    menu.addEventListener('click', ()=> {
        events.emit('UI:project:list');
    })

    User.init();

})





class Emitter {
    constructor() {
        this.listeners = {};
    }
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    emit(event, payload) {
        for (const callback of this.listeners[event]) {
            callback(payload);
        }
    }
    disconnect(event) {
        if (!this.listeners[event]) return;

        delete this.listeners[event];
    }
}

class Auth {
    constructor(events) {
        this.events = events;

        this.data = new Proxy({userId: null, username: null, token: null}, {
            set: (target, prop, value) => {
                target[prop] = value;
                if(prop === 'username') {
                    this.events.emit('user:change', {
                        userId: this.data.userId,
                        username: this.data.username,
                        token: this.data.token
                    });
                }
            }
        });
        console.log(this.data)
        this.loadEvents();
    }
    loadEvents() {
        this.events.on('user:register:attempt', (payload) => {
            const { username, email, password } = payload;
            this.register(username, email, password)
        })
        this.events.on('user:register:success', (payload) => {
            const { username, email, password } = payload;
            if (!email && !username) return;
            if (!email && username) {
                this.login(username, password);
            }
            else {
                console.log('Use username pls')
            }
            // Logic to login maybe ??? Could do it in the register event itself..
        })
        this.events.on('user:register:failed', () => {
            // Like a pop-up message ig.
        })
        this.events.on('user:login:attempt', (payload) => {
            const { username, email, password } = payload;
            this.login(username, email, password);
        })
        this.events.on('user:login:failed', () => {

        })
        this.events.on('user:login:success', ()=> {
            this.events.diconnect('user:register:success');
            this.events.diconnect('user:register:attempt');
            this.events.diconnect('user:register:failed');
            this.events.diconnect('user:login:attempt');
            this.events.diconnect('user:login:success');
        })
        this.events.on('user:change', ()=> {

        })
    }
    async init() {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await fetch('http://localhost:5000/user/token/decrypt',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token })
            }); 
            if (response.ok) {
                const data = await response.json();
                this.events.emit('UI:render:user', data);
            }
            else {
                this.events.emit('UI:render:signup');
            }
        }
        else {
            this.events.emit('UI:render:signup');
        }
    }
    async login(username, password, token = null) {
        if(!password && !token) return;

        const response = await fetch('http://localhost:5000/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password }),

        })
        if (response.ok) {
            const data = await response.json();
            this.events.emit('user:login:success', data);
            const { userId, username, token } = data;
            this.data.userId = userId;
            this.data.username = username;
            this.data.token = token;
            
        }
        else {
            this.events.emit('user:login:failed');
        }
    }
    async register(username, email, password) {
        const response = await fetch('http://localhost:5000/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, email: email, password: password }),
        })
        if (response.ok) {
            const data = await response.json();
            this.events.emit('user:register:success', data);
        }
    }
}
class UIManager {
    constructor(events) {
        this.events = events;
        this.activeWindow = null;

        this.loadEvents();
    }
    loadEvents() {
        this.events.on('UI:project:list', ()=> {
            // Render the project list 
        })   
        this.events.on('UI:render:signup', () => {
            const exists = document.querySelector('.signup-wrapper');
            exists && exists.remove();
            const header = document.querySelector('header')
            SignupWrapper(this.events);
        });
        this.events.on('UI:render:projects', (payload) => {
            // Logic to render / remove UI;
        });
        this.events.on('UI:render:window', (payload) => { 
            this.activeWindow && this.activeWindow.remove();
            const modal = renderWindow(this.events, payload);
            this.activeWindow = modal;
        });
            
    }   

}

class ProjectManager {
    constructor(events) {
        this.events = events;
        this.currentProject = null;
        this.AllProjects = [];
        this.view = 'table';

        this.loadEvents();
    }
    loadEvents() {
        this.events.on('user:register:success', (payload) => {
            const { username, email, password } = payload;
            this.login(username, password);
        });
        this.events.on('user:retrieve:projects', async () => {
            const response = await fetch('http://127.0:5000/user/projects')
            if(response.ok) {
                const data = await response.json();
                
            }
            else {
                this.events.emit('user:retrieve:projects:failed', () => {
                    // Code to render message or whatever..
                })
            }
        })
        this.events.on('user:login:success', (payload) => {
            this.events.emit('UI:render:projects', payload);

        })
    }
    async loadUserProjects(user) {
        // Loading user projects from DB
    }

}







/* document.addEventListener('DOMContentLoaded', async () => {

    const headerWrapper = document.querySelector('.main-page-user');
    const addProjectButton = document.querySelector('.add-project');
    const token = localStorage.getItem('token');

        if (token) {
            const decoded = await parseJwt(token);
            if (decoded.role === "admin") {
                console.log('Admin')
                const manager = new ProjectManager(decoded.id);
                Profile(headerWrapper);

                
                const admin = document.querySelector('.main-page-user')
                const link = document.createElement('a');
                link.setAttribute('href', './admin.html');
                link.textContent = 'ADMIN';
                link.style.fontSize = '16px';
                admin.appendChild(link);
            }
            else {
               console.log('User')
                const manager = new ProjectManager(decoded.id);
                Profile(headerWrapper);

            }
            
            
        } else {
            console.log('User is not logged in');
            SignupButtons(headerWrapper);
        }

    

    addProjectButton.addEventListener('click', (e)=> {
        e.preventDefault();
        SetupWindow();
    });
});
class ProjectManager {
    constructor(userid) {
        this.currentProjects = [];
        this.userid = userid;
        this.update(true);
        
    }
    async update() { 
        const response = await fetch('http://localhost:5000/projects', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        this.currentProjects = await response.json();
        this.currentProjects = this.currentProjects.filter(t => t.project.userid === this.userid);
        this.renderSidebar();
    } 
    renderSidebar() {
        const container = document.querySelector('.project-list');
        if (this.currentProjects.length >= 1) {
            this.currentProjects.forEach(t => {
                const projectName = document.createElement('li');
                const text = document.createElement('a');
                text.textContent = `${t.project.name}`;
                projectName.appendChild(text);
                projectName.classList.add('sidebar-project')
                text.classList.add('sidebar-project-name');
                text.setAttribute('href', '/');
                
                text.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (text.classList.contains('active')) {
                        text.classList.remove('active');
                        this.removeProject();

                    }
                    else {
                        document.querySelectorAll('.sidebar-project-name').forEach(b => b.classList.remove('active'));
                        text.classList.add('active');
                        
                       
                        this.renderProject(`${t.project.name}`);
                    }
                })
                
                container.appendChild(projectName);
            })
        }
        
    }
    async renderProject(name) {
        const container = document.querySelector('.active-project');
        const wrapper = document.createElement('div');
        const rowBlock = document.createElement('div');
        const descriptionBlock = document.createElement('div');
        const nameOutput = document.createElement('output');
        const descriptionOutput = document.createElement('output');
        const startDateOutput = document.createElement('output');
        const dueDateOutput = document.createElement('output');
        const statusOutput = document.createElement('output');

        Array.from(container.children).forEach(child => {
            if (child.classList.contains('project')) {
                child.remove();
            }
        })
        const thisProject = this.currentProjects.filter(t => t.project.name === name);


        rowBlock.classList.add('project-row-block');
        descriptionBlock.classList.add('projects-description-block')
        wrapper.classList.add('project'); //Temporary class
        nameOutput.textContent = `${thisProject[0].project.name}`;
        descriptionOutput.textContent = `${thisProject[0].project.description}`;
        startDateOutput.textContent = `${thisProject[0].project.startDate}`;
        dueDateOutput.textContent = `${thisProject[0].project.dueDate}`;
        statusOutput.textContent = `${thisProject[0].project.status}`;


        rowBlock.appendChild(nameOutput);
        rowBlock.appendChild(startDateOutput);
        rowBlock.appendChild(dueDateOutput);
        rowBlock.appendChild(statusOutput);
        descriptionBlock.appendChild(descriptionOutput);
        wrapper.appendChild(descriptionBlock)
        wrapper.appendChild(rowBlock);
        container.appendChild(wrapper);
    }
    removeProject() {
        const container = document.querySelector('.active-project');
        const child = container.querySelector('div');
        if (child) child.remove();
    }
} */





