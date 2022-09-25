
/**
 * https://m.php.cn/article/477543.html
 * 判断字符串是否符合json格式
 * @param {String} str 
 * @returns Boolean
 */
export const isJSON = (str) => {
  if (typeof str == 'string') {
    try {
      let obj = JSON.parse(str)
      if(typeof obj == 'object' && obj ){
        return true
      }else{
        return false
      }
    } catch(e) {
      return false
    }
  }
  // 不是字符串
  return false

}


/**
 * 控制台打印
 */
 export const consolePrint = () => {
  const info =
`API接口服务
MIT License
github: https://github.com/huangweizhi/api-server-nuxt.git
gitee: https://gitee.com/weizhihuang/api-server-nuxt.git
`
  console.info(`%c${info}`, `color:#117a8b`)
}