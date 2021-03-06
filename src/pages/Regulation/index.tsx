import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { View, Input, Image, Form, Swiper, SwiperItem } from "@tarojs/components";

import { AtList, AtListItem } from "taro-ui"
import { goToUrl, isEmpty } from "../../utils/variable"
import { LOGINOUT, ProcessTaskList, standardizationMonthlyReviewCheck } from "../../utils/main"
import {findSchoolList } from "../../utils/emergency"
import "./index.scss";

// 图片引入
import regulation_1 from "../../static/images/regulation_1.png";
import regulation_2 from "../../static/images/regulation_2.png";
import regulation_3 from "../../static/images/regulation_3.png";
import regulation_4 from "../../static/images/out.png";
import regulation_5 from "../../static/images/school.png";



export default function Index() {


    const userInfo = Taro.getStorageSync("userInfo") || {};
    const projectId = Taro.getStorageSync('projectId') || "";
    const [list, setList] = useState<any>([]);
    const [schoolList, setSchoolList] = useState([]);

    useDidShow(() => {
        getList();
        getSchoolList();
    })



    // useEffect(() => {
    //     getList();
    // }, [])

    //获取学校列表

    const getSchoolList = async() =>{
        const result: any = await findSchoolList({projectId:projectId});
        setSchoolList(result.data);
    }



    //退出登录
    const loginOut = async () => {
        const res = await LOGINOUT();
        if (res.code == "200") {
            Taro.showToast({ title: res.msg, icon: "success", duration: 1000 }).then(() => {
                Taro.removeStorageSync('userInfo');
                goToUrl({ url: "squared", type: "reLaunch" })
            })
        }
    }

    //获取列表
    const getList = async () => {
        const data = {
            pageNum: 1,
            pageSize: 10,
            processDefinitionKeys: "RectificationNotice"
        }
        const res = await ProcessTaskList(data);
        setList(res.data.list.slice(0, 5));
    }


    //跳转
    const jump = (item) => {

        if (userInfo.typeStr == "项目" && (!userInfo.projectIdList.includes(Number(projectId)))) {
            Taro.showToast({ title: "此账号没有当前项目的权限", icon: "none", duration: 1000 })
            return false; 
        }

        if (item.taskKey == "submit") {
            goToUrl({
                url: "SuperviseDetail",
                param: {
                    businessId: item.businessId,
                    taskId: item.taskId
                }
            })
        } else if (item.taskKey == "approval") {
            goToUrl({
                url: "SuperviseDetailz",
                param: {
                    businessId: item.businessId,
                    taskId: item.taskId
                }
            })
        }
    }

    const safeJump = async () => {
        const projectId = Taro.getStorageSync("projectId") || "";
        const res = await standardizationMonthlyReviewCheck(projectId);

        if (res.code == 200) {
            Taro.removeStorageSync('scoreDetail');
            goToUrl({ url: "SafeAssessment" });
        } else {
            Taro.showToast({ title: res.msg, icon: "none", duration: 1000 })
        }
    }


    return (
        <View className="Regulation-Page pageStyle">

            <View className="Regulation-Page-content">
                <View className="Regulation-Page-content-signOut">
                    <View className="Regulation-Page-content-signOut-name">欢迎您，{userInfo.realName}</View>
                    <View className="Regulation-Page-content-signOut-out" onClick={() => { loginOut() }}>
                        退出登录
                        <Image src={regulation_4}></Image>
                    </View>
                </View>
                <Image className="Regulation-Page-topImg" src={regulation_1}>
                </Image>


                {
                    (userInfo.typeStr == "政府" || userInfo.typeStr == "管理员") && (
                        <View className="Regulation-Page-middle">
                            <View className="Regulation-Page-middle-button" onClick={safeJump}>
                                <Image src={regulation_2}></Image>
                                <View>安全考评</View>
                            </View>
                            <View className="Regulation-Page-middle-button" onClick={() => {
                                goToUrl({ url: "Supervise" })
                            }}>
                                <Image src={regulation_3}></Image>
                                <View>监督检查</View>
                            </View>
                        </View>
                    )
                }


                {
                    (userInfo.typeStr == "项目" || userInfo.typeStr == "管理员") && (
                        <View className="Regulation-Page-middle">
                            <View className="Regulation-Page-middle-button" onClick={() => {
                                if (!userInfo.projectIdList.includes(Number(projectId))) {
                                    Taro.showToast({ title: "此账号没有当前项目的权限", icon: "none", duration: 1000 }) 
                                }else if (isEmpty(schoolList)) {
                                    Taro.showToast({ title: "请先在系统上添加民工学校信息", icon: "none", duration: 1000 })  
                                }else{
                                    goToUrl({ url: "Education" })
                                }
                                
                            }}>
                                <Image src={regulation_5}></Image>
                                <View>班前教育</View>
                            </View>
                        </View>
                    )
                }




                <View className="Regulation-Page-list baseBox">
                    <AtList>
                        <AtListItem title='待办事项' extraText='更多' arrow='right' onClick={() => {
                            goToUrl({ url: "RegulationMore" })
                        }} className="Regulation-Page-list-first" />
                        {
                            !isEmpty(list) && list.map(item => (
                                <AtListItem title={item.taskName} note={item.businessName} key={item.processInstanceId} onClick={() => { jump(item) }} />
                            ))
                        }
                    </AtList>
                </View>
            </View>



        </View>
    )
}
