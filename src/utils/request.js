import axios from 'axios';
import { Message } from 'element-ui'
// import qs from 'qs';

const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL
});

request.interceptors.request.use(config => {
    // config.data = qs.stringify(config.data)
    return config;
}, err => {
    return Promise.reject(err);
})

request.interceptors.response.use(response => {
    let res = response.data;
    if(res.code === 0){
        Message({
            message: res.message,
            type: 'error',
        })
        return Promise.reject(res)
    }else{
        return res;
    }
}, err => {
    return Promise.reject(err)
})

export default request;