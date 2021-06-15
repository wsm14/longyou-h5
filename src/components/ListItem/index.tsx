
import Taro, { useState, useEffect, useRouter } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";

import "./index.scss"

interface Interface {
    children:any
  }
export default function Index(props:Interface) {
    return (
        <div>
            <View className="listItem">
                {props.children}
            </View>
        </div>
    )
}
