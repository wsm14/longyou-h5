import Taro from '@tarojs/taro'
import dayjs from 'dayjs';
import request from "./request"

import { JSEncrypt } from "encryptlong";

const isEmpty = (o: any) => {
  if (o == null || o == undefined)
    return true;
  switch (typeof o) {
    case "boolean":
      return false;
    case "object":
      for (let t in o)
        return false;
      return true;
    case "array":
    case "string":
      return o.length <= 0;
    case "number":
      return o.toString().length <= 0;
    case "function":
      return false;
  }
  return true;
}



//加密
const publicEncrypt = (publicKey: string, content: string) => {
  let encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  return encrypt.encryptLong(content);
}


/**
 *判断类型
 *
 */
const sTypeOf = (o, type) => {

  switch (type) {
    case "Array":
      return Object.prototype.toString.call(o) == '[object Array]';
    case "Object":
      return Object.prototype.toString.call(o) == '[object Object]';
    case "String":
      return Object.prototype.toString.call(o) == '[object String]';
    case "Number":
      return Object.prototype.toString.call(o) == '[object Number]';
  }
}

/**
 *截取小数点后面两位小数
 *
 */
const toFixed = (obj) => {
  const re = /([0-9]+\.[0-9]{2})[0-9]*/;
  if (sTypeOf(obj, "Number")) {
    return obj.toString().replace(re, "$1") - 0;
  } else {
    return obj.replace(re, "$1");
  }
};


// 格式化 日期时间
const formatDateTime = (date = new Date(), p1 = "-") => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return [year, month, day].map(formatNumber).join(p1);
}

// 格式化 日期数字
const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : "0" + n;
}


/**对象和数组相关的函数**/
/**
 * 深度拷贝, 防止因直接赋值引起的地址相同问题
 * @returns {*}
 */
const cpy = (o) => {
  let res = {};
  if (o === null) {
    return o;
  }
  switch (typeof o) {
    case "object":
      //判断o是否是react组件对象， 如果是 直接赋值
      if (!isEmpty(o) && o["$$typeof"] == Symbol.for('react.element')) {
        res = o;
        break;
      }
      if (Object.prototype.toString.call(o) === '[object Array]')
        res = [];
      for (let i in o) {
        res[i] = cpy(o[i]);
      }
      break;
    default:
      res = o;
      break;
  }
  return res;
}


/**
 * 对象转FormData
 */
const jsToFormData = (data) => { //对象转formdata格式
  if (isEmpty(data)) return "";

  let formString = "?";
  for (const key in data) {
    const value = data[key];
    formString = `${formString}${key}=${value}&`
  }
  return formString;
}

interface url {
  type?: string // 表示content-type类型必须声明
  url?: string // token可能不存在，如果存在就是字符串类型
  events?: any
  param?: any
}

const goToUrl = ({
  type = "navigateTo",
  url,
  events,
  param
}: url) => {

  return new Promise((resolve, reject) => {
    const typeList = [
      "switchTab",  //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
      "reLaunch",   //关闭所有页面，打开到应用内的某个页面
      "redirectTo", //关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面
      "navigateTo",
      "navigateBack",
    ];

    if (isEmpty(typeList.find(Type => Type === type))) {
      throw new Error("goToUrl方法type参数为空")
    }

    let Url = '';
    if (!isEmpty(url)) {
      Url = `/pages/${url}/index`;
      if (!isEmpty(param)) {
        Url = `${Url}${jsToFormData(param)}`
      }
    }

    setTimeout(() => {
      Taro[type]({
        url: Url,
        events,
        success: _ => resolve(_),
        fail: _ => reject(_)
      })
    }, 500)
  })

}



//上传图片
const uploadFile = (item: any) => {
  Taro.showLoading({ title: "上传中", mask: true })
  return new Promise(resolve => {
      const userInfo = Taro.getStorageSync("userInfo") || {};
      request({
          filename: "file",
          file: item.file.originalFileObj,
          method: "POST",
          action: "/api/core/file/upload",
          headers: {
              "x-access-token": userInfo.authValue
          },
          onSuccess: res => {
              if (res.code == 200) {
                  resolve(res.data.fileId);
              } else {
                  Taro.showToast({
                      title: "附件上传失败!",
                      icon: "none",
                      duration: 2000
                  });
                  return ''
              }
              Taro.hideLoading()
          },
          onerror: (err) => {
            Taro.hideLoading()
          }
      });
  });
};


export {
  isEmpty,
  publicEncrypt,
  sTypeOf,
  toFixed,
  formatDateTime,
  formatNumber,
  cpy,
  goToUrl,
  uploadFile
}