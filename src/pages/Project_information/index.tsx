import Taro,{useRouter,useDidShow}from '@tarojs/taro';
import React, { Component,useState, useEffect}  from 'react'
import { View, Input, Image, Form, Swiper, SwiperItem } from "@tarojs/components";
import { AtButton, AtList, AtListItem } from 'taro-ui'
import { GetDeviceNumber, GetProjectDetail } from "../../utils/main";
import { isEmpty } from "../../utils/variable"
import "./index.scss"

// 引入图片
import information_1 from "../../static/images/information_1.png";
import information_2 from "../../static/images/information_2.png";
import information_3 from "../../static/images/information_3.png";
import information_4 from "../../static/images/information_4.png";
import information_5 from "../../static/images/information_5.png";
import information_6 from "../../static/images/information_6.png";

export default function Index() {

    const projectId = Taro.getStorageSync('projectId') || "";
    const [topDetail, setTopDetail] = useState<any>([]); //上方6个块的数据
    const [detail, setDetail] = useState<any>({});//项目详情
    useEffect(() => {
        getTopDetail();
        getDetail();
    }, [])


    //获取上面9个信息

    const getTopDetail = async () => {
        const res: any = await GetDeviceNumber(projectId);
        setTopDetail(res.data);
    }


    const getDetail = async () => {
        const res: any = await GetProjectDetail(projectId);
        console.log(res)
        setDetail(res.data);
    }



    return (
        <View className="Infomation-Page">
            <View className="Infomation-Page-bac">
                <View className="Infomation-Page-top">
                </View>
                <View className="Infomation-Page-bac-padding">
                    <View className="Infomation-Page-bac-tittle">{detail.projectName}</View>
                    {
                        !isEmpty(detail) && (
                            <View className="Infomation-Page-bac-intru">
                                {detail.projectCorpList[0].corpName}
                            </View>
                        )
                    }

                    {
                        !isEmpty(topDetail) && (
                            <View className="Infomation-Page-block">
                                <View className="Infomation-Page-block-item">
                                    <View className="Infomation-Page-block-item-tittle">
                                        未闭合整改单数量
                            </View>
                                    <View className="Infomation-Page-block-item-intru">
                                        <Image src={information_1} className="Infomation-Page-block-item-intru-img"></Image>
                                        <View>{topDetail[0].businessNum}</View>
                                    </View>
                                </View>
                                <View className="Infomation-Page-block-item">
                                    <View className="Infomation-Page-block-item-tittle">
                                        扬尘噪音监控数量
                            </View>
                                    <View className="Infomation-Page-block-item-intru">
                                        <Image src={information_2} className="Infomation-Page-block-item-intru-img"></Image>
                                        <View>{topDetail[1].businessNum}</View>
                                    </View>
                                </View>
                                <View className="Infomation-Page-block-item">
                                    <View className="Infomation-Page-block-item-tittle">
                                        塔机黑匣子数量
                            </View>
                                    <View className="Infomation-Page-block-item-intru">
                                        <Image src={information_3} className="Infomation-Page-block-item-intru-img"></Image>
                                        <View>{topDetail[2].businessNum}</View>
                                    </View>
                                </View>
                                <View className="Infomation-Page-block-item">
                                    <View className="Infomation-Page-block-item-tittle">
                                        升降机黑匣子数量
                            </View>
                                    <View className="Infomation-Page-block-item-intru">
                                        <Image src={information_4} className="Infomation-Page-block-item-intru-img"></Image>
                                        <View>{topDetail[3].businessNum}</View>
                                    </View>
                                </View>
                                <View className="Infomation-Page-block-item">
                                    <View className="Infomation-Page-block-item-tittle">
                                        视频监控数量
                            </View>
                                    <View className="Infomation-Page-block-item-intru">
                                        <Image src={information_5} className="Infomation-Page-block-item-intru-img"></Image>
                                        <View>{topDetail[4].businessNum}</View>
                                    </View>
                                </View>
                                <View className="Infomation-Page-block-item">
                                    <View className="Infomation-Page-block-item-tittle">
                                        起重机械安装数量
                            </View>
                                    <View className="Infomation-Page-block-item-intru">
                                        <Image src={information_6} className="Infomation-Page-block-item-intru-img"></Image>
                                        <View>{topDetail[5].businessNum}</View>
                                    </View>
                                </View>
                            </View>
                        )
                    }

                    {/* 下方介绍 */}

                    <View className="Infomation-Page-bottom baseBox">
                        <AtList >
                            <AtListItem title='所属科室' extraText={detail.belongOfficeName} />
                            <AtListItem title='监督人员' extraText={detail.superviseUserNames} />
                            <AtListItem title='施工许可证' extraText={detail.builderLicenseNumber} />
                            <AtListItem title='项目所在地' extraText={detail.areaAddress} />
                            <AtListItem title='项目类别' extraText={detail.categoryStr} />
                            <AtListItem title='工程状态' extraText={detail.projectStatusStr} />
                            <AtListItem title='开工日期' extraText={detail.startDate} />
                            <AtListItem title='总造价（万元）' extraText={detail.invest} />
                            <AtListItem title='建筑面积（平方米）' extraText={detail.buildingArea} />
                        </AtList>
                    </View>

                </View>
            </View>


        </View>
    )
}
