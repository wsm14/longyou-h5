

import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import React, { Component, useState, useEffect, Children } from 'react'
import { View, Text } from "@tarojs/components";
import {AtListItem} from "taro-ui"
import "./index.scss";
interface Interface {
    title: string
    children?: any
    style?:any
    color?:any
}
export default function Index(props: Interface) {
    const { title, children,style,color} = props;
    return (
            <View className="basicBox baseBox" style={style}>
                <View className="basicBox-icon" style={color}></View>
                <AtListItem
                    title={title}
                ></AtListItem >
                {children}
            </View>
    )
}
