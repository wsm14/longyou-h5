import Taro from '@tarojs/taro'
import * as Inter from './inter'

const getRequestHeader = (): Inter.RequestImgHeader => {
  let userInfo: any = Taro.getStorageSync('userInfo');
  return userInfo ? {
    "x-access-token": userInfo.authValue,
    "X-Requested-With":"XMLHttpRequest"
  }:{}
}

const NormalRquestData: Inter.RequestBaseImg = {
  url: "", // 默认请求地址
  header: getRequestHeader(),
  filePath: {}, // 默认没有参数，传入空对象
  loading: true, //默认开启loading层
  mask: true, //请求时不需要点击
  title: '上传中', //loading提示文字
  failToast: false // 一般我们会处理相应业务逻辑，就不直接提示阻断流程
}




// 请求传入reqData参数   返回promise对象 因为全局请求我每次返回的类型都是不一样的，所以我直接any
const requestUploadFile = (reqData: Inter.RequestImg): Promise<any> => {
  // 将不存在的参数字段使用默认值进行替换
  NormalRquestData.header = getRequestHeader();
  let req: Inter.RequestBaseImg = { ...NormalRquestData, ...reqData }
  return new Promise((resolve, reject) => {
    //检测是否开启loading层 是否打开msak
    if (req.loading) Taro.showLoading({ title: req.title, mask: req.mask })
    console.log(req.filePath)
    Taro.uploadFile({
      url: req.url, //引入我的接口是特殊声明的，所以我就不检测http/https了
      name: 'file',
      fileName:req.filePath.name,
      filePath: req.filePath,
      header: req.header
    })
      .then(res => {
        // 大多数请求中 success并不代表成功，需要我们自己检测statusCode来确保
        if (res.statusCode === 200) {
          if(JSON.parse(res.data).code == "200"){
            resolve(JSON.parse(res.data).data.fileId)
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

export default requestUploadFile;