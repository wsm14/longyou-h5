
import Taro, { useRouter } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { View } from "@tarojs/components";
import { AtList, AtListItem } from "taro-ui"
import { selectByProjectId, partyBranchHonor } from "../../utils/other"
import BasicBox from "../../components/BasicBox"

import "./index.scss"
import { isEmpty, goToUrl } from '../../utils/variable';
import badge from "../../static/images/red2.png"
export default function Index() {

    const [detail, setDetail] = useState<any>({});
    const [honorList, setHonorList] = useState<any[]>([])


    useEffect(() => {
        getDetail();
    }, [])


    const getDetail = async () => {
        const projectId = Taro.getStorageSync("projectId") || "";
        const data = {
            projectId: projectId
        }
        const res: any = await selectByProjectId(data);
        if (!isEmpty(res.data)) {
            console.log(res.partyId)
            const obj = {
                partyId: res.data.partyId,
            }
            const relust: any = await partyBranchHonor(obj);
            setDetail(res.data);
            if (!isEmpty(relust.data)) {
                setHonorList(relust.data)
            }
        }
    }


    const jump = (type, index?) => {
        goToUrl({ url: "ImagePage", param: { type: type, index: index } })
    }

    return (
        <View className="redConstruct-page">
            <View className="redConstruct-page-content">
                <View className="redConstruct-page-content-tittle">红色工地</View>
                <View className="redConstruct-page-content-instru">{detail?.projectName}党支部</View>

                {
                    !isEmpty(detail) && (
                        <BasicBox title="基本信息" color={{ background: "#E22C2C" }}>
                            <AtListItem title='党支部成立日期' extraText={detail?.establishDate} />
                            <AtListItem title='党支部批准文件' extraText='查看' arrow='right' onClick={() => { jump("approvalFileIdsList") }} />
                            <AtListItem title='党员照片集体照' extraText='查看' arrow='right' onClick={() => { jump("teamPicIdsList") }} />
                            <AtListItem title='党支部成员合计' extraText={`${detail?.mumberCount}名`} />
                        </BasicBox>
                    )
                }

                {
                    !isEmpty(honorList) && (
                        <BasicBox title="荣誉展示" color={{ background: "#E22C2C" }}>
                            {
                                honorList.map((item, index) => (
                                    <AtListItem
                                        title={item.honorTitle}
                                        note={`上报日期：${item.registerDate}`}
                                        arrow='right'
                                        thumb={badge}
                                        key={item.honorId}
                                        onClick={() => { jump("fileInfoList", index) }}
                                    />
                                ))
                            }
                        </BasicBox>
                    )
                }
            </View>
        </View>
    )
}
