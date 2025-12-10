

export class ProjectManager {
    constructor(events, user) {
        this.events = events;
        this.user = new Proxy({userId: null},{
            set: (target, prop, value) => {
                target[prop] = value;
                this.events.emit('request:user:projects', prop);
                return true;
            }
            
        }
        )
        this.AllProjects = [];
        this.view = 'table';

        this.loadEvents();
        
    }
    loadEvents() {
        this.events.on('request:user:projects', async () => {
            const response = await fetch('http://localhost:5000/user/projects')
            if(response.ok) {
                const data = await response.json();
                console.log(data);
                
            }
            else {
                this.events.emit('user:retrieve:projects:failed', () => {
                    // Code to render message or whatever..
                })
            }
        })
    }
    async loadUserProjects() {
        // Loading user projects from DB

    }

}