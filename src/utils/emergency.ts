import * as Inter from '../api/inter';
import doRequestAction from "../api/request";
import * as Api from '../api/api'



// 通过项目id判断

export const IsCreateManagement = (projectId:any) => {
  return doRequestAction({
    url: `/api/pm/emergencyManagement/isCreateManagement/${projectId}`,
  })
}



//应急管理详情
export const SelectByProjectId = (projectId) => {
  return doRequestAction({
    url: `/api/pm/emergencyManagement/${projectId}/selectByProjectId`,
  })
} 


//应急管理新增
export const EmergencyManagementCreate = (data) => {
  return doRequestAction({
    url: `/api/pm/emergencyManagement/create`,
    data:data,
    method:"POST",
    isID:true,
    contentType:"json"
  })
} 

//紧急情况报告
export const EmergencyManagementReportCreate = (data) => {
  return doRequestAction({
    url: `/api/pm/emergencyManagementReport/create`,
    data:data,
    method:"POST",
    isID:true,
    contentType:"json"
  })
} 


//工友天地最近进场的10名工人

export const WorkerList = (projectId) => {
  return doRequestAction({
    url: `/api/pm/pmworker/${projectId}/workerList`,
  })
} 


//姓名或者身份证查询工人
export const SearchWorker = (data) => {
  return doRequestAction({
    url: `/api/pm/pmworker/searchWorker`,
    data:data,
    method:"POST",
    // isID:true,
    contentType:"json"
  })
} 


//获取工人详情

export const FindWorkerInfo = (workerId,projectId) => {
  return doRequestAction({
    url: `/api/pm/pmworker/${projectId}/${workerId}/findWorkerInfo`,
  })
} 


//获取学校列表

export const findSchoolList = (data) => {
  return doRequestAction({
    url: `/api/pm/workerSchool/${data.projectId}/findSchoolList`,
    method:"POST",
    data:data
  })
} 


//班前教育新增
export const workerSchoolEducationCreate = (data) => {
  return doRequestAction({
    url: `/api/realname/workerSchoolEducation/create`,
    data:data,
    method:"POST",
    isID:true,
    contentType:"json"
  })
} 