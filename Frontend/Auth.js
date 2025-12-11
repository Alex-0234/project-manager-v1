
import User from './userState.js'
import { jwtDecode } from './node_modules/jwt-decode/build/esm/index.js'

export default class Auth {
    constructor(events) {
        this.events = events;

        this.loadEvents();
    }
    loadEvents() {
        this.events.on('user:register:attempt', (payload) => {
            const { username, email, password } = payload;
            this.register(username, email, password);
        })
        this.events.on('user:register:success', () => {
            console.log('Registration successful');
        })
        this.events.on('user:register:failed', () => {
            // Like a pop-up message ig.
        })
        this.events.on('user:login:attempt', (payload) => {
            const { username, password } = payload;
            this.login(username, password);
        })
        this.events.on('user:login:failed', () => {

        })
        this.events.on('user:login:success', (payload)=> {
            const token = payload;
            const decoded = jwtDecode(token);

            User.userId = decoded.userId;
            User.username = decoded.username;
            User.token = token;
            User.isLoggedIn = true;

            this.events.emit('UI:render:user');
            //this.events.emit('');


        })
    }
    async checkLoginStatus() {
        const token = localStorage.getItem('');
        if (token) {
            const response = await fetch('http://localhost:5000/user/token/decrypt',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token }),
            }); 
            if (response.ok) {
                const data = await response.json();
                this.events.emit('UI:render:user');
            }
            else {
                this.events.emit('UI:render:signup');
            }
        }
        else {
            this.events.emit('UI:render:signup');
        }
    } 
    async login(username, password) {

        const response = await fetch('http://localhost:5000/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password }),
        })
        if (response.ok) {
            const data = await response.json();
            this.events.emit('user:login:success', data);
        }
        else {
            this.events.emit('user:login:failed');
        }
    }
    async register(username, email, password) {
        const response = await fetch('http://localhost:5000/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, email: email, password: password }),
        })
        if (response.ok) {
            const data = await response.json();
            this.events.emit('user:register:success');
        }
        else {
            this.events.emit('user:register:failed');
        }
    }
}