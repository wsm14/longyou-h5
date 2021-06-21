

import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import React, { Component, useState, useEffect, Children, memo } from 'react'
import { View,Text} from "@tarojs/components";
import {AtAccordion,AtListItem} from "taro-ui";
import {isEmpty} from "../../utils/variable"

import "./index.scss";
interface Interface {
    projectDetail?:any
}
function Index(props: Interface) {
    const [open, setOpen] = useState(false);
    const {projectDetail={}} = props;
    console.log("111111")
    return (
        <div>
            <View className="accordionBox baseBox">
                    <AtAccordion
                        open={open}
                        onClick={() => { setOpen(!open) }}
                        title='项目信息'
                    >
                        <View className="accordionBox-address">{projectDetail.projectName}</View>
                        {
                            !isEmpty(projectDetail.projectCorpList) && projectDetail.projectCorpList.map(item => (
                                <AtListItem
                                    title={`${item.corpTypeStr}：`}
                                    note={item.corpName}
                                    key={item.projectCorpId}
                                />
                            ))
                        }
                    </AtAccordion>
                    {
                        !open && (
                            <View className="accordionBox-address">{projectDetail.projectName}</View>
                        )
                    }
                    <View className="accordionBox-icon"></View>
                </View>
        </div>
    )
}

export default memo(Index);
