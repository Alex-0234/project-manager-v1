import { SignupButtons, Profile } from "./Signup.js";
import { SetupWindow } from "./projectSetup.js";
import { parseJwt } from "./parseJwt.js";

document.addEventListener('DOMContentLoaded', async () => {

    const headerWrapper = document.querySelector('.main-page-user');
    const addProjectButton = document.querySelector('.add-project');
    const token = localStorage.getItem('token');

        if (token) {
            const decoded = await parseJwt(token);
            if (decoded.role === "admin") {
                console.log('Admin')
                const manager = new ProjectManager(decoded.id);
                Profile(headerWrapper);

                /*             Appending admin html           */
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

        /*             CSS / Visuals             */
        rowBlock.classList.add('project-row-block');
        descriptionBlock.classList.add('projects-description-block')
        wrapper.classList.add('project'); //Temporary class
        nameOutput.textContent = `${thisProject[0].project.name}`;
        descriptionOutput.textContent = `${thisProject[0].project.description}`;
        startDateOutput.textContent = `${thisProject[0].project.startDate}`;
        dueDateOutput.textContent = `${thisProject[0].project.dueDate}`;
        statusOutput.textContent = `${thisProject[0].project.status}`;

        /*               Appending               */
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
}