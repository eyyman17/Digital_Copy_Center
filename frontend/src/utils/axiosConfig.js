import axios from 'axios';

axios.defaults.baseURL = 'https://digital-copy-center-backend.onrender.com';
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default axios;