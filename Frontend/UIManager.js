
import User from './userState.js'
import { SignupWrapper, renderWindow, userWrapper, mobileViewProjectList } from './components.js';
import eventEmitter from './EventBus.js';

export default class UIManager {
    constructor() {
        this.events = eventEmitter;
        this.activeWindow = null;

        this.loadEvents();
    }
    loadEvents() {
        this.events.on('UI:render:user', () => {
            const signupWrapper = document.querySelector('.signup-wrapper');
            signupWrapper && signupWrapper.remove();
            userWrapper(this.events, User);
        })
        this.events.on('UI:render:signup', () => {
            const exists = document.querySelector('.signup-wrapper');
            exists && exists.remove();
            SignupWrapper(this.events);
        });
        this.events.on('UI:render:projects', () => {
            // Logic to render / remove UI;
        });
        this.events.on('UI:open:project:setup', () => {
            this.activeWindow && this.activeWindow.remove();
            this.activeWindow = renderWindow(this.events, 'projectSetup');
        })
        this.events.on('UI:render:window', (payload) => { 
            this.activeWindow && this.activeWindow.remove();
            const modal = renderWindow(this.events, payload);
            this.activeWindow = modal;
        });
        this.events.on('UI:user:projects:mobile', () => {
            this.activeWindow && this.activeWindow.remove();
            const projects = document.querySelector('.project-list');
            projects.classList.toggle('invisible');
        })
            
    }   

}