

import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import React, { Component, useState, useEffect, Children } from 'react'
import { View,Text} from "@tarojs/components";

import "./index.scss";
interface Interface {
    title: string
    sign?: boolean
    children?:any,
    style?:any
}
export default function Index(props: Interface) {
    const { title, sign,children,style} = props;
    return (
        <div>
            <View className="titleBar" style={style}>
                <View className="titleBar-title">
                    {
                        sign&&(
                            <Text className="titleBar-title-sign">*</Text>
                        )
                    }
                            {title}
                </View>
                {children}
            </View>
        </div>
    )
}
