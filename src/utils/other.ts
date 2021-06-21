import * as Inter from '../api/inter';
import doRequestAction from "../api/request";
import * as Api from '../api/api'



// 通过项目id判断

export const IsCreateManagement = (projectId:any) => {
  return doRequestAction({
    url: `/api/pm/emergencyManagement/isCreateManagement/${projectId}`,
  })
}




//应急管理新增
export const complaintCreate = (data) => {
  return doRequestAction({
    url:Api.complaint,
    data:data,
    method:"POST",
    isID:true,
    contentType:"json"
  })
} 