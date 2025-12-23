
import User from './userState.js'
import eventEmitter from './EventBus.js'
import { createElement } from './components.js';

export default class ProjectManager {
    constructor() {
        this.events = eventEmitter;
        this.view = 'table';

        this.loadEvents();
        
    }
    loadEvents() {
        this.events.on('request:user:projects', async () => {
            await this.loadUserProjects();
        })
        this.events.on('UI:render:user:projects', async () => {
            await this.renderUserProjects();
        });
    }
    async loadUserProjects() {
        // Loading user projects from DB
        const response = await fetch('http://localhost:5000/user/projects',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${User.token}`,
                }
            })
            if(response.ok) {
                const data = await response.json();
                User.projects = data;
                
            }
    }
    async renderUserProjects() {
        const container = document.querySelector('.projects-wrapper');

        User.projects.forEach(project => {
            console.log('project',project);
            const modal = createElement('div','project',`${project.name}`,{});
            modal.addEventListener('click', () => {
                this.events.emit('UI:render:project', project);
            });
            container.appendChild(modal);
        });
        
        }
}