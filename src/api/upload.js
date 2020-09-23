import request from '@/utils/request'

export function getQiNiuUploadToken(){
    return request({
        url: '/getQiNiuUploadToken',
        method: 'get',
    })
}

export function saveImage(data){
    return request({
        url: '/images/saveImage',
        method: 'post',
        data
    })
}