


export default class TaskManager {
    constructor(events, project, user) {
        this.project = project;
        this.user = user;
        this.events = events;
    }
    async getTasks() {
        if (this.project) {
            //const response = await fetch('',{
            //method: 'POST',
            //headers
            //body: JSON.stringify(project: this.project, user: this.user)})
        }
    }
}