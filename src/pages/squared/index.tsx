import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { View, Text, Image } from "@tarojs/components";
import {
  AtButton,
  AtGrid,
  AtCurtain,
  AtActionSheet,
  AtActionSheetItem,
  AtModal
} from "taro-ui";
import { GetProgectIndexLevel } from "../../utils/main"
import { IsCreateManagement } from "../../utils/emergency"
import { isEmpty, goToUrl } from "../../utils/variable"
import { LOGINOUT } from "../../utils/main"
// import QRcode_0 from "../../static/images/QRcode_1.png";
// import QRcode_1 from "../../static/images/QRcode_1.png";
// import QRcode_2 from "../../static/images/QRcode_2.png";
// import QRcode_3 from "../../static/images/QRcode_3.png";
// import QRcode_4 from "../../static/images/QRcode_4.png";
// import QRcode_5 from "../../static/images/QRcode_.png";
import gov from "../../static/images/index_1.png";
import emergency from "../../static/images/index_2.png";
import corp from "../../static/images/index_3.png";
import gytd from "../../static/images/index_4.png";
import health from "../../static/images/index_5.png";
import projectmsg from "../../static/images/index_6.png";
import hsgd from "../../static/images/index_7.png";
import pjjy from "../../static/images/index_8.png";
import ljgd from "../../static/images/index_9.png";
import "./index.scss";
// import { reqisCreateBranch } from "../../utils/redsite";

function Index() {
  // const [isOnceEmergency, setIsOnceEmergency] = useState(true); // 是否填写过应急管理
  const [year, setYear] = useState<any>(new Date().getFullYear().toString());
  const [month, setMonth] = useState<any>(
    new Date().getMonth() + 1 < 10
      ? "0" + (new Date().getMonth() + 1)
      : new Date().getMonth() + 1
  );
  const [day, setDay] = useState<any>(new Date().getDate().toString());
  const [hours, setHours] = useState<any>(new Date().getHours().toString());
  const [minutes, setMinutes] = useState<any>(
    new Date().getMinutes().toString()
  );
  const [seconds, setSeconds] = useState<any>(
    new Date().getSeconds().toString()
  );
  const [detail, setDetail] = useState<any>({});
  const [imgDetail, setImgDetail] = useState<any>({});//页面详情
  const [isOpened, setIsopened] = useState<any>(false);
  const [code, setCode] = useState("greenCode");
  const [modalOpen, setModalOpen] = useState<any>();//模态框显示
  const [modalContent, setModalContent] = useState<number>();//模态框内容
  const { params } = useRouter();
  const location = useRouter().params;
  // const haveIsOnceEmergency = Taro.getStorageSync("haveIsOnceEmergency");
  // const [isOpenedPlan, setIsOpenedPlan] = useState<any>(false);
  const [isOpenedAdvice, setIsOpenedAdvice] = useState<any>(false);
  // const [isCreateBranch, setIsCreateBranch] = useState<any>(false);


  useDidShow(() => {
    if (location.projectId) {
      Taro.setStorage({
        key: "projectId",
        data: location.projectId
      });
    }
  });
  useEffect(async () => {
    const projectId = location.projectId || Taro.getStorageSync("projectId")
    //获取当前时间
    getTime();
    const result: any = await GetProgectIndexLevel(projectId);
    if (result.code === 200) {
      setDetail(result.data);
      if (result.data) {
        switch (result.data.levelStr) {
          case "待改进":
            setCode("redCode");
            break;
          case "一般":
            setCode("orangeCode");
            break;
          case "中等":
            setCode("yellowCode");
            break;
          case "良好":
            setCode("blueCode");
            break;
          case "优秀":
            setCode("greenCode");
            break;
          default:
            setCode("grayCode");
            break;
        }
      }
      // if(result.data.event){
      //   Taro.navigateTo({
      //     url: `/pages/project_detail/index?projectId=${location.projectId}&typeNum=${typeNum}`
      //   });
      // }
    }
    // console.log(result);
    // const resultCode: any = await reqGetProjectCode(params.projectId);
    // if (resultCode.code === 200 && resultCode.data) {
    //   setImgDetail(resultCode.data);
    // }

  }, []);


  const clickUrl = async (value) => {
    let userInfo: any = Taro.getStorageSync('userInfo') || {};
    const projectId = location.projectId || Taro.getStorageSync("projectId")
    switch (value.id) {
      case 1:
        //判断是否登录
        if (isEmpty(userInfo.userId)) {
          goToUrl({ url: "main", param: { userType: 1 } })
        } else {
          //登录的是否是政府或者超级管理员
          if (userInfo.typeStr == "管理员" || userInfo.typeStr == "政府") {
            goToUrl({ url: "Regulation" })
          } else {
            setModalContent(1);
            setModalOpen(true);
          }
        }
        break;
      case 2:
        const res = await IsCreateManagement(projectId);
        if (res.data) {
          goToUrl({ url: "Emergency" })
        } else {
          goToUrl({ url: "Emergency_information" });
        }
        break;
      case 3:
        //判断是否登录
        if (isEmpty(userInfo.userId)) {
          goToUrl({ url: "main", param: { userType: 2 } })
        } else {
          //登录的是否是政府或者超级管理员
          if (userInfo.typeStr == "企业" || userInfo.typeStr == "银行" || userInfo.typeStr == "管理员" || userInfo.typeStr == "项目") {
            goToUrl({ url: "Regulation" })
          } else {
            setModalContent(2);
            setModalOpen(true);
          }
        }
        break;
      case 4:
        goToUrl({ url: "Construction" })
        break;
      case 6:
        goToUrl({ url: "Project_information" })
        break;
      case 5:
        goToUrl({ url: "Visit" })
        break;
      // case 8:
      //   setIsOpenedAdvice(true);
      //   break;
      default:
        Taro.showToast({
          title: "功能建设中",
          icon: "none",
          duration: 1000
        });
        break;
    }
  }

  const handleConfirm = async () => {
    const res = await LOGINOUT();
    if (res.code == "200") {
      Taro.removeStorageSync('userInfo');
      goToUrl({ url: "main", param: { userType: modalContent } })
      setModalOpen(false);
    }
  }

  const getTime = () => {
    let date = new Date(); //获得当前时间
    let yy = date.getFullYear(); //年份
    let mm =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1; //获得月份 //月份小于10时，前面加个0(例如9 ->09)天，小时，分钟，秒同理
    let dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(); //天
    let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); //小时
    let minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(); //分钟
    let seconds =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); //秒
    setYear(yy);
    setMonth(mm);
    setDay(dd);
    setHours(hours);
    setMinutes(minutes);
    setSeconds(seconds);
  };
  return (
    <View className="index-pageBox">
      <View className="paddingBox">
        <View className="logo">
          <View className="tipTitle">龙游县建设工程智慧监管平台</View>
          {/* <Text className="timeText">{`${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`}</Text> */}
          <View className="timeText">{`${year}年${month}月${day}日 ${hours}:${minutes}`}</View>
          {/* <Image src={logo} style={"width: 100%;height: 100%;"}></Image> */}

          <View className="codeBigBox">
            <View
              className="codeLeftBox"
              style={{
                backgroundColor:
                  code === "blueCode"
                    ? "rgba(50, 150, 250, 0.16)"
                    : code === "yellowCode"
                      ? "rgba(239, 199, 42, 0.16)"
                      : code === "orangeCode"
                        ? "rgba(252, 149, 32, 0.16)"
                        : code === "redCode"
                          ? "rgba(242, 84, 59, 0.16)"
                          : code === "greenCode"
                            ? "rgba(62, 197, 129, 0.16)"
                            : "rgba(204 , 204, 204, 0.16)"
              }}
              onClick={() => {
                // setIsopened(!isOpened);
              }}
            >
              <View
                className={
                  code === "blueCode"
                    ? "codeBlueBox"
                    : code === "yellowCode"
                      ? "codeYellowBox"
                      : code === "orangeCode"
                        ? "codeOrangeBox"
                        : code === "redCode"
                          ? "codeRedBox"
                          : code === "greenCode"
                            ? "codeGreenBox"
                            : "codeGrayBox"
                }
              ></View>
              {/* <span>点击查看</span> */}
            </View>
            <View className="codeRightBox">
              <View className="projectLevelText">
                项目等级：{detail?.levelStr || "--"}
              </View>
              <View
                className="projectName"
                style={{ WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}
              >
                {detail?.projectName || "加载中"}
              </View>
            </View>
          </View>
        </View>
        <AtCurtain
          isOpened={isOpened}
          onClose={() => {
            setIsopened(false);
          }}
        >
          {/* <Image style="width:100%;height:38%" src={`http://172.16.9.64:9002${imgDetail.code}`} /> */}
          <Image
            style="width:100%;height:38%"
            src={`QRcode_${code}.png`}
          />
        </AtCurtain>

        <AtGrid
          className="conBox"
          hasBorder={false}
          onClick={(value) => { clickUrl(value) }}
          data={[
            {
              id: 1,
              image: gov,
              value: "政府监管入口",
            },
            {
              id: 2,
              image: emergency,
              value: "应急管理"
            },
            {
              id: 3,
              image: corp,
              value: "企业管理入口"
            },
            {
              id: 4,
              image: gytd,
              value: "工友天地"
            },
            {
              id: 5,
              image: health,
              value: "来访登记"
            },
            {
              id: 6,
              image: projectmsg,
              value: "项目信息"
            },
            {
              id: 7,
              image: hsgd,
              value: "红色工地"
            },
            {
              id: 8,
              image: pjjy,
              value: "评价建议"
            },
            {
              id: 9,
              image: ljgd,
              value: "公示信息"
            }
          ]}
        />
      </View>


      <AtModal
        isOpened={modalOpen}
        cancelText='取消'
        confirmText='确认'
        onClose={() => { setModalOpen(false) }}
        onCancel={() => { setModalOpen(false) }}
        onConfirm={() => { handleConfirm() }}
        content={modalContent == 1 ? "您已登录企业账号,请确认是否切换为政府账号登录" : "您已登录政府账号,请确认是否切换为企业账号登录"}
      />


      {/* <AtActionSheet isOpened={isOpenedPlan} cancelText="取消">
        <AtActionSheetItem onClick={() => handleClick(1)}>
          来访登记
        </AtActionSheetItem>
        <AtActionSheetItem onClick={() => handleClick(2)}>
          健康码
        </AtActionSheetItem>
      </AtActionSheet> */}
      <AtActionSheet isOpened={isOpenedAdvice} cancelText="取消" onCancel={()=>{setIsOpenedAdvice(false)}} onClose={()=>{setIsOpenedAdvice(false)}}>
        <AtActionSheetItem onClick={()=>{goToUrl({url:"Evaluate"})}}>
          社会评价
        </AtActionSheetItem>
        <AtActionSheetItem onClick={()=>{goToUrl({url:"Complaint"})}}>
          投诉建议
        </AtActionSheetItem>
      </AtActionSheet>
    </View>
  );
}
export default Index;
