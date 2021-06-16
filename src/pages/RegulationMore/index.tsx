import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { View, ScrollView } from "@tarojs/components";
import { ProcessTaskList } from "../../utils/main"
import { AtList, AtListItem } from "taro-ui"
import {isEmpty,goToUrl} from "../../utils/variable"
import "./index.scss";

// 图片引入

export default function Index() {

    const [list, setList] = useState<any>([]);//列表
    const [pageNum, setPageNum] = useState<number>(0);//页码
    useDidShow(()=>{
        getList();
    })

    const getList = async () => {
        const data = {
            pageNum:pageNum + 1,
            pageSize:20,
            processDefinitionKeys:  "RectificationNotice"
        }
        const res = await ProcessTaskList(data);
        if (!isEmpty(res.data)) {
            setList(list.concat(res.data.list));
            setPageNum(pageNum + 1);
        }else{
            Taro.showToast({title: "暂无更多数据",icon: "none",duration: 1000});
              return false;
        }
    }


    const scrollBottom = () => {
        getList();
    }

     //跳转
     const jump = (item) =>{

        if (item.taskKey == "submit") {
            goToUrl({
                url:"SuperviseDetail",
                param:{
                    businessId:item.businessId,
                    taskId:item.taskId
                }
            })
        }else if (item.taskKey == "approval") {
            goToUrl({
                url:"SuperviseDetailz",
                param:{
                    businessId:item.businessId,
                    taskId:item.taskId
                }
            })
        }

        
    }

    return (
        <View className="RegulationMore-Page">
             <ScrollView
                    scrollY
                    style={{ height: "100vh" }}
                    lowerThreshold={30}
                    onScrollToLower={scrollBottom}
                >
            <View className="RegulationMore-Page-list baseBox">
               
                    <AtList>
                        <AtListItem title='待办事项' className="RegulationMore-Page-list-first" />

                        <View>
                            {
                                list.map(item => (
                                    <AtListItem title={item.taskName} note={item.businessName} key={item.processInstanceId} onClick={()=>{jump(item)}}/>
                                ))
                            }
                        </View>
                   
                </AtList>
               
            </View>
            </ScrollView>
        </View >
    )
}
