/*
 * @Author: quling
 * @Date: 2022-09-13 16:26:37
 * @LastEditors: quling
 * @LastEditTime: 2022-09-13 17:07:03
 * @Description: 自定义控件
 */
import Control from 'ol/control/Control'
export default class extends Control {
  constructor (options) {
    console.log(options)
    const options_ = options || {}
    super({
      element: options_.element,
      target: options_.target
    })
  }
}
