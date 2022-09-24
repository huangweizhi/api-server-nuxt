
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