import Taro,{useRouter}from '@tarojs/taro';
import React, { Component,useState, useEffect}  from 'react'
import { View, Input, Image, Form } from "@tarojs/components";
import { AtButton, AtInput, AtForm } from "taro-ui";
// import { reqLogin, reqProAcc, reqIsLogin,getLoginImgCode} from "../../utils/api";
import {GETMAINCODE,GETMAINLOGIN,GEPUBLICKEY} from "../../utils/main"
import {publicEncrypt} from "../../utils/variable";
import {goToUrl} from "../../utils/variable"

import "./index.scss";

// 引入图片
import login_1 from "../../static/images/login_1.png"
import login_2 from "../../static/images/login_2.png"
import login_3 from "../../static/images/login_3.png"

function Index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [imgCode, setimgCode] = useState("");//图片验证码
  const [codeValue, setCode] = useState("");//输入的验证码
  const location = useRouter().params; 
  const {userType} = location;//type 1:政府   2:企业
  useEffect(() => {
     getImgCode();
  }, []);

 const getImgCode = async() =>{
  const res: any = await GETMAINCODE();
  setimgCode(res.data.imageBase64);
  const userInfo:any = Taro.getStorageSync("userInfo") || {};
  userInfo.authValue = res.data.authValue;
  Taro.setStorage({
    key: "userInfo",
    data: userInfo
  });
 }

  const login = async () => {
    if (username === "") {
      Taro.showToast({
        title: "请输入账号",
        icon: "none",
        duration: 1000
      });
      return;
    }
    if (password === "") {
      Taro.showToast({
        title: "请输入密码",
        icon: "none",
        duration: 1000
      });
      return;
    }
    if (codeValue === "") {
      Taro.showToast({
        title: "请输入验证码",
        icon: "none",
        duration: 1000
      });
      return;
    }
    const params = { 
      username:publicEncrypt((await GEPUBLICKEY()).data,username),
      password:publicEncrypt((await GEPUBLICKEY()).data,password),
      captcha:codeValue
    };
        const result: any = await GETMAINLOGIN(params);
        console.log(result)
        if (result.code === 200) {
            console.log(userType)
          if ((userType == "1" && (result.data.typeStr != "企业" || result.data.typeStr != "银行")) || (userType == "2" && result.data.typeStr != "政府" )) {
            Taro.setStorage({
              key: "userInfo",
              data: result.data || "{}"
            });
            Taro.showToast({
              title: "登录成功",
              icon: "success",
              duration: 1000
            }).then(() => {
              goToUrl({url:"Regulation",type:"reLaunch"});
            });

          }else{
            Taro.showToast({
              title: "不能登录",
              icon: "none",
              duration: 1000
            })
          }



          }else{
          getImgCode();
          Taro.showToast({ title: result.msg, icon: "none", duration: 1000 });
        }
  };
  
  return (
    <View className="main-page">
      <View className="main-page-tittle">
        综合治理登录入口
      </View>
      <View className="main-page-platform">
        龙游县智慧建设监管云平台
      </View>
      <AtForm className="container baseBox" onSubmit={login}>
      <AtInput
          title={<Image src={login_1}></Image>}
          type='text'
          placeholder='账号'
          value={username}
          onChange={(e: any) => {
            setUsername(e);
          }}
        />
        <AtInput
          title={<Image src={login_2}></Image>}
          type='password'
          placeholder='密码'
          value={password}
          onChange={(e: any) => {
            setPassword(e);
          }}
        />
        <AtInput
          title={<Image src={login_3}></Image>}
          type='text'
          value={codeValue}
          maxLength='4'
          placeholder='验证码'
          onChange={(e: any) => {
            setCode(e)
          }}
        >
          <Image src={imgCode} />
        </AtInput>

        <AtButton type="primary" formType="submit" className="submitButton noStyleButton ">
          登录
        </AtButton>
      </AtForm>
    </View>
  );
}
export default Index;
