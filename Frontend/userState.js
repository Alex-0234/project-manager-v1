

let User = new Proxy({userId: null, username: null, token: null }, {
    set: (target, key, value) => {
        console.log(`[Proxy] Setting property: ${key} to ${value}`);
        target[key] = value;
        switch (key) {
            case 'token': {
                localStorage.setItem('token', value);
            }

        }
        return true;
    }    
})
export default User;