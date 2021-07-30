
import Taro, { useRouter } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { AtButton } from "taro-ui"
import { View, Text, Image, Picker } from "@tarojs/components";
import { AtListItem, AtInput, AtTextarea, AtImagePicker, AtInputNumber } from "taro-ui"
import BasicBox from "../../components/BasicBox"
import { AtAccordion } from 'taro-ui'
import "./index.scss"

import TittleBar from "../../components/TittleBar"
import address from "../../static/images/address2.png"
import { isEmpty, uploadFile, goToUrl } from "../../utils/variable"
import regex from "../../utils/regex"
import AccordionBox from "../../components/AccordionBox"
import { workerSchoolEducationCreate, findSchoolList } from "../../utils/emergency"
import { GetProjectDetail } from "../../utils/main"

export default function Index() {
    const [open, setopen] = useState<boolean>();
    const [detail, setDetail] = useState<any>({});//提交详情
    const [projectDetail, setProjectDetail] = useState({});//项目详情
    const [schoolList, setSchoolList] = useState([]);//学校列表
    const {
        reportName,//上报人
        linkPhone,//联系电话
        educationContent,//教育内容
        personNum,//参加教育人数
        schoolFiles = [],//图片
        schoolFiles1 = [],
        photoFileIds = [],//现场照片
        confessFileIds = [],//交底台账照片
        schoolName,//学校名字
    } = detail


    useEffect(() => {


        getDetail()


    }, [])



    //项目信息
    const getDetail = async () => {
        const projectId = Taro.getStorageSync('projectId') || "";
        const res: any = await GetProjectDetail(projectId);
        const result: any = await findSchoolList({ projectId: projectId });
        setProjectDetail(res.data);
        setSchoolList(result.data);
    }


    const handleChange = (name, type, e) => {
        switch (type) {
            case "Input":
            case "InputNumber":
            case "Textarea":
                detail[name] = e;
                break;
            case "Picker":
                detail[name] = schoolList[e.detail.value].schoolName;
                detail.schoolId = schoolList[e.detail.value].id;
                break;
        }
        setDetail({ ...detail })
    }

    //图片变化
    const changePicker = async (type, files, operationType, index) => {
        detail[type] = files;

        if (operationType === "add" && files.length == 1) {
            type === "schoolFiles" ? photoFileIds.push(await uploadFile(files[0])) : confessFileIds.push(await uploadFile(files[0]))
        }

        if (operationType === "add" && files.length > 1) {
            type === "schoolFiles" ? photoFileIds.push(await uploadFile(files[files.length - 1])) : confessFileIds.push(await uploadFile(files[files.length - 1]))
        }

        if (operationType === "remove") {
            type === "schoolFiles" ? photoFileIds.splice(index, 1) : confessFileIds.splice(index, 1)
        }

        detail.photoFileIds = photoFileIds;
        detail.confessFileIds = confessFileIds;
        setDetail({ ...detail })
    }
    const submit = async () => {

        const list = {
            reportName: "上报人",
            linkPhone: "联系电话",
            personNum: "参加教育人数",
            educationContent: "教育内容",
            photoFileIds: "现场照片",
            confessFileIds: "交底台账照片",
            schoolId: "学校名称"
        }
        for (let key in list) {
            if (isEmpty(detail[key])) {
                Taro.showToast({ title: `请输入${list[key]}`, icon: "none", duration: 1000 });
                return false;
            }
        }


        if (!regex.isMobile.test(detail.linkPhone)) {
            Taro.showToast({ title: `请输入正确的联系电话`, icon: "none", duration: 1000 });
            return false;
        }

        // detail.fileIds = fileIds.join();
        console.log(detail);
        const res = await workerSchoolEducationCreate(detail)
        if (res.code == "200") {
            Taro.showToast({ title: "提交成功", icon: "success", duration: 1000 }).then(() => {
                goToUrl({ type: "navigateBack" });
            })
        }
    }

    return (
        <View className="EmergencyInfo-page pageStyle">
            <View className="EmergencyInfo-page-content">
                <View className="EmergencyInfo-page-content-tittle">班前教育</View>

                <AccordionBox projectDetail={projectDetail}></AccordionBox>


                <BasicBox title="班前教育内容" style={{ paddingBottom: "12px" }}>

                    <AtListItem title="项目名称:" extraText={projectDetail?.projectName}></AtListItem>
                    <Picker mode='selector' range={schoolList} onChange={(e) => { handleChange("schoolName", "Picker", e) }} rangeKey={"schoolName"}>
                        <AtListItem title="民工学校名称:" extraText={schoolName || "请选择"} arrow="right"></AtListItem>
                    </Picker>
                    <View className="listItem">
                        <View>参加教育人数</View>
                        <AtInputNumber
                            type="number"
                            min={0}
                            max={100000000}
                            step={1}
                            value={personNum ? personNum : 0}
                            onChange={(e) => { handleChange("personNum", "Input", e) }}
                        />
                    </View>
                    {/* <AtInput
                        title='参加教育人数'
                        value={personNum}
                        type='number'
                        maxlength={100000000}
                        placeholder='请输入参加教育人数'
                        onChange={(e) => { handleChange("personNum", "Input", e) }}
                    /> */}
                    <AtInput
                        title='上报人'
                        value={reportName}
                        type='text'
                        maxlength={50}
                        placeholder='请输入上报人'
                        onChange={(e) => { handleChange("reportName", "Input", e) }}
                    />
                    <AtInput
                        title='联系电话'
                        value={linkPhone}
                        type='number'
                        placeholder='请输入联系电话'
                        onChange={(e) => { handleChange("linkPhone", "Input", e) }}
                    />
                    <TittleBar title="教育内容:">
                        <AtTextarea
                            count={false}
                            value={educationContent}
                            placeholder='请输入教育内容'
                            className="titleBar-textarea"
                            onChange={(e) => { handleChange("educationContent", "Textarea", e) }}
                            maxLength={200}
                        />
                    </TittleBar>
                    <TittleBar title="现场照片:" style={{ paddingBottom: "12px" }}>
                        <AtImagePicker
                            files={schoolFiles}
                            onChange={(files, operationType, index) => { changePicker("schoolFiles", files, operationType, index) }}
                        />
                    </TittleBar>
                    <TittleBar title="交底台账照片:" style={{ paddingBottom: "12px" }}>
                        <AtImagePicker
                            files={schoolFiles1}
                            onChange={(files, operationType, index) => { changePicker("schoolFiles1", files, operationType, index) }}
                        />
                    </TittleBar>
                </BasicBox>
                <AtButton type='primary' className="submitButton noStyleButton" onClick={() => { submit() }}>提交</AtButton>
            </View>
        </View>
    )
}
