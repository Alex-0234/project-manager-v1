
import User from './userState.js'
import { SignupWrapper, renderWindow, userWrapper, mobileViewProjectList } from '../Frontend/functions.js';

export default class UIManager {
    constructor(events) {
        this.events = events;
        this.activeWindow = null;

        this.loadEvents();
    }
    loadEvents() {
        this.events.on('UI:mobile:project:list', ()=> {
            if (this.activeWindow) {
                this.activeWindow.remove();
                this.activeWindow = null;
                this.activeWindow = mobileViewProjectList();
            }
            else {
                this.activeWindow = mobileViewProjectList();
                
            }
           
        })   
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
        this.events.on('UI:render:window', (payload) => { 
            this.activeWindow && this.activeWindow.remove();
            const modal = renderWindow(this.events, payload);
            this.activeWindow = modal;
        });
            
    }   

}