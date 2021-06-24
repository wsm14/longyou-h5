
import Taro, { useRouter } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { View, ScrollView, Picker } from "@tarojs/components";
import { AtList, AtListItem, AtIcon } from "taro-ui"
import "./index.scss"
import { isEmpty, goToUrl } from '../../utils/variable';
import { noticeList } from "../../utils/other"
export default function Index() {
    const [list, setList] = useState<any>([]);//列表
    const [pageNum, setPageNum] = useState<number>(0);//页码
    const [reportTime, setReportTime] = useState<string>("");//发布时间

    useEffect(() => {
        const data = {
            pageNum: 1,
            pageSize: 20,
            reportTime: reportTime
        }
        getListFir(data);
    }, [])

    const getListFir = async (data) => {
        const res = await noticeList(data);
        setList(res.data.list);
        setPageNum(pageNum + 1);
    }



    const getList = async (data) => {
        const res = await noticeList(data);
        if (!isEmpty(res.data.list)) {
            setList(list.concat(res.data.list));
            setPageNum(pageNum + 1);
        } else {
            setList(list.concat(res.data.list));
            Taro.showToast({ title: "暂无更多数据", icon: "none", duration: 1000 });
            return false;
        }
    }
    //滚动请求
    const scrollBottom = () => {
        const data = {
            pageNum: pageNum + 1,
            pageSize: 20,
            reportTime: reportTime
        }
        getList(data);
    }

    const onDateChange = (e) => {
        setReportTime(e.detail.value);
        const data = {
            pageNum: 1,
            pageSize: 20,
            reportTime: e.detail.value
        }
        getListFir(data);
    }

    return (
        <View className="Publicity-page pageStyle">
            <View className="Publicity-page-content">
                <View className="Publicity-page-content-top">
                    <View className="Publicity-page-content-tittle">公示信息</View>
                    <Picker mode='date' onChange={(e) => { onDateChange(e) }}>
                        <View className="Publicity-page-content-instru">
                            {`发布日期：${reportTime}`}
                            <AtIcon value='chevron-right' size='30'></AtIcon>
                        </View>
                    </Picker>
                </View>
                <ScrollView
                    scrollY
                    className="scrollView"
                    lowerThreshold={30}
                    onScrollToLower={scrollBottom}
                >
                    <View className="Publicity-page-list baseBox" >

                        {
                            !isEmpty(list) && list.map(item => (
                                <AtListItem
                                    title={item.noticeTitle}
                                    note={`发布人：${item.reportUserName}  发布时间：${item.reportTime}`}
                                    arrow='right'
                                    key={item.noticeId}
                                    onClick={() => { goToUrl({ url: "PublicityDetail", param: { id: item.noticeId } }) }}
                                />
                            ))
                        }

                    </View>
                </ScrollView>
            </View>
        </View>
    )
}
