import { SignupWrapper } from '../functions.js';

document.addEventListener('DOMContentLoaded', () => {
    const events = new Emitter();
    const User = new Auth(events);
    const Manager = new ProjectManager(events);

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
        for (const callback in this.listeners[event]) {
            callback(payload);
        }
    }
}
class Auth {
    constructor(events) {
        this.events = events;

        this.data = new Proxy({userId: null, username: null, token: null}, {
            set: (t, p, v) => {
                t[p] = v;
            }
        });
        console.log(this.data)
        this.loadEvents();
    }
    loadEvents() {
        this.events.on('data:change', (payload) => {
            const { userId, username, token } = payload;
            this.data.userId = userId;
            this.data.username = username;
            this.data.token = token;
        })
        this.events.on('user:register:attempt', (payload) => {
            const { username, password } = payload;
            this.register(username, password)
        })
        this.events.on('user:register:success', () => {
            // Logic to login maybe ??? Could do it in the register event itself..
        })
        this.events.on('user:register:failed', () => {
            // Like a pop-up message ig.
        })
        this.events.on('user:login:attempt', (payload) => {
            const { username, password } = payload;
            this.login(username, password)
        })
        this.events.on('user:login:failed', () => {

        })
    }
    async init() {
        if (!localStorage.getItem('token')) {
            //const response = await fetch('user/token/decrypt',{
            // method: POST,
            // }); 
            if (response.ok) {
                const data = await response.json();
                this.events.emit('data:change', data); // Should count as login after refresh
            }
            else {
                this.events.emit('UI:render:signup');
            }
        }
        else {
            this.events.emit('UI:render:signup');
        }
    }
    async login(username, password, token) {
        const response = await fetch('http://localhost:5000/user/login', {
            method: 'POST',
            body: { username: username, password: password },

        })
        if (response.ok) {
            const data = await response.json();
            this.events.emit('user:login:success', data);
            this.events.emit('data:change', data);
        }
        else {
            this.events.emit('user:login:failed');
        }
    }
    async register(username, password) {
        const response = await fetch('http://localhost:5000/user/register', {
            method: 'POST',
            body: { username: username, password: password },

        })
        if (response.ok) {
            const data = await response.json();
            this.events.on('user:register:success', data);
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
        this.events.on('UI:render:signup', () => {
            const exists = document.querySelector('.signup-wrapper');
            exists && exists.remove();
            SignupWrapper(this.events);
        });
        this.events.on('UI:render:projects', (payload) => {
            // Logic to render / remove UI;
        })
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
        this.events.on('user:register:success', () => {
            // Logic to render / remove UI;
        });
        this.events.on('user:retrieve:projects', async () => {
            const response = await fetch('http://localhost:5000/user/projects')
            if(response.ok) {
                const data = await response.json();
                
            }
            else {
                this.events.on('user:retrieve:projects:failed', () => {
                    // Code to render message or whatever..
                })
            }
        })
        this.events.on('user:login:success', (payload) => {
            this.events.emit('UI:render:projects', payload);

        })
    }
    async loadUserProjects() {
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





