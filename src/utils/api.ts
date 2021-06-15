import Taro from "@tarojs/taro";
import request from "./request";

interface IGetInfo {
  username: string;
  password: string;
}
interface IProjectList {
  projectId: string;
  reportType: string;
}
//扫码获取项目名称、项目等级
export const reqGetProgectIndexLevel = (projectId: string) =>
  request({
    url: `/api/pm/projectScore/${projectId}/getProjectScoreDetail`,
    method: "GET"
  });

  //获取图片验证码
export const getLoginImgCode = (data: any) =>
request({
  url: `/api/captcha/get`,
  data,
  method: "POST",
  contentType: "application/json;charset=UTF-8"
});
//根据用户名判断该用户是否能登陆该入口
export const reqIsLogin = (data: any) =>
  request({
    url: `/api/visitRegist/isLogin`,
    data,
    method: "POST",
    contentType: "application/json;charset=UTF-8"
  });
//登录
// export const reqLogin = ( data: IGetInfo ) =>
// request({url: '/api/login', data, method: 'POST', contentType: 'application/x-www-form-urlencoded'})
export const reqLogin = (data: IGetInfo) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: "/api/login",
      data: data,
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: res => {
        resolve(res.data);
      },
      fail: err => {
        reject(err);
      }
    });
  });
};

// 根据字典获取数据
export const reqGetDic = (parentId: any) =>
  request({
    url: `/api/dict/findDict/${parentId}`,
    method: "GET"
  });

//获取项目详情
export const reqProgectDetail = (projectId: string) =>
  request({
    url: `/api/supervisionCode/${projectId}/projectReportDetail`,
    method: "GET"
  });

//获取抽检列表
export const reqSuperviseList = (pageNum: number, data: IProjectList) =>
  request({
    url: `/api/supervisionCode/${pageNum}/1000/reportDetail`,
    data,
    method: "POST",
    contentType: "application/json;charset=UTF-8"
  });

//监管记录详情
export const reqcheckDetail = (id: string) =>
  request({
    url: `/api/supervisionCode/${id}/projectNowDetail`,
    method: "GET"
  });

//提交抽检记录
export const reqSubmit = (data: any) =>
  request({
    url: `/api/supervisionCode/create`,
    data,
    method: "POST",
    contentType: "application/json;charset=UTF-8"
  });

//判断项目与账号对不对称
export const reqProAcc = (projectId: string) =>
  request({
    url: `/api/supervisionCode/${projectId}/isProjectUser`,
    method: "GET"
  });

// 根据身份证获取姓名和绿码
export const reqGetHealthCode = (idNumber: string) =>
  request({
    url: `/api/visitRegist/${idNumber}/idCardByWorkerName`,
    method: "GET"
  });

//获取是否填写过应急管理
export const reqGetIsOnce = (projectId: string) =>
  request({
    url: `/api/emergency/${projectId}/projectInfo`,
    method: "GET"
  });
//获取应急管理详情
export const reqGetEmergencyDetail = (emergencyId: string) =>
  request({
    url: `/api/emergency/${emergencyId}/emergencyInfo`,
    method: "GET"
  });
// 创建应急管理
export const reqEmergency = (data: any) =>
  request({
    url: `/api/emergency/create`,
    data,
    method: "POST",
    contentType: "application/json;charset=UTF-8"
  });
// 获取劳务信息
export const reqGetServiceInfo = (data: any) =>
  request({
    url: `/api/visitRegist/WorkerInfo`,
    data,
    method: "POST",
    contentType: "application/json;charset=UTF-8"
  });

// 获取工程申报详情
export const reqGetProjectDetail = (projectId: string) =>
  request({
    url: `/api/visitRegist/${projectId}/projectDeclare`,
    method: "GET"
  });

// 创建社会评价
export const reqSocietyAppraise = (data: any) =>
  request({
    url: `/api/societyAppraise/create`,
    data,
    method: "POST",
    contentType: "application/json;charset=UTF-8"
  });
// 创建来访登记
export const reqVisitRegist = (data: any) =>
  request({
    url: `/api/visitRegist/create`,
    data,
    method: "POST",
    contentType: "application/json;charset=UTF-8"
  });

// 创建投诉建议
export const reqComplaintSuggest = (data: any) =>
  request({
    url: `/api/complaintSuggest/create`,
    data,
    method: "POST",
    contentType: "application/json;charset=UTF-8"
  });

// 执法模块
//获取当前项目监督组成员
export const reqGetOrgData = (projectId: string) =>
  request({
    url: `/api/bj/project/${projectId}/supervisors`,
    method: "GET"
  });

//获取当前项目参建单位
export const reqGetConstrutByProject = (projectId: string) =>
  request({
    url: `/api/bj/Deductpoint/${projectId}/findConstrutByProject`,
    method: "GET"
  });
//获取积分编号
export const reqGetNextCheckCode = () =>
  request({
    url: `/api/bj/Deductpoint/nextCheckCode`,
    method: "GET"
  });
//获取信用扣分依据列表
export const reqGetAllInformList = (type: string) =>
  request({
    url: `/api/bj/Deductpoint/${type}/findAllInformList`,
    method: "GET"
  });

// 创建信用扣分
export const reqDeductpointAdd = (data: any) =>
  request({
    url: `/api/bj/Deductpoint/create`,
    data,
    method: "POST",
    contentType: "application/json;charset=UTF-8"
  });

//获取行政处罚依据列表
export const reqGetAllPublishList = () =>
  request({
    url: `/api/bj/Punishment/findAllPublishList`,
    method: "GET"
  });

//获取行政处罚依据列表
export const reqGetNextPublishCode = (punishmentType: any) =>
  request({
    url: `/api/bj/Punishment/${punishmentType}/nextPublishCode`,
    method: "GET"
  });
// 创建行政处罚
export const reqPunishmentAdd = (data: any) =>
  request({
    url: `/api/bj/Punishment/create`,
    data,
    method: "POST",
    contentType: "application/json;charset=UTF-8"
  });

// 获取项目列表
export const reqGetProjectList = (
  pageNum: number,
  pageSize: number,
  data: any
) =>
  request({
    url: `/api/visitRegist/${pageNum}/${pageSize}/findCodeProject`,
    data,
    method: "POST",
    contentType: "application/json;charset=UTF-8"
  });

//判断该项目是否为竣工项目
export const reqGetIsComplete = (projectId: string) =>
  request({
    url: `/api/visitRegist/${projectId}/isComplete`,
    method: "GET"
  });

// 项目状态为竣工时展示的接口
export const reqGetCompletedProject = (projectId: string) =>
  request({
    url: `/api/visitRegist/${projectId}/compltetProjectDetail`,
    method: "GET"
  });

// 获取二维码图片
export const reqGetProjectCode = (projectId: string) =>
  request({
    url: `/api/visitRegist/${projectId}/projectCode`,
    method: "GET"
  });

// 判断当前登录人是否能做监督检查和监督交底
export const reqGetIsOperate = (projectId: any) =>
  request({
    url: `  /api/bj/supervisionTell/${projectId}/isOperate`,
    method: "GET"
  });
// 根据monthReportId获取月报上报详情
export const reqGetcorpReport = (monthReportId: any) =>
  request({
    url: `/api/corpReport/month/${monthReportId}/monthReport`,
    method: "GET"
  });
//  月报评价上传
export const reqIsAppriase = (data: any) =>
  request({
    url: `/api/corpReport/month/isAppriase`,
    data,
    method: "POST",
    contentType: "application/json;charset=UTF-8"
  });

// H5页面获取评价
export const reqNumH5List = (data: any) =>
  request({
    url: `/api/corpReport/month/reportNumH5List`,
    data,
    method: "POST",
    contentType: "application/json;charset=UTF-8"
  });

// 判断当前人员是否可以点击云上处理
export const reqIsClickDeal = () =>
  request({
    url: `/api/H5/workflow/isClick`,
    method: "GET"
  });

// H5页面获取验收审核列表
export const reqProcessTaskList = (
  pageNum: number,
  pageSize: number,
  type: any,
  projectId: any
) =>
  request({
    url: `/api/H5/workflow/${pageNum}/${pageSize}/${type}/${projectId}/processTaskList`,
    method: "GET"
  });

// H5页面获取验收待办列表
export const reqProcessTaskListByType = (
  pageNum: number,
  pageSize: number,
  type: any,
  projectId: any
) =>
  request({
    url: `/api/H5/workflow/${pageNum}/${pageSize}/${type}/${projectId}/processTaskListByType`,
    method: "GET"
  });

// H5企业账号登录之后是否可以做相关操作 监测日报type=1 顶升加节type=2 维保type=3
export const reqGetIsUserReport = (type: any, projectId: any) =>
  request({
    url: `/api/riskSevere/testDaily/${type}/${projectId}/isUserReport`,
    method: "GET"
  });
