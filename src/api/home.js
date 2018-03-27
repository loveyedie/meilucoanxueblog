/**
 * Created by Administrator on 2017/12/24.
 */
import request from '@/utils/request'


export function getPostList(data) {
    return request({
        url: '/category',
        method: 'get',
        params: { data }
    })
}