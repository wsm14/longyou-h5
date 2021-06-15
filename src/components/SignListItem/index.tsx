import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import React, { Component, useState, useEffect, Children } from 'react';

import { View,Text} from "@tarojs/components";

import { AtListItem } from "taro-ui"

import "./index.scss"


interface Interface {
    title: string
    extraText?: string
    arrow?:any
}

export default function index(props:Interface) {
    const {title,extraText,arrow} = props;
    return (
        <div className="SignListItem-page">
            <AtListItem title={title} arrow={arrow} extraText={extraText}/>
            <View className="SignListItem-page-sign">*</View>
        </div>
    )
}
