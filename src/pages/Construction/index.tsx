
import Taro,{useRouter}from '@tarojs/taro';
import React, { Component,useState, useEffect}  from 'react'
import {AtButton} from "taro-ui"
import { View, Input, Image, Form, Swiper, SwiperItem } from "@tarojs/components";

import { AtList, AtListItem } from "taro-ui"
import {WorkerList} from "../../utils/emergency"
import "./index.scss"
import { goToUrl, isEmpty } from '../../utils/variable';




export default function Index() {

    const [list, setList] = useState<any>([])//


    useEffect(() => {
        getList();
    }, [])

    const getList = async() =>{

        const projectId = Taro.getStorageSync("projectId");
        const res = await WorkerList(projectId);

        setList(res.data)


    }


    return (
        <View className="construction-page pageStyle">
            <View className="construction-page-content">
                <View className="construction-page-content-tittle">工友天地</View>


                <View className="construction-page-content-box baseBox">
                <AtList>
                   {
                       !isEmpty(list)&&list.map(item=>(
                        <AtListItem title={item.workerName} extraText={item.workTypeStr} arrow='right' onClick={()=>{
                            goToUrl({url:"InquiryService",param:{id:item.workerId}})
                        }}  key={item.workerId}/>
                       ))
                   }
                </AtList>
                </View>

                <AtButton type='primary'  className="submitButton noStyleButton" onClick={()=>{
                    goToUrl({url:"InquiryService"})
                }}>查询劳务信息</AtButton>

            </View>
        </View>
    )
}
