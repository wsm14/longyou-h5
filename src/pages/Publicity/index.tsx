
import Taro, { useRouter } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { View } from "@tarojs/components";
import { AtList, AtListItem } from "taro-ui"
import "./index.scss"
import { isEmpty, goToUrl } from '../../utils/variable';
import badge from "../../static/images/red2.png"
export default function Index() {




    return (
        <View className="Publicity-page pageStyle">
            <View className="Publicity-page-content">
                <View className="Publicity-page-content-top">
                    <View className="Publicity-page-content-tittle">红色工地</View>
                    <View className="Publicity-page-content-instru">发布日期：2021-01-01</View>
                </View>

                <View className="Publicity-page-list baseBox">
                    <AtListItem
                        title='平台升级公告平台升级公告平台升级公告平台升级公告'
                        note='发布人：超级管理员  发布时间：2021-01-01'
                        arrow='right' />
                    <AtListItem
                        title='平台升级公告平台升级公告平台升级公告平台升级公告'
                        note='发布人：超级管理员  发布时间：2021-01-01'
                        arrow='right' />
                    <AtListItem
                        title='平台升级公告平台升级公告平台升级公告平台升级公告'
                        note='发布人：超级管理员  发布时间：2021-01-01'
                        arrow='right' />
                </View>

            </View>
        </View>
    )
}
