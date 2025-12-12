
import User from './userState.js'
import eventEmitter from './EventBus.js'

export default class ProjectManager {
    constructor() {
        this.events = eventEmitter;
        this.Projects = [];
        this.view = 'table';

        this.loadEvents();
        
    }
    loadEvents() {
        this.events.on('request:user:projects', async () => {
            const response = await fetch('http://localhost:5000/user/projects',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${User.token}`,
                }
            })
            if(response.ok) {
                const data = await response.json();
                console.log('response',data);
                this.Projects = data;
                
            }
            /* else {
                this.events.emit('user:retrieve:projects:failed', () => {
                    // Code to render message or whatever..
                })
            } */
        })
    }
    async loadUserProjects() {
        // Loading user projects from DB

    }
    
}