import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { View } from "@tarojs/components";

import { AtTextarea, AtInputNumber, AtImagePicker, AtButton } from "taro-ui"
import { isEmpty } from "../../utils/variable"
import { requestImg } from "../../utils/safeAssessment"
import "./index.scss";
import request from "../../utils/request"
import { AtToast } from "taro-ui"

// 组价引入
import ListItem from "../../components/ListItem"

// 图片引入
export default function Index() {
    const location = useRouter().params;
    const { one = 0, two = 0 } = location;
    const scoreDetail = Taro.getStorageSync("scoreDetail") || {};
    const { list: local } = scoreDetail;
    const [thrList, setThrList] = useState<any>([]); //三级的数组
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const list: [] = local[one].projectCheckDictScoreItemVoList[two].projectCheckDictScoreReduceVoList;
        setThrList(list);
    },[])

    //输入内容
    const handleChange = async (type, index, e) => {
        switch (type) {
            case "inputNumber":
                thrList[index].reduceScore = e;
                break;
            case "textArea":
                thrList[index].remark = e;
                break;
            default:
                break;  
        }
        setThrList(thrList.slice());
    }
    const changePicker = async (item, ind, files, operationType, index) => {
        item.imageList = files;
        
        const scoreReduceName = item.scoreReduceName
        let copythrList = thrList;
        console.log(files,copythrList)
        console.log(scoreReduceName, copythrList)
        //上传的图片
        for (let thritem of copythrList) {
            let thrImageList = thritem.imageList

            if (thritem.scoreReduceName == scoreReduceName) {
                let fileIds = [];
                if (operationType == "remove") {
                    if (!isEmpty(item.fileAttachment)) {
                        item.fileAttachment[0].fileIds = item.fileAttachment[0].fileIds.split(",").splice(index + 1, 1).join("");
                    }
                }

                if (thrImageList.length == 1 && operationType == "add" && !isEmpty(thrImageList)) {
                    let f = thrImageList[0];
                    fileIds.push(await uploadFile(f));
                }
                if (thrImageList.length > 1 && operationType == "add" && !isEmpty(thrImageList)) {
                    let f = thrImageList[thrImageList.length - 1]
                    fileIds.push(await uploadFile(f));
                }

                if (!isEmpty(thritem.fileAttachment)) {
                    fileIds = [...fileIds, ...thritem.fileAttachment[0].fileIds.split(",")];
                    thritem.fileAttachment = [{
                        catalogCode: "standardization_score_detail_file",
                        catalogName: "扣分明细附件",
                        childrens: [],
                        configCode: "standardization_score_detail_file",
                        configId: 10370,
                        configName: "扣分明细附件",
                        configType: 2,
                        levelCode: "047012001",
                        parentId: 10369,
                        fileIds: fileIds.join(','),
                        // fileInfoList: thritem.imageList
                    }]
                } else {
                    thritem.fileAttachment = [{
                        catalogCode: "standardization_score_detail_file",
                        catalogName: "扣分明细附件",
                        childrens: [],
                        configCode: "standardization_score_detail_file",
                        configId: 10370,
                        configName: "扣分明细附件",
                        configType: 2,
                        levelCode: "047012001",
                        parentId: 10369,
                        fileIds: fileIds.join(','),
                        // fileInfoList: thritem.imageList
                    }]
                }
            }
        }

        setThrList(copythrList.slice());
    }


    const uploadFile = (item: any) => {
        setIsOpen(true)
        return new Promise(resolve => {
            const userInfo = Taro.getStorageSync("userInfo") || {};
            request({
                filename: "file",
                file: item.file.originalFileObj,
                method: "POST",
                action: "/api/core/file/upload",
                headers: {
                    "x-access-token": userInfo.authValue
                },
                onSuccess: res => {
                    if (res.code == 200) {
                        resolve(res.data.fileId);
                    } else {
                        Taro.showToast({
                            title: "附件上传失败!",
                            icon: "none",
                            duration: 2000
                        });
                        return ''
                    }
                    setIsOpen(false)
                },
                onerror: (err) => {
                    setIsOpen(false)
                }
            });
        });
    };
    const submit = async () => {
        let total: number = 0;

        let twoList = local[one].projectCheckDictScoreItemVoList[two];

        thrList.forEach(item => {
            if (item.reduceScore) {
                total += item.reduceScore
            }
        });

        //当扣分的评分总和大于应该评分的数值时
        if (total > twoList.shouldScore) {
            twoList.reduceScore = twoList.shouldScore;
            twoList.realScore = 0;
        } else {
            twoList.reduceScore = total;
            twoList.realScore = twoList.shouldScore - total;
        }

        local[one].projectCheckDictScoreItemVoList[two].projectCheckDictScoreReduceVoList = thrList;
        Taro.setStorageSync('scoreDetail', scoreDetail)
        Taro.navigateBack({ delta: 1 })
    }
    return (
        <View className="ScoreDetail-Page">
            {
                thrList.map((item, ind) => (
                    <View className="ScoreDetail-Page-box baseBox" key={item.scoreReduceId}>
                        <View className="ScoreDetail-Page-list">
                            <View className="ScoreDetail-Page-list-item">
                                {item.scoreReduceName}
                            </View>
                            <View className="ScoreDetail-Page-list-item">
                                <View>扣减分数</View>
                                <AtInputNumber
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={item.reduceScore ? item.reduceScore : 0}
                                    onChange={(e) => { handleChange("inputNumber", ind, e) }}
                                />
                            </View>
                            <View className="ScoreDetail-Page-list-otherItem">
                                <View className="ScoreDetail-Page-list-otherItem-remark">备注：</View>
                                <AtTextarea
                                    count={false}
                                    value={item.remark}
                                    placeholder='请简单描述问题'
                                    className="ScoreDetail-Page-list-AtTextarea"
                                    onChange={(e) => { handleChange("textArea", ind, e) }}
                                />
                            </View>
                            <View className="ScoreDetail-Page-list-otherItem">
                                <View className="ScoreDetail-Page-list-otherItem-remark">附件：</View>
                                <AtImagePicker
                                    files={item.imageList}
                                    onChange={(files, operationType, index) => { changePicker(item, ind, files, operationType, index) }}
                                />
                            </View>
                        </View>
                        <AtToast isOpened={isOpen} text={'上传中...'} status='loading'></AtToast>
                    </View>
                ))
            }
            <AtButton type='primary' className="submitButton noStyleButton" onClick={() => {
                submit()
            }}>提交</AtButton>
        </View>
    )
}
