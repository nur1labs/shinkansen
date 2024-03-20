import axios from "axios"

export default defineNuxtPlugin((NuxtApp) => {

    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://206.189.127.160:4040/'

    return {
        provide: { 
            axios: axios
        },
    }
})
