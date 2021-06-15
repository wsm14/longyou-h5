import Taro from '@tarojs/taro'
import * as Api from './api'
import * as Inter from './inter.d'
import {goToUrl} from "../utils/variable"

const getRequestHeader = (contentType: string): Inter.RequestHeader => {
  let userInfo: any = Taro.getStorageSync('userInfo');

  let typeObj: any = {
    form: 'application/x-www-form-urlencoded',
    json: 'application/json; charset=utf-8',
  };
  return userInfo ? {
    "content-type": typeObj[contentType],
    "x-access-token": userInfo.authValue
  } : {
    "content-type": typeObj[contentType]
  }
}

const NormalRquestData: Inter.RequestBase = {
  url: "", // 默认请求地址
  method: 'GET', // 默认get请求
  header: {
    "content-type": "application/x-www-form-urlencoded"
  },
  contentType: "form",
  data: {}, // 默认没有参数，传入空对象
  loading: true, //默认开启loading层
  mask: true, //请求时不需要点击
  isID: false,
  title: '数据加载中', //loading提示文字
  failToast: false // 一般我们会处理相应业务逻辑，就不直接提示阻断流程
}




// 请求传入reqData参数   返回promise对象 因为全局请求我每次返回的类型都是不一样的，所以我直接any
const doRequestAction = (reqData: Inter.Request): Promise<any> => {
  // 将不存在的参数字段使用默认值进行替换
  let req: Inter.RequestBase = { ...NormalRquestData, ...reqData }
  req.header = getRequestHeader(req.contentType);

  // 判断是否带projectID
  if (req.isID) {
    const projectId: number | string = Taro.getStorageSync("projectId") || "";
    req.data.projectId = projectId;
  }


  return new Promise((resolve, reject) => {
    //检测是否开启loading层 是否打开msak
    if (req.loading) Taro.showLoading({ title: req.title, mask: req.mask })
    Taro.request({
      url: req.url, //引入我的接口是特殊声明的，所以我就不检测http/https了
      method: req.method,
      data: req.data,
      header: req.header
    })
      .then(res => {
        // 大多数请求中 success并不代表成功，需要我们自己检测statusCode来确保
        if (res.statusCode === 200) {
          if (res.data.code == 401) {
            Taro.removeStorageSync('userInfo');
            Taro.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 1000
            }).then(res=>{
              goToUrl({url:"squared",type:"reLaunch"})
            })
          }
          resolve(res.data) // 成功
        } else {
          // 如果失败 检测是否直接提示信息
          if (req.failToast) Taro.showToast({ title: '网络不好，请求失败！' })
          reject(res) // 失败
        }
      })
      .catch(err => {
        // 如果失败 检测是否直接提示信息
        if (req.failToast) Taro.showToast({ title: '网络不好，请求失败！' })
        reject(err)
      })
      .finally(() => {
        // 请求结束 关闭loading层
        if (req.loading) Taro.hideLoading()
      })
  })
}

export default doRequestAction;