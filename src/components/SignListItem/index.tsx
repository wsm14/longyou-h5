import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import React, { Component, useState, useEffect, Children } from 'react';

import { View,Text} from "@tarojs/components";

import { AtListItem } from "taro-ui"

import "./index.scss"


interface Interface {
    title: string
    extraText?: string
    arrow?:any
    click?:any
}

export default function index(props:Interface) {
    const {title,extraText,arrow,click} = props;
    return (
        <div className="SignListItem-page" onClick={click}>
            <AtListItem title={title} arrow={arrow} extraText={extraText}/>
            <View className="SignListItem-page-sign">*</View>
        </div>
    )
}
