
import Taro, { useRouter } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { View } from "@tarojs/components";
import { AtList, AtListItem } from "taro-ui"
import "./index.scss"
import { isEmpty, goToUrl } from '../../utils/variable';
import badge from "../../static/images/red2.png"
export default function Index() {




    return (
        <View className="PublicityDetail-page">
            <View className="PublicityDetail-page-content baseBox">
               <View className="PublicityDetail-page-content-one">
               平台升级公告（版本V1.1.0，升级时间2021-01-01 12:00）
               </View>
               <View className="PublicityDetail-page-content-two">
               产品名称：龙游县智慧建设监管云平台  
               </View>
               <View className="PublicityDetail-page-content-two">
               版本号：V1.1.0版本
               </View>
               <View className="PublicityDetail-page-content-two">
               更新时间：2021年4月25日
               </View>
               <View className="PublicityDetail-page-content-updata">更新内容</View>
               <View className="listItem">
               1、新增监督管理模块，包括【工程申报】、【监督交底】、【专项交底】、【监督检查】、【整改台账】、安全考评】、【安标评价】、【过程验收】、【完工评价】、【竣工验收】功能；
               </View>
               <View className="listItem">
               2、新增资料归档模块，包括【工程资料】、【资料管理】功能，支持施工图、excel、word等常规文件上传；
               </View>
            </View>
        </View>
    )
}
