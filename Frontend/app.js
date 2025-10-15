import { SignupButtons, Profile } from "./Signup.js";
import { SetupWindow } from "./projectSetup.js";
import { parseJwt } from "./parseJwt.js";

document.addEventListener('DOMContentLoaded', async () => {

    const headerWrapper = document.querySelector('.main-page-user');
    const addProjectButton = document.querySelector('.add-project');
    const token = localStorage.getItem('token');

    console.log(token);
        if (token) {
            const decoded = await parseJwt(token);
            const manager = new ProjectManager(decoded.id);
            console.log('User is logged in');
            Profile(headerWrapper);
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
        console.log(this.userid);
        this.update(true);
        
    }
    async update() {
        const response = await fetch('http://localhost:5000/projects');
        this.currentProjects = await response.json();
        console.log(this.currentProjects);
        this.currentProjects = this.currentProjects.filter(t => t.project.userid === this.userid);
        console.log(this.currentProjects);
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
                /* Event listeners */
                text.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (text.classList.contains('active')) {
                        text.classList.remove('active');
                        this.removeProject();

                    }
                    else {
                        document.querySelectorAll('.sidebar-project-name').forEach(b => b.classList.remove('active'));
                        text.classList.add('active');
                        
                        /* Logic for generating content will be here */
                        this.renderProject(`${t.project.name}`);
                    }
                   
                    
                })
                /* Appending */
                container.appendChild(projectName);
            })
        }
        
    }
    async renderProject(name) {
        const container = document.querySelector('.active-project');
        const wrapper = document.createElement('div');
        const nameOutput = document.createElement('output');
        const descriptionOutput = document.createElement('output');
        const startDateOutput = document.createElement('output');
        const dueDateOutput = document.createElement('output');

        Array.from(container.children).forEach(child => {
            if (child.classList.contains('project')) {
                child.remove();
            }
        })
        const thisProject = this.currentProjects.filter(t => t.project.name === name);

        /*             CSS / Visuals             */
        wrapper.classList.add('project'); //Temporary class
        nameOutput.textContent = `${thisProject[0].project.name}`;
        descriptionOutput.textContent = `${thisProject[0].project.description}`;
        startDateOutput.textContent = `${thisProject[0].project.startDate}`;
        dueDateOutput.textContent = `${thisProject[0].project.dueDate}`;

        /*               Appending               */
        wrapper.appendChild(nameOutput);
        wrapper.appendChild(descriptionOutput);
        wrapper.appendChild(startDateOutput);
        wrapper.appendChild(dueDateOutput);
        container.appendChild(wrapper);
    }
    removeProject() {
        const container = document.querySelector('.active-project');
        const child = container.querySelector('div');
        if (child) child.remove();
    }
}