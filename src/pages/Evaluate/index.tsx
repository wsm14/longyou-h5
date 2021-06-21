
import Taro from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { AtButton } from "taro-ui"
import { View } from "@tarojs/components";
import { AtInput, AtIcon } from "taro-ui"
import BasicBox from "../../components/BasicBox"
import "./index.scss"
import { isEmpty, uploadFile, goToUrl } from "../../utils/variable"
import regex from "../../utils/regex"
import AccordionBox from "../../components/AccordionBox"
import { EmergencyManagementCreate } from "../../utils/emergency"
import { GetProjectDetail } from "../../utils/main"

export default function Index() {
    const [detail, setDetail] = useState<any>({});//提交详情
    const [projectDetail, setProjectDetail] = useState({});//项目详情
    const [starObj, setStarObj] = useState<any>(
        [
            {
                name: "扬尘防控",
                list: [0, 1, 2, 3, 4],
                count: 0
            },
            {
                name: "围栏美化",
                list: [0, 1, 2, 3, 4],
                count: 0
            },
            {
                name: "卫生管理",
                list: [0, 1, 2, 3, 4],
                count: 0
            },
            {
                name: "夜间施工",
                list: [0, 1, 2, 3, 4],
                count: 0
            },
            {
                name: "综合评价",
                list: [0, 1, 2, 3, 4],
                count: 0
            },
        ]
    );//星星
    const {
        teamLeaderName,//队长
    } = detail


    useEffect(() => {
        getDetail()
    }, [])



    //项目信息
    const getDetail = async () => {
        const projectId = Taro.getStorageSync('projectId') || "";
        const res: any = await GetProjectDetail(projectId);
        setProjectDetail(res.data);
    }


    const handleChange = (type, e) => {
        detail[type] = e;
        setDetail({ ...detail })
    }

    const submit = async () => {

        const list = {
            teamLeaderName: "队长姓名",
            teamLeaderPhone: "队长电话",
            teamViceName: "副队长姓名",
            teamVicePhone: "副队长电话",
            teamMembers: "队员名单",
            refuge: "避难所地点",
            refugeLinkMan: "避难所联系人",
            refugeLinkPhone: "避难所电话",
            fileIds: "应急避难所照片",
        }
        for (let key in list) {
            if (isEmpty(detail[key])) {
                Taro.showToast({ title: `请输入${list[key]}`, icon: "none", duration: 1000 });
                return false;
            }
        }


        if (!regex.isMobile.test(detail.teamLeaderPhone)) {
            Taro.showToast({ title: `请输入正确的队长电话`, icon: "none", duration: 1000 });
            return false;
        }

        if (!regex.isMobile.test(detail.teamVicePhone)) {
            Taro.showToast({ title: `请输入正确的副队长电话`, icon: "none", duration: 1000 });
            return false;
        }

        if (!regex.isMobile.test(detail.refugeLinkPhone)) {
            Taro.showToast({ title: `请输入正确的联系人电话`, icon: "none", duration: 1000 });
            return false;
        }

        // const res = await EmergencyManagementCreate(detail)
        // if (res.code == "200") {
        //     Taro.showToast({ title: "提交成功", icon: "success", duration: 1000 }).then(() => {
        //         goToUrl({ type: "navigateBack" });
        //     })
        // }
    }

    return (
        <View className="Evaluate-page pageStyle">
            <View className="Evaluate-page-content">
                <View className="Evaluate-page-content-tittle">应急管理</View>
                <AccordionBox projectDetail={projectDetail}></AccordionBox>

                <BasicBox title="请您对该项目文明施工状况给予评价">
                    {
                        starObj.map(item => (
                            <View className="listItem" key={item.name}>
                                <View className="listItem-left">{item.name}</View>
                                <View className="listItem-right">
                                    {item.list.map((val, ind) => (
                                        <AtIcon value='star-2'  color={ind < item.count ? "#FFD500" : "#E1E5EF"} key={val}></AtIcon>
                                    ))}
                                </View>
                            </View>
                        ))
                    }

                </BasicBox>

                <View className="Evaluate-page-top baseBox">
                    <AtInput
                        title='评价人'
                        value={teamLeaderName}
                        type='text'
                        placeholder='请输入姓名'
                        onChange={(e) => { handleChange("teamLeaderName", e) }}
                    />
                    <AtInput
                        title='联系电话'
                        value={teamLeaderName}
                        type='text'
                        placeholder='请输入联系电话'
                        onChange={(e) => { handleChange("teamLeaderName", e) }}
                    />
                </View>
                <AtButton type='primary' className="submitButton noStyleButton" onClick={() => { submit() }}>提交</AtButton>
            </View>
        </View>
    )
}
