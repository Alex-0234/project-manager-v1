import eventEmitter from "./EventBus.js";

let User = new Proxy({
    userId: null, 
    username: null, 
    token: null, 
    isLoggedIn: false,
    colorPreference: null,

    }, {
    set: (target, key, value) => {
        console.log(`[Proxy] Setting property: ${key} to ${value}`);
        target[key] = value;
        switch (key) {
            case 'token': {
                localStorage.setItem('token', value);
            }
            case 'isLoggedIn': {
                if ( value === true) {
                    eventEmitter.emit('request:user:projects');
                }
            }

        }
        return true;
    }    
})

export default User;