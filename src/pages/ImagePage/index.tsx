
import Taro, { useRouter } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { View, Image } from "@tarojs/components";
import { AtList, AtListItem } from "taro-ui"
import "./index.scss"
import { isEmpty, goToUrl } from '../../utils/variable';
import { selectByProjectId, partyBranchHonor } from "../../utils/other"
import badge from "../../static/images/red2.png";




export default function Index() {

    const [fileList, setFileList] = useState<any>({});
    const { type,index = 0} = useRouter().params;
    useEffect(() => {
        getDetail();
    }, [])


    const getDetail = async () => {
        const projectId = Taro.getStorageSync("projectId") || "";
        const data = {
            projectId: projectId
        }
        const res: any = await selectByProjectId(data);
        const obj = {
            partyId: res.data.partyId,
        }
        const relust: any = await partyBranchHonor(obj);
        console.log(type)
        if (type === "approvalFileIdsList") {
            setFileList(res.data.approvalFileIdsList)
        } else if (type === "teamPicIdsList") {
            setFileList(res.data.teamPicIdsList)
        } else if (type === "fileInfoList") {
            setFileList(relust.data[index].fileInfoList)
        }
    }


    return (
        <View className="ImagePage-page">
            <View className="ImagePage-page-list">
                {
                    !isEmpty(fileList) && fileList.map(item => (
                        <Image src={item.fileUrl} className="ImagePage-page-img" key={item.fileId}></Image>
                    ))
                }

            </View>
        </View>
    )
}
