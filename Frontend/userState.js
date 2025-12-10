
export let User = new Proxy({userId: null, username: null, isLoggedIn: false }, {
    set: (target, key, value) => {
        console.log(`[Proxy] Setting property: ${key} to ${value}`);
        target[key] = value;
        return true;
    }
})