
import Taro, { useRouter } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { AtButton } from "taro-ui"
import { View, Text, Image } from "@tarojs/components";
import { AtListItem, AtInput, AtTextarea, AtImagePicker } from "taro-ui"
import BasicBox from "../../components/BasicBox"
import { AtAccordion } from 'taro-ui'
import "./index.scss"

import TittleBar from "../../components/TittleBar"
import address from "../../static/images/address2.png"
import { isEmpty, uploadFile, goToUrl } from "../../utils/variable"
import regex from "../../utils/regex"
import AccordionBox from "../../components/AccordionBox"
import { EmergencyManagementCreate } from "../../utils/emergency"
import { GetProjectDetail } from "../../utils/main"

export default function Index() {
    const [open, setopen] = useState<boolean>();
    const [detail, setDetail] = useState<any>({});//提交详情
    const [projectDetail, setProjectDetail] = useState({});//项目详情
    const {
        teamLeaderName,//队长
        teamLeaderPhone,//队长电话
        teamViceName,//副队长
        teamVicePhone,//副队长电话
        teamMembers,//队员名单
        refuge,//避难所地点
        refugeLinkMan,//避难所联系人
        refugeLinkPhone,//避难所电话
        fileIds = [],//图片
        files = []//图片
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

    //图片变化
    const changePicker = async (type, files, operationType, index) => {
        detail[type] = files;

        if (operationType === "add" && files.length == 1) {
            fileIds.push(await uploadFile(files[0]))
            // fileIds.push(await requestImg(files[0].file.originalFileObj))
        }

        if (operationType === "add" && files.length > 1) {
            fileIds.push(await uploadFile(files[files.length - 1]))
        }

        if (operationType === "remove") {
            fileIds.splice(index, 1)
        }
        detail.fileIds = fileIds
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

        detail.fileIds = fileIds.join();
        console.log(detail);
        const res = await EmergencyManagementCreate(detail)
        if (res.code == "200") {
            Taro.showToast({ title: "提交成功", icon: "success", duration: 1000 }).then(() => {
                goToUrl({ type: "navigateBack" });
            })
        }
    }

    return (
        <View className="Complaint-page pageStyle">
            <View className="Complaint-page-content">
                <View className="Complaint-page-content-tittle">应急管理</View>
                <AccordionBox projectDetail={projectDetail}></AccordionBox>    

                <BasicBox title="姓名投诉建议" style={{ paddingBottom: "12px" }}>
                    <AtInput
                        title='姓名'
                        value={teamLeaderName}
                        type='text'
                        placeholder='请输入姓名'
                        onChange={(e) => { handleChange("teamLeaderName", e) }}
                    />
                    <AtInput
                        title='联系电话'
                        value={teamLeaderPhone}
                        type='number'
                        placeholder='请输入联系电话'
                        onChange={(e) => { handleChange("teamLeaderPhone", e) }}
                    />
                    <AtInput
                        title='主题'
                        value={teamViceName}
                        type='text'
                        placeholder='请输入主题'
                        onChange={(e) => { handleChange("teamViceName", e) }}
                    />
                    <TittleBar title="内容:">
                        <AtTextarea
                            count={false}
                            value={teamMembers}
                            placeholder='请输入内容'
                            className="titleBar-textarea"
                            onChange={(e) => { handleChange("teamMembers", e) }}
                        />
                    </TittleBar>
                    <TittleBar title="照片:" style={{ paddingBottom: "12px" }}>
                        <AtImagePicker
                            files={files}
                            onChange={(files, operationType, index) => { changePicker("files", files, operationType, index) }}
                        />
                    </TittleBar>
                </BasicBox>
                <AtButton type='primary' className="submitButton noStyleButton" onClick={() => { submit() }}>提交</AtButton>
            </View>
        </View>
    )
}
