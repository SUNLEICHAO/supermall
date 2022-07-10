import { request123 } from "./request";

export function getHomeMultidata() {
  return request123({
    // 封装这一层的意义：首页所有的请求可以统一管理
    url: '/home/multidata'
  })
}

export function getHomeGoods(type, page) {
  return request123({
    url: '/home/data',
    params: {
      type,
      page
    }
  })
}

// 函数调用 -> 压入函数栈

// let totalNums = []

// const num1 = [10, 20, 30];
// const num2 = [111, 222, 333]

// for (let n of num1) {
//   totalNums.push(n)
// }

// ...相当于也是一种解构
// totalNums.push(...nums)