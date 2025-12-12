import eventEmitter from './EventBus.js'
import User from './userState.js'
import Auth from './Auth.js'
import UIManager from './UIManager.js'
import ProjectManager from './ProjectManager.js'
import TasksManager from './TasksManager.js'

document.addEventListener('DOMContentLoaded', () => {
    

    const projectManager = new ProjectManager(eventEmitter);
    const UI = new UIManager(eventEmitter);
    const Authentication = new Auth(eventEmitter);
    
    const menu = document.querySelector('.menu-icon');
    menu.addEventListener('click', ()=> {
        const projectMenu = document.querySelector('.mobile-project-list-window').classList.toggle('invisible');
    })
    const addProject = document.querySelector('.add-project');
    addProject.addEventListener('click', () => {
        //eventEmitter.emit('UI:open:project:setup')
    })
    
    Authentication.checkLoginStatus();

})

