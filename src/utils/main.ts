import * as Inter from '../api/inter';
import doRequestAction from "../api/request";
import * as Api from '../api/api'


type projectIdStyle = number | string | undefined

//扫码获取项目名称、项目等级
export const GetProgectIndexLevel = (projectId: projectIdStyle) => {
  return doRequestAction({
    url: `/api/pm/cs/qrc/${projectId}/getWithoutAuthProjectScore`,
  })
}


//项目信息（上方9个内容）

export const GetDeviceNumber = (projectId: projectIdStyle) => {
  return doRequestAction({
    url: `/api/core/projectBroad/device/number/${projectId}`,
  })
}


//项目信息详情
export const GetProjectDetail = (projectId: projectIdStyle) => {
  return doRequestAction({
    url: `/api/core/projectBroad/${projectId}/projectDetail`,
  })
}


// 获取登录验证码图片
export const GETMAINCODE = () => {
    return doRequestAction({
      url: Api.maincode,
      method:"POST",
    })
  }

//登录加密

export const GEPUBLICKEY = () => {
  return doRequestAction({
    url: Api.publicKey,
    method:"POST",
  })
}

//登录接口 
export const LOGINOUT = () => {
  return doRequestAction({
    url: Api.logout,
    method:"POST",
  })
}  


//退出登录
export const GETMAINLOGIN = (data:Inter.MAINLOGIN) => {
  return doRequestAction({
    url: Api.mainlogin,
    data:data,
    method:"POST",
  })
}




//来访登记

export const VisiterRegister = (data) => {
  return doRequestAction({
    url: Api.visiterRegister,
    data:data,
    method:"POST",
    contentType:"json"
  })
}




//待办列表
export const ProcessTaskList = (data) => {
  return doRequestAction({
    url: `/api/core/workflow/${data.pageNum}/${data.pageSize}/processTaskListByPhone`,
    data:data,
    method:"POST",
    contentType:"json"
  })
}


//判断项目是否
export const standardizationMonthlyReviewCheck = (projectId:projectIdStyle) => {
  return doRequestAction({
    url: `/api/qualitysafety/standardizationMonthlyReview/check/${projectId}`,
    isID:true,
    method:"POST",
    contentType:"json"
  })
}