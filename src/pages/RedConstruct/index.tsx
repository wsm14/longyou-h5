
import Taro, { useRouter } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { View } from "@tarojs/components";
import { AtList, AtListItem } from "taro-ui"
import { GetProgectIndexLevel } from "../../utils/main"
import BasicBox from "../../components/BasicBox"

import "./index.scss"
import { isEmpty, goToUrl } from '../../utils/variable';
import badge from "../../static/images/red2.png"
export default function Index() {

    // const [detail, setDetail] = useState<any>({}); 
    // const [project, setProject] = useState<any>({});
    // useEffect(() => {
    //     getDetail();
    // }, [])
    // const getDetail = async() =>{
    //     const projectId = Taro.getStorageSync("projectId") || "";
    //     const res: any = await GetProgectIndexLevel(projectId);
    //     setProject(res.data);
    // }
    





    return (
        <View className="redConstruct-page">
            <View className="redConstruct-page-content">
                <View className="redConstruct-page-content-tittle">红色工地</View>
                <View className="redConstruct-page-content-instru">某某某某项目AAAAA党支部，如果超过一行请折行</View>

                <BasicBox title="基本信息" color={{background:"#E22C2C"}}>
                    <AtListItem title='党支部成立日期' extraText='2021-01-01' />
                    <AtListItem title='党支部批准文件' extraText='查看' arrow='right' />
                    <AtListItem title='党员照片集体照' extraText='查看' arrow='right' />
                    <AtListItem title='党支部成员合计' extraText='20名' />
                </BasicBox>

                <BasicBox title="荣誉展示" color={{background:"#E22C2C"}}>
                    <AtListItem
                        title='安全标准化工地'
                        note='上报日期：2020-07-19'
                        arrow='right'
                        thumb={badge}
                    />
                    <AtListItem
                        title='扬尘污染治理精细化管理'
                        note='上报日期：2020-07-19'
                        arrow='right'
                        thumb={badge}
                    />
                </BasicBox>
            </View>
        </View>
    )
}
