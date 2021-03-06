import * as Inter from '../api/inter';
import doRequestAction from "../api/request";
import * as Api from '../api/api'



// 项目进度

export const subList = (data) => {
  return doRequestAction({
    url: Api.subList,
    data:data,
    method:"POST",
    contentType:"json"
  })
}

//检查人列表
export const getPeople = (orgId:string) =>{
  return doRequestAction({
    url:`/api/qualitysafety/disclosure/${orgId}/findUserByOrgId`,
  })
}


//监督检查提交

export const supervisedCheckCreate = (data) => {
  return doRequestAction({
    url: Api.supervisedCheckSubmit,
    data:data,
    method:"POST",
    isID:true,
    contentType:"json"
  })
}


//监督检查-获取监督检查详情的id
export const findSuperviseCheckIdByNoticeId = (noticeId:string | number | undefined) =>{
  return doRequestAction({
    url:`/api/qualitysafety/notice/${noticeId}/findSuperviseCheckIdByNoticeId`,
  })
}



//监督检查-待办事项详情
export const findCheckById = (checkId:string | number | undefined) =>{
  return doRequestAction({
    url:`/api/qualitysafety/supervisedCheck/${checkId}/findCheckById`,
  })
}

export const noticeRecord = (noticeId:string | number | undefined) =>{
  return doRequestAction({
    url:`/api/qualitysafety/notice/${noticeId}/noticeRecord`,
  })
}


//整改提交
export const completeProcessTask = (data) => {
  return doRequestAction({
    url: Api.completeProcessTask,
    data:data,
    method:"POST",
    // isID:true,
    contentType:"json"
  })
}
