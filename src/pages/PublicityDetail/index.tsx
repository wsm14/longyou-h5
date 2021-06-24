
import Taro, { useRouter } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { View,} from "@tarojs/components";
import { AtList, AtListItem } from "taro-ui"
import "./index.scss"
import { isEmpty, goToUrl } from '../../utils/variable';
import {noticDetail} from "../../utils/other"
export default function Index() {

    const [detail, setDetail] = useState<any>({});

    const {id} = useRouter().params;

    useEffect(() => {
        getDetail();
    }, [])


    const getDetail = async() =>{
        const res = await noticDetail(id);
        setDetail(res.data)
    }

    return (
        <View className="PublicityDetail-page">
            <View className="PublicityDetail-page-content baseBox">
               <View className="PublicityDetail-page-content-one">
               {detail?.noticeTitle}
               </View>
               <View className="PublicityDetail-page-content-two" style={{marginTop:"10px"}}>
               发布人：{detail?.reportUserName}  
               </View>
               <View className="PublicityDetail-page-content-two">
               更新时间：{detail?.reportTime}
               </View>
               <View className="PublicityDetail-page-content-updata">更新内容</View>
               <View className="listItem" dangerouslySetInnerHTML = {{__html:detail?.content}} >
               </View>
               
            </View>
        </View>
    )
}
