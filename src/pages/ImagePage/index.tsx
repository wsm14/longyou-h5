
import Taro, { useRouter } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { View,Image } from "@tarojs/components";
import { AtList, AtListItem } from "taro-ui"
import "./index.scss"
import { isEmpty, goToUrl } from '../../utils/variable';
import badge from "../../static/images/red2.png";

import regulation_1 from "../../static/images/regulation_1.png";


export default function Index() {


    return (
        <View className="ImagePage-page">
            <Image src={regulation_1} className="ImagePage-page-img"></Image>
        </View>
    )
}
