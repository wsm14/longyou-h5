import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import React, { Component, useState, useEffect } from 'react'
import { View, Input, Image, Form, Swiper, SwiperItem, Picker } from "@tarojs/components";
import { AtList, AtListItem, AtAccordion, AtCheckbox, AtButton, AtImagePicker } from "taro-ui"
import { GETALLLIST } from "../../utils/safeAssessment";
import { GetProgectIndexLevel } from "../../utils/main";
import { submitSafe } from "../../utils/safeAssessment"
import { isEmpty, formatDateTime } from "../../utils/variable"
import request from "../../utils/request"
import "./index.scss";
import { AtToast } from "taro-ui"
import { cloneDeep } from 'lodash'


// 组件引入
import FloatLayout from "../../components/FloatLayout"


// 图片引入
import SafeAssessment_1 from "../../static/images/SafeAssessment_1.png";
import SafeAssessment_2 from "../../static/images/SafeAssessment_2.png";

export default function Index() {
    const [safeList, setSafeList] = useState<any>([])
    const [level, setLevel] = useState<any>()//等级
    const [isOpened, setisOpened] = useState<boolean>(false);//编辑项目弹窗
    const [status, setstatus] = useState(["优秀", "合格", "不合格"]);//选择框
    const [countBol, setcountBol] = useState(false);//判断是否计算
    const [imageList, setImageList] = useState<any>();//图片上传列表
    const [checkList, setCheckList] = useState([]);
    const [total, setTotal] = useState(0);//总分
    const [submitList, setSubmitList] = useState<any>();//十项提交的数组
    const [checkboxOption, setstateCheckboxOption] = useState([]);
    const [detail, setDetail] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const [isOpen, setIsOpen] = useState(false)

    const safeCheckType: any[] = [
        { id: '1', itemName: '安全管理', childList: [1], shouldScore: 10 },
        { id: '2', itemName: '文明施工', childList: [2], shouldScore: 15 },
        { id: '3', itemName: '脚手架', childList: [3, 4, 5, 6, 7, 8, 9, 10], shouldScore: 10 },
        { id: '4', itemName: '基坑工程', childList: [11], shouldScore: 10 },
        { id: '5', itemName: '模板支架', childList: [12], shouldScore: 10 },
        { id: '6', itemName: '高处作业', childList: [13], shouldScore: 10 },
        { id: '7', itemName: '施工用电', childList: [14], shouldScore: 10 },
        { id: '8', itemName: '物料提升机与施工升降机', childList: [15, 16], shouldScore: 10 },
        { id: '9', itemName: '塔式起重机与起重吊装', childList: [17, 18], shouldScore: 10 },
        { id: '10', itemName: '施工机具', childList: [19], shouldScore: 5 },
    ];
    const scoreDetail: any = Taro.getStorageSync("scoreDetail") || {};
    // const { grade} = scoreDetail;
    const projectId: any = Taro.getStorageSync("projectId");
    useDidShow(() => {
        console.log(111)
        getAllList();
    })
    useEffect(() => {
        getAllList();
        getDetail();
    }, [])
    useEffect(() => {
        countBranch();
    }, [safeList, countBol])

    //计算总分
    const countBranch = () => {
        const safeCheckArr = safeCheckType.map(item => {
            item.num = 0;//二级实际扣分的总数
            item.shouldNum = 0;//二级实际得分总分
            item.realScore = 0.00;//实际得分
            item.judge = false;//通过判断是否计算
            return item;
        })
        //第一级筛选后的数组
        const oneArr = safeList.filter(item => {
            return item.choose == 0
        })

        safeCheckArr.forEach(item => {
            item.childList.forEach(val => {
                oneArr.forEach(fir => {
                    if (fir.checkItemId == val) {
                        const arr = fir.projectCheckDictScoreItemVoList.filter(twoItem => {
                            return twoItem.choose == 0
                        })
                        const twoTotal = arr.reduce((prev, cur) => {
                            return prev + cur.realScore;
                        }, 0)

                        const twoShouldScore = arr.reduce((prev, cur) => {
                            return prev + cur.shouldScore;
                        }, 0)
                        item.num += twoTotal;
                        item.shouldNum += twoShouldScore;
                        item.judge = true;
                    }
                })
            })
        })

        const lastArr = safeCheckArr.filter(item => {
            return item.judge == true && item.shouldNum != 0;
        })

        lastArr.forEach(item => {
            item.realScore = ((item.num / item.shouldNum) * item.shouldScore).toFixed(2)
        })

        const lastTotal = lastArr.reduce((prev, cur) => {
            return prev + cur.shouldScore;
        }, 0);

        const lastShouldScore = lastArr.reduce((prev, cur) => {
            return prev + Number(cur.realScore);
        }, 0);

        //赋值新的数组
        const submitList = safeCheckArr.map(item => {
            return {
                checkType: item.id,
                orderId: item.id,
                realScore: item.realScore,
                resultItemId: item.id,
                resultItemName: item.itemName,
                shouldScore: item.shouldScore,
            }
        })
        setSubmitList(submitList);
        //总分
        let total: any = (lastShouldScore / lastTotal * 100).toFixed(2);

        if (isEmpty(oneArr)) {
            total = 100.00;
        }
        setTotal(total);
    }

    //获取上方得分的内容
    const getDetail = async () => {
        const projectId = Taro.getStorageSync('projectId');
        const res: any = await GetProgectIndexLevel(projectId);
        setDetail(res.data);
    }

    //获取全部列表
    const getAllList = async () => {
        const scoreDetail = Taro.getStorageSync("scoreDetail") || {};
        if (!isEmpty(scoreDetail.list)) {
            setSafeList(scoreDetail.list);
        } else {
            const res: any = await GETALLLIST();
            res.data.forEach(item => {
                item.open = false;
                item.orderId = item.checkItemId;
                item.projectCheckDictScoreItemVoList.forEach(element => {
                    element.choose = 0;
                    element.reduceScore = 0;
                    element.realScore = element.shouldScore;
                    element.orderId = element.scoreItemId;
                    element.projectCheckDictScoreReduceVoList.forEach(ele => {
                        ele.orderId = ele.scoreReduceId;
                    })
                });
            });
            scoreDetail.list = res.data
            Taro.setStorage({
                key: "scoreDetail",
                data: scoreDetail
            });
            setSafeList(res.data);
        }
    }


    const handleClick = (index) => {
        safeList[index].open = !safeList[index].open;
        setSafeList(safeList);
        setStorege(safeList);
        setcountBol(!countBol);
    }


    // 编辑项目弹窗勾选事件
    const handleChange = (value) => {
        setCheckList(value);
    }

    //打开编辑项目弹窗
    const openModal = () => {
        const arr: [] = safeList.filter(function (item) {
            return item.choose == 0;
        }).map(item => {
            return item.checkItemId
        });
        const modalList: any[] = [];
        safeList.forEach(item => {
            let obj = {};
            obj.label = item.checkItemName;
            obj.value = item.checkItemId;
            modalList.push(obj);
        });
        setstateCheckboxOption(modalList);
        setCheckList(arr);
        setisOpened(true)
    }

    //编辑项目弹窗点击确定
    const determine = () => {
        safeList.forEach(item => {
            if (checkList.includes(item.checkItemId as never)) {
                item.choose = 0;
            } else {
                item.choose = 1;
            }
        })
        setisOpened(false);
        setSafeList(safeList);
        setStorege(safeList);
        setcountBol(!countBol);
    }


    //等级切换
    const changeLevel = (e) => {
        setLevel(e.detail.value)
    }

    //更改涉及不涉及
    const checkChoose = (choose, index, ind) => {
        safeList[index].projectCheckDictScoreItemVoList[ind].choose = (choose == 0 ? 1 : 0);
        setSafeList(safeList);
        setStorege(safeList);
        setcountBol(!countBol);
    }


    //图片上传
    const changePicker = async (files, operationType, index) => {
        setImageList(files);
    }

    //上传方法
    const uploadFile = (item: any) => {
        setIsOpen(true)
        return new Promise(resolve => {
            const userInfo = Taro.getStorageSync("userInfo") || {};
            request({
                filename: "file",
                file: item.file.originalFileObj,
                method: "POST",
                action: "/api/core/file/upload",
                headers: {
                    "x-access-token": userInfo.authValue
                },
                onSuccess: res => {
                    if (res.code == 200) {
                        resolve(res.data.fileId);
                    } else {
                        Taro.showToast({
                            title: "附件上传失败!",
                            icon: "none",
                            duration: 2000
                        });
                        return ''
                    }
                    setIsOpen(false)
                },
                onerror: (err) => {
                    setIsOpen(false)
                }
            });
        });
    };
    //本地存储
    const setStorege = (data) => {
        const scoreDetail = Taro.getStorageSync("scoreDetail") || {};
        scoreDetail.list = data
        Taro.setStorageSync('scoreDetail', scoreDetail)
    }

    const Submit = async () => {
        const scoreDetail = Taro.getStorageSync('scoreDetail') || {};
        const { list } = scoreDetail
        if (isEmpty(level)) {
            Taro.showToast({
                title: "请填写等级",
                icon: "none",
                duration: 1000
            });
            return
        }

        //循环数组改变数组
        for (let item of list) {
            item.itemScoreVoList = item.projectCheckDictScoreItemVoList;
            delete item.projectCheckDictScoreItemVoList;

            for (let element of item.itemScoreVoList) {
                element.scoreDetailVoList = element.projectCheckDictScoreReduceVoList;
                delete element.projectCheckDictScoreReduceVoList;
            }
        }

        let data = {
            projectId: Number(projectId),
            assessGrade: level + 1,
            totalScore: Number(total),
            safetyEvaluationItemResultList: submitList,
            safetyEvaluationItemVoList: list,
            checkType: 1,
            checkDate: formatDateTime(undefined, "-"),
        };

        if (!isEmpty(imageList)) {
            let fileIds = []

            for (let file of imageList) {
                if (!isEmpty(file.file.originalFileObj)) {
                    fileIds.push(await uploadFile(file))
                }
            }

            data.fileAttachment = [{
                business: "",
                catalogCode: "standardization_monthly_review_file",
                catalogName: "标准化自评表",
                childrens: [],
                configCode: "standardization_monthly_review_file",
                configId: 4701,
                configName: "标准化自评表",
                configType: 2,
                description: "",
                fileIds: fileIds.join(','),
                levelCode: "047011001",
                parentId: 4700,
                sort: 1,
            }]
        }
        if (!data.fileAttachment) {
            Taro.showToast({
                title: "附件不能为空",
                icon: "none",
                duration: 1000
            });
            return
        }

        setLoading(true);
        const res = await submitSafe(data);
        if (res.code == "200") {
            setLoading(false);
            Taro.showToast({
                title: "提交成功",
                icon: "success",
                duration: 1000
            }).then(() => {
                setTimeout(() => {
                    Taro.removeStorageSync('scoreDetail');
                    Taro.navigateTo({ url: `/pages/Regulation/index` });
                }, 1000);
            });
        } else {
            setLoading(false);
            Taro.showToast({
                title: res.msg || "数据提交失败",
                icon: "none",
                duration: 3000
            });
            return
        }

    }
    return (
        <View className="SafeAssessment-Page">
            <View className="SafeAssessment-Page-bac">
                <View className="SafeAssessment-Page-top">
                    <View>
                        安全考评
                        </View>
                    <View>
                        总计得分:{total}分
                            <Image src={SafeAssessment_1}></Image>
                    </View>
                </View>
                {
                    detail && (
                        <View className="SafeAssessment-Page-topTittle">
                            {detail.projectName}
                        </View>
                    )
                }
                <View className="SafeAssessment-Page-list baseBox">
                    <AtList>
                        <Picker mode='selector' range={status} onChange={(e) => { changeLevel(e) }}>
                            <AtListItem title='等级' extraText={status[level]} arrow='right' />
                        </Picker>
                        {
                            !isEmpty(safeList) && safeList.map((item, index) =>
                                item.choose === 0 && <AtAccordion
                                    open={item.open}
                                    onClick={() => { handleClick(index) }}
                                    title={item.checkItemName}
                                    key={item.checkItemName}
                                >

                                    {
                                        item.projectCheckDictScoreItemVoList.map((val, ind) => (
                                            <View className="listItem" key={val.scoreItemName} >
                                                <View className="listItem-left">{`${val.scoreItemName}(${val.shouldScore}分)`}</View>
                                                {
                                                    val.choose == 0 ? <View className="listItem-right">
                                                        <View className="listItem-right-involve" onClick={() => { checkChoose(val.choose, index, ind) }}>不涉及</View>
                                                        <View className="listItem-right-score" onClick={() => {
                                                            setTimeout(() => {
                                                                Taro.navigateTo({
                                                                    url: `/pages/ScoreDetail/index?one=${index}&&two=${ind}`
                                                                })
                                                            }, 500)
                                                        }}>{val.reduceScore ? `-${val.reduceScore}分` : "评分"}</View>
                                                    </View>
                                                        :
                                                        <View className="listItem-right">
                                                            <View onClick={() => { checkChoose(val.choose, index, ind) }}>
                                                                涉及
                                                            </View>

                                                        </View>
                                                }
                                            </View>
                                        ))
                                    }
                                </AtAccordion>)
                        }
                    </AtList>
                </View>

                <View className="SafeAssessment-Page-edit baseBox" onClick={() => { openModal() }}>
                    <Image src={SafeAssessment_2}></Image>
                    <View>编辑项目</View>
                </View>

                <View className="SafeAssessment-Page-imgList baseBox">
                    <View className="SafeAssessment-Page-imgList-tittle">附件：</View>
                    <AtImagePicker
                        files={imageList}
                        count={10}
                        onChange={(files, operationType, index) => { changePicker(files, operationType, index) }}
                    />
                </View>
                <AtButton type='primary' loading={loading} className="submitButton noStyleButton" onClick={() => { Submit() }}>提交</AtButton>
                <AtToast isOpened={isOpen} text={'上传中...'} status='loading'></AtToast>
            </View>
            <FloatLayout
                checkboxOption={checkboxOption}
                onColse={() => { setisOpened(false) }}
                isOpened={isOpened}
                handleChange={(e) => { handleChange(e) }}
                checkedList={checkList}
                onOK={() => { determine() }}
            />
        </View>
    )
}
