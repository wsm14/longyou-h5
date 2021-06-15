
import Taro, { useRouter} from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { AtButton } from "taro-ui"
import { View, Text } from "@tarojs/components";
import { AtList, AtListItem, AtInput, AtTextarea } from "taro-ui"

import TittleBar from "../../components/TittleBar"
import BasicBox from "../../components/BasicBox"
import { isEmpty,goToUrl } from '../../utils/variable';
import {EmergencyManagementReportCreate} from "../../utils/emergency"
import regex from "../../utils/regex"
import "./index.scss"

export default function Index() {

    const [detail, setDetail] = useState<any>({}); 
    
    const {
        reporterName,//报告人
        reporterPhone,//报告人手机号
        reportSituation,//报告情况
    } = detail;
    
    const {id,name} = useRouter().params;


    //输入值变化
    const handleChange = (type,e)=>{
        detail[type] = e;
        setDetail({...detail});
    }

    //提交
    const submit = async() =>{
        if(isEmpty(reporterName)){
            Taro.showToast({
                title: "请填写报告人姓名",
                icon: "none",
                duration: 1000
              });
              return false;
        }

        if(isEmpty(reporterPhone)){
            Taro.showToast({
                title: "请填写报告人手机号",
                icon: "none",
                duration: 1000
              });
              return false;
        }

        if(isEmpty(reportSituation)){
            Taro.showToast({
                title: "请填写报告情况",
                icon: "none",
                duration: 1000
              });
              return false;
        }


        if(!regex.isMobile.test(reporterPhone)){
            Taro.showToast({
                title: "手机号格式错误",
                icon: "none",
                duration: 1000
              });
              return false;
        }
        detail.emergencyManagementId = id;
        console.log(detail)
        const res = await EmergencyManagementReportCreate(detail);
        if (res.code == "200") {
            Taro.showToast({title: "提交成功",icon: "success", duration: 1000}).then(()=>{
                goToUrl({type:"navigateBack"});
            })
        }
    }
 
    return (
        <View className="EmergencyReport-page pageStyle">
            <View className="EmergencyReport-page-content">
                <View className="EmergencyReport-page-content-tittle">应急管理</View>
                <View className="EmergencyReport-page-content-instru">{name}</View>

                <BasicBox title="报告信息">
                <AtInput
                        title='报告人'
                        value={reporterName}
                        type='text'
                        placeholder='请输入'
                        onChange={(e)=>{handleChange("reporterName",e)}}
                    />
                    <AtInput
                        title='报告电话'
                        value={reporterPhone}
                        type='number'
                        placeholder='请输入联系电话'
                        onChange={(e)=>{handleChange("reporterPhone",e)}}
                    />
                    <TittleBar title="报告情况:">
                        <AtTextarea
                            count={false}
                            value={reportSituation}
                            placeholder='请输入报告情况'
                            className="titleBar-textarea"
                            onChange={(e)=>{handleChange("reportSituation",e)}}
                        />
                    </TittleBar>


                    <AtButton type='primary' className="submitButton noStyleButton" onClick={()=>{submit()}}>提交</AtButton>
                </BasicBox>
                    
            </View>



           
        </View>
    )
}
