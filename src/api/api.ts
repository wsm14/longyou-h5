
//登录接口
export const maincode: string = '/api/captcha/get';//登录的二维码图片
export const mainlogin: string = '/api/login';//登录
export const publicKey: string = '/api/publicKey';//登录的二维码图片
export const logout: string = '/api/logout';//退出登录



//安全考评接口 
export const findAllList: string = '/api/qualitysafety/abe/findAllList/1';//安全考评列表
export const getImage: string = '/api/core/file/upload';//安全考评获取图片
export const submitSafe: string = '/api/qualitysafety/standardizationMonthlyReview/create';//安全考评获取图片



//来访登记
export const visiterRegister: string = '/api/pm/visiterRegister/create';//来访登记


//应急管理




//监督检查
export const subList: string = '/api/core/dict/subList';//形象进度选择列表
export const supervisedCheckSubmit: string = "/api/qualitysafety/supervisedCheck/create";//监督检查提交


//待办事项
export const completeProcessTask: string = '/api/qualitysafety/notice/completeProcessTask';//整改提交
