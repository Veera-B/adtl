import axios from 'axios';

const instance = axios.create({
    baseUrl:'https://adtl-cd297-default-rtdb.firebaseio.com/',
});
export default instance;