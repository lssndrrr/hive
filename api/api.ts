// api.ts
import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
})

// axios.defaults.xsrfHeaderName = 'X-CSRFToken'
// axios.defaults.xsrfCookieName = 'csrftoken'

api.interceptors.request.use(
    (config) => {
        if (config.method && config.method.toLowerCase() !== 'get') {
            const csrftoken = Cookies.get('XSRF-TOKEN')
            if (csrftoken) {
                config.headers['X-CSRFToken'] = csrftoken
            } else {
                console.warn('[CSRF] csrftoken not found in cookies')
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default api
