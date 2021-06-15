
import Taro, { useRouter } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { AtButton } from "taro-ui"
import { View, Text, Image } from "@tarojs/components";
import { AtList, AtListItem, AtInput, AtTextarea } from "taro-ui"
import {goToUrl, isEmpty} from "../../utils/variable"
import TittleBar from "../../components/TittleBar"
import BasicBox from "../../components/BasicBox"
import "./index.scss"
import index from "../../static/images/index_1.png"
import {SelectByProjectId} from "../../utils/emergency"



export default function Index() {

    const [detail, setDetail] = useState<any>({});//


    useEffect(() => {
        getDetail();
    }, [])


    const getDetail = async() =>{
        const id = Taro.getStorageSync("projectId")
        const res = await SelectByProjectId(id);
        setDetail(res.data);
    }


    const {
        teamLeaderName,//队长
        teamLeaderPhone,//队长电话
        teamViceName,//副队长
        teamVicePhone,//副队长电话
        teamMembers,//队员名单
        refuge,//避难所地点
        refugeLinkMan,//避难所联系人
        refugeLinkPhone,//避难所电话
        fileInfoList=[],//图片
        projectName,//项目名称
    }=detail
    return (
        <View className="Emergency-page pageStyle">
            <View className="Emergency-page-content">
                <View className="Emergency-page-content-tittle">应急管理</View>
                <View className="Emergency-page-content-instru">{projectName}</View>
                <AtButton type='primary' className="goUrlButton noStyleButton" onClick={() => {
                    goToUrl({url: "Emergency_report",param:{id:detail.emergencyManagementId,name:projectName}});
                }}>一键紧急报告</AtButton>
                <BasicBox title="本项目应急救援队">
                    <AtListItem title='队长' extraText={teamLeaderName} />
                    <AtListItem title='联系电话' extraText={teamLeaderPhone} />
                    <AtListItem title='副队长' extraText={teamViceName} />
                    <AtListItem title='联系电话' extraText={teamVicePhone} />
                    <View className="Emergency-page-content-teamTitle">队员名单：</View>
                    <View className="Emergency-page-content-teamNumber">{teamMembers}</View>
                </BasicBox>


                <BasicBox title="应急避难场所">
                    <AtListItem title='位置' extraText={refuge} />
                    <AtListItem title='联系人' extraText={refugeLinkMan} />
                    <AtListItem title='联系电话' extraText={refugeLinkPhone} />
                    <View className="imgDescribe">
                        <View className="imgDescribe-title">
                            应急避难所照片:
                        </View>
                        <View className="imgDescribe-imgContent">
                            {
                                !isEmpty(fileInfoList)&&fileInfoList.map(item=>(
                                    <Image src={item.fileUrl} key={item.fileId}></Image>
                                ))
                            }
                        </View>
                    </View>
                </BasicBox>
            </View>
        </View>
    )
}
