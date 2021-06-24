import * as Inter from '../api/inter';
import doRequestAction from "../api/request";
import * as Api from '../api/api'








//投诉建议
export const complaintCreate = (data) => {
  return doRequestAction({
    url:Api.complaint,
    data:data,
    method:"POST",
    isID:true,
    contentType:"json"
  })
} 


//社会评价
export const socialEvaluationCreate = (data) => {
  return doRequestAction({
    url:Api.socialEvaluation,
    data:data,
    method:"POST",
    isID:true,
    contentType:"json"
  })
} 


//红色工地
export const selectByProjectId = (data) => {
  return doRequestAction({
    url: `/api/pm/partyBranch/selectByProjectId/${data.projectId}`,
    method:"POST",
    data:data,
    contentType:"json"
  })
}

//红色工地荣誉列表
export const partyBranchHonor = (data) => {
  return doRequestAction({
    url: `/api/pm/partyBranchHonor/allList`,
    method:"POST",
    data:data,
    contentType:"json"
  })
}


//通知公告
export const noticeList = (data) => {
  return doRequestAction({
    url: `/api/core/notice/${data.pageNum}/${data.pageSize}/list`,
    method:"POST",
    data:data,
    isID:true,
    contentType:"json"
  })
}


//通知公告详情
export const noticDetail = (id:number | string | undefined) =>{
  return doRequestAction({
    url: `/api/core/notice/${id}/details`,
  })
}