
import Taro, { useRouter } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { AtButton, AtInput } from "taro-ui"
import { View } from "@tarojs/components";

import { AtList, AtListItem } from "taro-ui"
import { isEmpty } from "../../utils/variable"
import { SearchWorker, FindWorkerInfo } from "../../utils/emergency"
import "./index.scss"

export default function Index() {

    const [detail, setDetail] = useState<any>({});

    const { id } = useRouter().params//员工id

    const [name, setName] = useState()

    const [projectMsg, setProjectMsg] = useState<any>({});

    const [year, setYear] = useState<any>(new Date().getFullYear());//年
    const [month, setMonth] = useState<any>(new Date().getMonth());//月

    useEffect(() => {

        if (!isEmpty(id)) {
            getDetail(id);
        }


    }, [])


    const getDetail = async (id) => {

        const res = await FindWorkerInfo(id);
        setProjectMsg(res.data);
    }




    const handleChange = (e) => {
        setName(e)
    }


    const submit = async () => {
        if (isEmpty(name)) {
            Taro.showToast({ title: "请输入身份证或者姓名", icon: "none", duration: 1000 });
            return false;
        }
        const projectId = Taro.getStorageSync("projectId");
        detail.workerName = name;
        detail.projectId = projectId;
        const res = await SearchWorker(detail);
        console.log(res.data[0])
        if (!isEmpty(res.data[0])) {
            setProjectMsg(res.data[0]);
        }else{
            setProjectMsg({});
        }
        
    }


    const {
        workerName,//员工姓名
        gender,//性别
        age,//年龄
        cellPhone,//手机号码
        corpName,//所属公司
        teamName,//班组
        workTypeStr,//工种
        attendDayByYear,//年考勤天数
        attendDayByMonth,//月考勤天数
        projectName,//项目名称
    } = projectMsg



    return (
        <View className="InquiryService-page pageStyle">
            <View className="InquiryService-page-content">
                <View className="InquiryService-page-content-tittle">劳务信息</View>
                <View className="InquiryService-page-content-box baseBox">
                    <AtInput
                        title='标准五个字:'
                        value={name}
                        type='text'
                        placeholder="请输入身份证号或者姓名"
                        onChange={(e) => { handleChange(e) }}
                    />
                    <AtButton type='primary' className="submitButton noStyleButton" onClick={() => { submit() }}>查询</AtButton>
                    {
                        !isEmpty(projectMsg) && (
                            <View>
                                <AtList>
                                    <View>
                                        <AtListItem title='工人姓名：' extraText={workerName} />
                                        <AtListItem title='工人性别：' extraText={gender} />
                                        <AtListItem title='工人年龄: ' extraText={age} />
                                        <AtListItem title='手机号码：' extraText={cellPhone} />
                                        <AtListItem title='所属企业：' extraText={corpName} />
                                        <AtListItem title='当前班组：' extraText={teamName} />
                                        <AtListItem title='当前工种：' extraText={workTypeStr} />
                                    </View>
                                </AtList>
                                <View className="InquiryService-page-content-box-bottom1">
                                    您在【杭州市智慧工地实名制管理应用系统】中，项目{projectName}：
                                </View>
                                <View className="InquiryService-page-content-box-bottom2">
                                    {year}年登记考勤的天数为{attendDayByYear}天，{year}年{month}月登记考勤的天数为{attendDayByMonth}天；
                                </View>
                            </View>
                        )
                    }
                </View>
            </View>
        </View>
    )
}
