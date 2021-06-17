
import Taro, { useRouter } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { AtButton } from "taro-ui"
import { View, Text, Picker } from "@tarojs/components";
import { AtListItem, AtTextarea, AtImagePicker } from "taro-ui"
import FloatLayout from "../../components/FloatLayout"
import TittleBar from "../../components/TittleBar"
import SignListItem from "../../components/SignListItem"
import { subList, getPeople, supervisedCheckCreate } from "../../utils/Supervise";
import { GetProjectDetail } from "../../utils/main";
import "./index.scss"
import { isEmpty, uploadFile, goToUrl } from '../../utils/variable';


export default function Index() {


    const [detail, setDetail] = useState<any>({});

    const [selector, setSelector] = useState<any>(['无需整改', '限期整改', '局部停工', "全面停工", "拉闸限电"]);
    const [checkList, setCheckList] = useState<any>(['监督检查', '专项抽查']);
    const [progressList, setProgressList] = useState([]);//形象进度
    const [inspectList, setInspectList] = useState<any>([]);//检查人列表
    const [inspectOpen, setInspectOpen] = useState<boolean>(false);//检查人弹窗
    const [listOption, setListOption] = useState<any>([]);//选择的数组
    const [inspectPeople, setInspectPeople] = useState<any>([]);//检查数组
    const [project, setProject] = useState<any>({});
    const {
        checkType,//检查类型
        ProgressValue,//形象进度选择第几项
        checkContent,//抽查内容
        siteCheckQuality,//现场质量抽查情况
        siteCheckSafety,//现场安全抽查情况
        siteCheckCivilization,//现场文明施工抽查情况
        attachmentIds = [],//检查附件
        attachmentFiles = [],//附件图片
        checkResult,//整改类型
        checkUserValue,//检查人选择的第几项
        checkDate,//检查日期
        dudeDate,//最迟整改日期
        problem,//存在问题
        problemAttachmentIds = [],//问题附件
        problemFiles = [],//问题图片
    } = detail


    useEffect(() => {
        getProgress();
        getInspect();
    }, [])


    //获取形象进度

    const getProgress = async () => {
        const res = await subList({ parentCodes: "qualitysafety,supervisedCheck,imageProgress" });
        setProgressList(res.data)
    }


    //获取检查人

    const getInspect = async () => {
        const projectId = Taro.getStorageSync('projectId') || "";
        const result: any = await GetProjectDetail(projectId);
        const res: any = await getPeople(result.data.govOrgId);
        for (let item of res.data) {
            item.label = item.realName;
            item.value = item.userId;
            item.chooice = 0;
        }
        setInspectList(res.data);
        setProject(result.data);
    }

    //当值发生改变
    const handleChange = (type, name, e) => {
        switch (type) {
            case "Textarea":
                detail[name] = e;
                break;
            case "Picker":
                detail[name] = e.detail.value
                break;
            case "PickerList":
                detail[name] = e.detail.value
                detail.imageProgress = progressList[e.detail.value].configCode
                break;
        }
        setDetail({ ...detail })
    }


    //打开检查人弹窗
    const openModal = () =>{
        const arr: [] = inspectList.filter(function (item) {
            return item.choose == 1;
        }).map(item => {
            return item.value
        });

        setListOption(arr)
        setInspectOpen(true)
    }

    //多选
    const changeValue = (e) => {
        setListOption(e)
    }

    //确定
    const determine = () => {
        let inspectArr:[] = [];
        for(let item of inspectList){

            if (listOption.includes(item.value)) {
                item.choose = 1;
                inspectArr.push(item.label)
            }else{
                item.choose = 0
            }
        }
        setInspectPeople(inspectArr);
        setInspectList(inspectList);
        setInspectOpen(false)
    }


    //图片变化
    const changeImage = async (type, files, operationType, index) => {
        detail[type] = files;

        if (operationType === "add" && files.length == 1) {
            type === "attachmentFiles" ? attachmentIds.push(await uploadFile(files[0])) : problemAttachmentIds.push(await uploadFile(files[0]))
        }

        if (operationType === "add" && files.length > 1) {
            type === "attachmentFiles" ? attachmentIds.push(await uploadFile(files[files.length - 1])) : problemAttachmentIds.push(await uploadFile(files[files.length - 1]))
        }

        if (operationType === "remove") {
            type === "attachmentFiles" ? problemAttachmentIds.splice(index, 1) : problemAttachmentIds.splice(index, 1)
        }
        detail.attachmentIds = attachmentIds;
        detail.problemAttachmentIds = problemAttachmentIds;
        setDetail({ ...detail })
    }


    const submit = async () => {
        detail.checkUserIds =  listOption.join();
        const list = {
            checkType: "检查类型",
            imageProgress: "形象进度",
            checkContent: "抽查内容",
            attachmentIds: "附件",
            checkResult: "整改类型",
            checkUserIds: "检查人",
            checkDate: "检查日期",
        }

        for (let key in list) {
            if (isEmpty(detail[key])) {
                Taro.showToast({ title: `请输入${list[key]}`, icon: "none", duration: 1000 });
                return false;
            }
        }

        //当检查类型等于限期整改
        if (checkResult == 1) {
            if (isEmpty(dudeDate)) {
                Taro.showToast({ title: `请填写最迟整改日期`, icon: "none", duration: 1000 });
                return false;
            }
        }


        if (checkResult == 1 || checkResult == 2) {
            if (isEmpty(problem)) {
                Taro.showToast({ title: `请填写存在问题`, icon: "none", duration: 1000 });
                return false;
            }
            if (isEmpty(problemAttachmentIds)) {
                Taro.showToast({ title: `请填写附件`, icon: "none", duration: 1000 });
                return false;
            }
        }


        detail.attachmentIds = attachmentIds.join();
        detail.problemAttachmentIds = problemAttachmentIds.join();
        detail.checkType = checkType + 1;


        const res = await supervisedCheckCreate(detail);
        if (res.code == "200") {
            Taro.showToast({ title: "提交成功", icon: "success", duration: 1000 }).then(() => {
                goToUrl({ type: "navigateBack" });
            })
        }
    }



    return (
        <View className="Supervise-page pageStyle">
            <View className="Supervise-page-content">
                <View className="Supervise-page-content-tittle">监督检查</View>
                <View className="Supervise-page-content-instru">{project?.projectName}</View>

                <View className="Supervise-page-content-box baseBox">
                    <Picker mode='selector' range={checkList} onChange={(e) => { handleChange("Picker", "checkType", e) }}>
                        <SignListItem title="检查类型:" extraText={checkList[checkType] || "请选择"} arrow="right"></SignListItem>
                    </Picker>
                    <Picker mode='selector' range={progressList} onChange={(e) => { handleChange("PickerList", "ProgressValue", e) }} rangeKey={"configName"}>
                        <SignListItem title="形象进度:" extraText={progressList[ProgressValue]?.configName || "请选择"} arrow="right"></SignListItem>
                    </Picker>

                    <TittleBar title="抽查内容:" sign>
                        <AtTextarea
                            placeholder="请简单描述问题"
                            count={false}
                            value={checkContent}
                            onChange={(e) => { handleChange("Textarea", "checkContent", e) }}
                        />
                    </TittleBar>
                    {
                        checkType != 1 && (
                            <View>
                                <TittleBar title="现场质量抽查情况：">
                                    <AtTextarea
                                        placeholder="请简单描述问题"
                                        count={false}
                                        value={siteCheckQuality}
                                        onChange={(e) => { handleChange("Textarea", "siteCheckQuality", e) }}
                                    />
                                </TittleBar>
                                <TittleBar title="现场安全抽查情况：">
                                    <AtTextarea
                                        placeholder="请简单描述问题"
                                        count={false}
                                        value={siteCheckSafety}
                                        onChange={(e) => { handleChange("Textarea", "siteCheckSafety", e) }}
                                    />
                                </TittleBar>
                                <TittleBar title="现场文明施工抽查情况：">
                                    <AtTextarea
                                        placeholder="请简单描述问题"
                                        count={false}
                                        value={siteCheckCivilization}
                                        onChange={(e) => { handleChange("Textarea", "siteCheckCivilization", e) }}
                                    />
                                </TittleBar>
                            </View>
                        )
                    }
                    <TittleBar title="附件信息:" sign>
                        <AtImagePicker
                            files={attachmentFiles}
                            onChange={(files, operationType, index) => { changeImage("attachmentFiles", files, operationType, index) }}
                        />
                    </TittleBar>

                </View>

                <View className="Supervise-page-content-box baseBox">
                    <Picker mode='selector' range={selector} onChange={(e) => { handleChange("Picker", "checkResult", e) }}>
                        <SignListItem title="整改类型:" extraText={selector[checkResult] || "请选择"} arrow="right"></SignListItem>
                    </Picker>
                    <AtListItem title="检查科室:" extraText="系统自动获取" />
                    {/* <Picker mode='selector' range={inspectList} onChange={(e) => { handleChange("PickerList1", "checkUserValue", e) }} rangeKey={"realName"}> */}
                    <SignListItem  title="检查人:" extraText={inspectPeople.join() || "请选择"} arrow="right" click={openModal}></SignListItem>
                    {/* </Picker> */}
                    <Picker mode='date' onChange={(e) => { handleChange("Picker", "checkDate", e) }}>
                        <SignListItem title="检查日期:" extraText={checkDate || "请选择"} arrow="right"></SignListItem>
                    </Picker>
                    {
                        checkResult != 0 && (
                            <AtListItem title="通知书录取编号:" extraText="系统自动获取" />
                        )
                    }
                    {
                        (isEmpty(checkResult) || checkResult == 1) && (
                            <Picker mode='date' onChange={(e) => { handleChange("Picker", "dudeDate", e) }}>
                                <SignListItem title="最迟整改日期:" extraText={dudeDate || "请选择"} arrow="right"></SignListItem>
                            </Picker>
                        )
                    }
                    {
                        checkResult != 0 && (
                            <View>
                                <TittleBar title="存在问题:" sign>
                                    <AtTextarea
                                        placeholder="请简单描述问题"
                                        count={false}
                                        value={problem}
                                        onChange={(e) => { handleChange("Textarea", "problem", e) }}
                                    />
                                </TittleBar>
                                <TittleBar title="附件信息:" sign>
                                    <AtImagePicker
                                        files={problemFiles}
                                        onChange={(files, operationType, index) => { changeImage("problemFiles", files, operationType, index) }}
                                    />
                                </TittleBar>
                            </View>
                        )
                    }

                </View>

                <FloatLayout
                    checkboxOption={inspectList}
                    onColse={() => { setInspectOpen(false) }}
                    floatName={"检查人"}
                    isOpened={inspectOpen}
                    handleChange={(e) => { changeValue(e) }}
                    checkedList={listOption}
                    onOK={() => { determine() }}
                />
                <AtButton type='primary' className="submitButton noStyleButton" onClick={() => { submit() }}>提交</AtButton>
            </View>
        </View >
    )
}
