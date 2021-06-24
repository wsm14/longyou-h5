
import Taro from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { AtButton } from "taro-ui"
import { View } from "@tarojs/components";
import { AtInput, AtIcon } from "taro-ui"
import BasicBox from "../../components/BasicBox"
import "./index.scss"
import { isEmpty, uploadFile, goToUrl } from "../../utils/variable"
import regex from "../../utils/regex"
import AccordionBox from "../../components/AccordionBox"
import { socialEvaluationCreate } from "../../utils/other"
import { GetProjectDetail } from "../../utils/main"

export default function Index() {
    const [detail, setDetail] = useState<any>({});//提交详情
    const [projectDetail, setProjectDetail] = useState({});//项目详情
    const [starArr, setStarArr] = useState<any>(
        [
            {
                name: "扬尘防控",
                list: [0, 1, 2, 3, 4],
                count: 0,
                key: "dustControl"
            },
            {
                name: "围栏美化",
                list: [0, 1, 2, 3, 4],
                count: 0,
                key: "fenceBeautify"
            },
            {
                name: "卫生管理",
                list: [0, 1, 2, 3, 4],
                count: 0,
                key: "hygieneManagement"
            },
            {
                name: "夜间施工",
                list: [0, 1, 2, 3, 4],
                count: 0,
                key: "nightConstruction"
            },
            {
                name: "综合评价",
                list: [0, 1, 2, 3, 4],
                count: 0,
                key: "overview"
            },
        ]
    );//星星
    const [starBol, setStarBol] = useState<boolean>(false);
    const {
        evaluaterName,//姓名
        evaluaterPhone,//联系电话
    } = detail


    useEffect(() => {
        getDetail();
    }, [])

    useEffect(() => {
        countStar();
    }, [starBol])


    //项目信息
    const getDetail = async () => {
        const projectId = Taro.getStorageSync('projectId') || "";
        const res: any = await GetProjectDetail(projectId);
        setProjectDetail(res.data);
    }

    //输入改变
    const handleChange = (type, e) => {
        detail[type] = e;
        setDetail({ ...detail })
    }

    //改变星星显示
    const changeStar = (index, ind): void => {
        const newStarArr = [...starArr];
        if (newStarArr[index].count === ind + 1) {
            newStarArr[index].count = 0
        } else {
            newStarArr[index].count = ind + 1;
        }
        setStarArr(newStarArr);
        setStarBol(!starBol);
    }

    //获得综合评价  

    const countStar = () => {
        const newStarArr = starArr.slice(0, -1);
        const total: number = newStarArr.reduce((prev, cur): number => {
            return prev + cur.count
        }, 0)

        const lastStar: number = Math.floor(total / 4);
        console.log(lastStar)
        starArr[starArr.length - 1].count = lastStar;
        setStarArr([...starArr]);
    }


    const submit = async () => {
        for (let item of starArr) {
            if (item.count === 0) {
                Taro.showToast({ title: `请输入${item.name}`, icon: "none", duration: 1000 });
                return false;
            }

            detail[item.key] = item.count;
        }

        const list = {
            evaluaterName: "姓名",
            evaluaterPhone: "联系电话",
        }
        for (let key in list) {
            if (isEmpty(detail[key])) {
                Taro.showToast({ title: `请输入${list[key]}`, icon: "none", duration: 1000 });
                return false;
            }
        }

        if (!regex.isMobile.test(detail.evaluaterPhone)) {
            Taro.showToast({ title: `请输入正确的联系电话`, icon: "none", duration: 1000 });
            return false;
        }

        const res = await socialEvaluationCreate(detail)
        if (res.code == "200") {
            Taro.showToast({ title: "提交成功", icon: "success", duration: 1000 }).then(() => {
                goToUrl({ type: "navigateBack" });
            })
        }
    }

    return (
        <View className="Evaluate-page pageStyle">
            <View className="Evaluate-page-content">
                <View className="Evaluate-page-content-tittle">社会评价</View>
                <AccordionBox projectDetail={projectDetail}></AccordionBox>

                <BasicBox title="请您对该项目文明施工状况给予评价">
                    {
                        starArr.map((item, index) => (
                            <View className="listItem" key={item.name}>
                                <View className="listItem-left">{item.name}</View>
                                <View className="listItem-right">
                                    {item.list.map((val, ind) => (
                                        <AtIcon value='star-2' color={ind < item.count ? "#FFD500" : "#E1E5EF"} key={val} onClick={() => { index < 4 ? changeStar(index, ind) : null }}></AtIcon>
                                    ))}
                                </View>
                            </View>
                        ))
                    }

                </BasicBox>

                <View className="Evaluate-page-top baseBox">
                    <AtInput
                        title='评价人'
                        value={evaluaterName}
                        type='text'
                        placeholder='请输入姓名'
                        onChange={(e) => { handleChange("evaluaterName", e) }}
                    />
                    <AtInput
                        title='联系电话'
                        value={evaluaterPhone}
                        type='text'
                        placeholder='请输入联系电话'
                        onChange={(e) => { handleChange("evaluaterPhone", e) }}
                    />
                </View>
                <AtButton type='primary' className="submitButton noStyleButton" onClick={() => { submit() }}>提交</AtButton>
            </View>
        </View>
    )
}
