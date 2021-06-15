
import Taro, { useRouter } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { AtButton } from "taro-ui"
import { View, Text } from "@tarojs/components";
import { AtList, AtListItem, AtInput, AtTextarea } from "taro-ui"

import {VisiterRegister} from "../../utils/main";
import regex from "../../utils/regex"

import TittleBar from "../../components/TittleBar"
import BasicBox from "../../components/BasicBox"

import "./index.scss"
import { isEmpty,goToUrl } from '../../utils/variable';

export default function Index() {

    const [detail, setDetail] = useState<any>({}); 
    
    
    //输入值变化
    const handleChange = (type,e)=>{
        detail[type] = e;
        setDetail({...detail});
    }


    


    const {
        visiterName,//登记人姓名
        visiterPhone,//来访电话
        visiterReason,//来访事由
    } = detail; 


    //提交
    const submit = async() =>{

        const projectId = Taro.getStorageSync("projectId") || {};


        if(isEmpty(visiterName)){
            Taro.showToast({title: "请填写登记人姓名",icon: "none",duration: 1000});
              return false;
        }

        if(isEmpty(visiterPhone)){
            Taro.showToast({title: "请填写手机号",icon: "none",duration: 1000});
              return false;
        }


        if(!regex.isMobile.test(visiterPhone)){
            Taro.showToast({title: "手机号格式错误",icon: "none",duration: 1000});
              return false;
        }

        if(isEmpty(visiterReason)){
            Taro.showToast({title: "请填写事由",icon: "none",duration: 1000});
              return false;
        }

        detail.projectId = projectId;

        const res = await VisiterRegister(detail);
        if (res.code == "200") {
            Taro.showToast({title: "提交成功",icon: "success", duration: 1000}).then(()=>{
                goToUrl({type:"navigateBack"});
            })
        }
    }
    return (
        <View className="visit-page pageStyle">
            <View className="visit-page-content">
                <View className="visit-page-content-tittle">来访登记</View>
                <View className="visit-page-content-instru">欢迎您到【XXX项目】，未经允许不得进入施工现场。进入现场后，请您带上安全帽，不得擅自闯入施工区域！如果超过一行请折行</View>

                <BasicBox title="登记信息">
                    <AtInput
                        value={visiterName}
                        title='姓名'
                        type='text'
                        placeholder='请输入'
                        onChange={(e)=>{handleChange("visiterName",e)}}
                    />
                    <AtInput
                        title='联系电话'
                        value={visiterPhone}
                        type='number'
                        placeholder='请输入联系电话'
                        onChange={(e)=>{handleChange("visiterPhone",e)}}
                    />
                    <TittleBar title="事由:">
                        <AtTextarea
                            maxLength={200}
                            value={visiterReason}
                            placeholder='请输入事由'
                            className="titleBar-textarea"
                            onChange={(e)=>{handleChange("visiterReason",e)}}
                        />
                    </TittleBar>
                    <AtButton type='primary' className="submitButton noStyleButton" onClick={()=>{submit()}}>提交</AtButton>
                </BasicBox>
            </View>
        </View>
    )
}
