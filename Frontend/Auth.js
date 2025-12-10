

class Auth {
    constructor(events) {
        this.events = events;

        this.data = new Proxy({userId: null, username: null, token: null}, {
            set: (target, prop, value) => {
                target[prop] = value;
                switch (prop) {
                    case 'token':
                        this.events.emit('user:change', {
                            userId: target.userId,
                            username: target.username,
                            token: target.token
                        });
                        break;
                    case 'userId':
                        break;
                    case 'username':
                        break;
                    default:
                        break;
                }
                return true;
            }
        });
        console.log(this.data)
        this.loadEvents();
    }
    loadEvents() {
        this.events.on('user:register:attempt', (payload) => {
            const { username, email, password } = payload;
            this.register(username, email, password);
        })
        this.events.on('user:register:success', (payload) => {
            const { userId, username, token } = payload;
            this.data.userId = userId;
            this.data.username = username;
            this.data.token = token;
            
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
            const { userId, username, token } = payload;
            this.data.userId = userId;
            this.data.username = username;
            this.data.token = token;
        })
        this.events.on('user:change', (data)=> {
            console.log(this.data);
            this.events.emit('UI:render:user', data);
        })
    }
    async checkLoginStatus() {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await fetch('http://localhost:5000/user/token/decrypt',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token }),
            }); 
            if (response.ok) {
                const data = await response.json();
                this.events.emit('UI:render:user', data);
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
            console.log(data);
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
            this.events.emit('user:register:success', data);
        }
        else {
            this.events.emit('user:register:failed');
        }
    }
}