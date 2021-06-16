
import Taro, { useRouter } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { AtButton } from "taro-ui"
import { View, Image, Picker } from "@tarojs/components";
import { AtList, AtListItem, AtAccordion, AtTextarea, AtImagePicker, AtSteps } from "taro-ui"
import { findCheckById, completeProcessTask, noticeRecord,findSuperviseCheckIdByNoticeId} from "../../utils/Supervise"
import TittleBar from "../../components/TittleBar";
import SignListItem from "../../components/SignListItem"
import { isEmpty, uploadFile, goToUrl } from "../../utils/variable"
import "./index.scss"

import index from "../../static/images/index_1.png"

export default function Index() {

    const [items, setItems] = useState<any>([
        { 'title': '现场整改' },
        { 'title': '整改审批' },
    ])//分类

    const { businessId, taskId } = useRouter().params
    const [inspectOpen, setInspectOpen] = useState<boolean>();//检查内容展开合上
    const [changeOpen, setChangeOpen] = useState<any>();//整改内容的展开合上
    const [detail, setDetail] = useState<any>({});
    const [otherdetail, setOtherdetail] = useState<any>([]);//其他信息
    const [editDetail, setEditDetail] = useState<any>({});//提交的值

    const {
        approvalOpinion,//内容
        attachmentIds = [],//图片id
        attachmentFiles = [],//图片
    } = editDetail

    useEffect(() => {
        getDetail();
        getOtherDetail();
    }, [])


    //获取详情
    const getDetail = async () => {
        const result = await findSuperviseCheckIdByNoticeId(businessId);
        const res = await findCheckById(result.data);
        setDetail(res.data);
    }

    //获取其他详情
    const getOtherDetail = async () => {
        const res = await noticeRecord(businessId);
        setOtherdetail(res.data);
    }

    //图片变化
    const changeImage = async (type, files, operationType, index) => {
        editDetail[type] = files;

        if (operationType === "add" && files.length == 1) {
            attachmentIds.push(await uploadFile(files[0]))
        }

        if (operationType === "add" && files.length > 1) {
            attachmentIds.push(await uploadFile(files[files.length - 1]))
        }

        if (operationType === "remove") {
            attachmentIds.splice(index, 1)
        }
        editDetail.attachmentIds = attachmentIds
        setDetail({ ...editDetail })
    }

    const handleChange = (type, name, e) => {
        switch (type) {
            case "Textarea":
                editDetail[name] = e;
                break;
            case "Picker":
                editDetail[name] = e.detail.value;
                break;
        }

        setDetail({ ...editDetail })
    }

    const submit = async () => {
        if (isEmpty(approvalOpinion)) {
            Taro.showToast({ title: `请输入整改描述情况`, icon: "none", duration: 1000 });
            return false;
        }

        if (isEmpty(attachmentIds)) {
            Taro.showToast({ title: `请输入附件信息`, icon: "none", duration: 1000 });
            return false;
        }

        
        editDetail.assigneeId = otherdetail[0].assigneeId;
        editDetail.noticeId = businessId;
        editDetail.assigneeName = otherdetail[0].assigneeName;
        editDetail.processTaskId = taskId;
        editDetail.attachmentIds = attachmentIds.join();
        const res = await completeProcessTask(editDetail);
        if (res.code == "200") {
            Taro.showToast({title: "提交成功",icon: "success", duration: 1000}).then(()=>{
                goToUrl({type:"navigateBack"});
            })
        }


    }

    return (
        <View className="SuperviseDetail-page">
            <View className="SuperviseDetail-page-box baseBox">
                <View className="SuperviseDetail-page-box-title">{detail.projectName}</View>
                <AtSteps
                    items={items}
                    current={0}
                />
            </View>
            <View className="SuperviseDetail-page-box1 baseBox">
                <AtAccordion
                    open={inspectOpen}
                    title='检查内容'
                    onClick={() => { setInspectOpen(!inspectOpen) }}
                >
                    <AtListItem title='检查类型' extraText={detail?.checkTypeStr} />
                    <AtListItem title='形象进度' extraText={detail?.imageProgressStr} />
                    <AtListItem title='抽查内容：' note={detail?.checkContent} />
                    <AtListItem title='现场安全抽查情况：' note={detail?.siteCheckSafety} />
                    <View className="SuperviseDetail-page-box1-content">
                        <View className="SuperviseDetail-page-box1-title">
                        附件信息：
                        </View>
                        <View className="SuperviseDetail-page-box1-imgContent">
                        {
                                !isEmpty(detail.recordFileList)&&detail.recordFileList.map(item=>(
                                    <Image src={item.fileUrl}></Image>
                                ))
                            }
                        </View>
                    </View>
                </AtAccordion>
            </View>
            <View className="SuperviseDetail-page-box1 baseBox">
                <AtAccordion
                    open={changeOpen}
                    title='整改内容'
                    onClick={() => { setChangeOpen(!changeOpen) }}
                >
                    <AtListItem title='整改类型' extraText={detail?.noticeTypeStr} />
                    <AtListItem title='所属科室' extraText={detail?.department} />
                    <AtListItem title='检查人' extraText={detail?.checkUserNames} />
                    <AtListItem title='检查日期' extraText={detail?.checkDate} />
                    <AtListItem title='通知书编号' extraText={detail?.noticeCode} />
                    <AtListItem title='最迟整改完成日期' extraText={detail?.dudeDate} />
                    <AtListItem title='存在问题：' note={detail?.problem} />
                    <View className="SuperviseDetail-page-box1-content">
                        <View className="SuperviseDetail-page-box1-title">
                        附件信息：
                        </View>
                        <View className="SuperviseDetail-page-box1-imgContent">
                        {
                                !isEmpty(detail.problemFileList)&&detail.problemFileList.map(item=>(
                                    <Image src={item.fileUrl}></Image>
                                ))
                            }
                        </View>
                    </View>
                </AtAccordion>
            </View>


            <View className="SuperviseDetail-page-box1 baseBox" style={{ paddingBottom: "12px" }}>
                <TittleBar title="整改情况描述：">
                    <AtTextarea
                        count={false}
                        value={approvalOpinion}
                        placeholder='请简单描述问题：'
                        onChange={(e) => { handleChange("Textarea", "approvalOpinion", e) }}
                    />
                </TittleBar>
                <TittleBar title="整改情况描述：">
                    <AtImagePicker
                        files={attachmentFiles}
                        onChange={(files, operationType, index) => { changeImage("attachmentFiles", files, operationType, index) }}
                    />
                </TittleBar>
            </View>


            <AtButton type='primary' className="submitButton noStyleButton" onClick={submit}>提交</AtButton>
        </View>
    )
}
