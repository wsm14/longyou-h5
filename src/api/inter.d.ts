



export interface RequestBase {
  url: string, //字符串
  method: 'POST' | 'GET', //常规请求方式，根据项目要求添加
  data: any, // 每次的参数都是不固定的，因此我们暂时不声明数据类型
  contentType:string,//contenet-type的类型
  header: RequestHeader, // 下面的requestheader类型,
  loading: boolean, // 请求是否开启loading层
  mask: boolean, //开启loading层的情况下是否不能点击，全屏遮罩
  isID:boolean,//是否带projectId
  title: string, //开启loading层的提示内容
  failToast: boolean //如果请求是否，我是否直接弹出我的提示
}


export interface RequestHeader {
  'content-type': string // 表示content-type类型必须声明
  "x-access-token"?: string // token可能不存在，如果存在就是字符串类型
}

type Request = {
  [K in keyof RequestBase]?: RequestBase[K]
}





//图片上传的类型
export interface RequestBaseImg {
  url: string, //字符串
  filePath: any, // 每次的参数都是不固定的，因此我们暂时不声明数据类型
  header: RequestImgHeader, // 下面的requestheader类型,
  loading: boolean, // 请求是否开启loading层
  mask: boolean, //开启loading层的情况下是否不能点击，全屏遮罩
  title: string, //开启loading层的提示内容
  failToast: boolean //如果请求是否，我是否直接弹出我的提示
}
type RequestImg = {
  [K in keyof RequestBaseImg]?: RequestBaseImg[K]
}
export interface RequestImgHeader {
  "x-access-token"?: string // token可能不存在，如果存在就是字符串类型
  "X-Requested-With"?:string
}


//声明请求接口的类型

export interface MAINLOGIN {
  username: string,
  password: string,
  captcha: string
}