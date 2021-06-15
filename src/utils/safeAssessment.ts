import * as Inter from '../api/inter';
import doRequestAction from "../api/request";
import requestUploadFile from "../api/requestUploadFile"
import * as Api from '../api/api'




//安全考评列表接口 
export const GETALLLIST = () => {
  return doRequestAction({
    url: Api.findAllList,
    method:"POST",
  })
}  
// 根据字典获取数据
export const reqGetDic = (parentId: any) =>
  doRequestAction({
    url: `/api/dict/findDict/${parentId}`,
    method: "GET"
  });


//安全考评上传图片
export const requestImg = (data:any) => {
  return requestUploadFile({
    url: Api.getImage,
    filePath:data
  })
}  

//安全考评提交
export const submitSafe = (data) => {
  return doRequestAction({
    url: Api.submitSafe,
    method:"POST",
    contentType:"json",
    data
  })
} 