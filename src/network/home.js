import { request123 } from "./request";

export function getHomeMultidata() {
  return request123({
    // 封装这一层的意义：首页所有的请求可以统一管理
    url:'/home/multidata'
  })
}

// 函数调用 -> 压入函数栈