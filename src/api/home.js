import request from '@/utils/request'

export function getPicData(data){
    return request({
        url: '/picture/getPicData',
        method: 'post',
        data,
    })
}

export function getPicDetail(data){
    return request({
        url: '/picture/getPicDetail',
        method: 'post',
        data,
    })
}

export function getImageList(data){
    return request({
        url: 'images/getImageList',
        method: 'post',
        data,
    })
}

export function getImageDetail(data){
    return request({
        url: 'images/getImageDetail',
        method: 'post',
        data,
    })
}