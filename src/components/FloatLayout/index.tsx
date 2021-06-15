

import Taro,{useRouter,useDidShow}from '@tarojs/taro';
import React, {Component,useState, useEffect}  from 'react'
import { View, Image } from "@tarojs/components";

import {AtCheckbox,AtFloatLayout} from "taro-ui"

import "./index.scss";
interface Interface {
    checkboxOption: any,
    onColse:any,
    isOpened:boolean,
    handleChange:any,
    checkedList:any,
    onOK:any
  }
export default function Index(props:Interface) {
    const {checkboxOption,onColse,isOpened,handleChange,checkedList,onOK} = props;
    return (
        <div>
            <AtFloatLayout isOpened={isOpened} scrollY onClose={()=>{onColse()}}>
                <View className="FloatLayout-button">
                    <View onClick={()=>{onColse()}}>取消</View>
                    <View>编辑项目</View>
                    <View onClick={()=>{onOK()}}>确定</View>
                </View>
                <AtCheckbox
                options={checkboxOption}
                selectedList={checkedList}
                onChange={(e)=>{handleChange(e)}}
                />
            </AtFloatLayout>
        </div>
    )
}
