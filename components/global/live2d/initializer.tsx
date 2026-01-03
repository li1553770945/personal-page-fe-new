"use client";

import { useEffect, useRef } from 'react';
import { useLive2D } from '@/context/live2d'; // 引入刚才创建的 store

declare global {
  interface Window {
    oml2d: any;
  }
}

export default function Live2d() {
  // 从 Store 中获取设置方法
  const { setInstance, setOpenChatDialog, openChatDialog } = useLive2D();

  // 创建 ref 来存储最新的 openChatDialog 值
  const openChatDialogRef = useRef(openChatDialog);
  const initializedRef = useRef(false);

  // 当 openChatDialog 变化时更新 ref
  useEffect(() => {
    openChatDialogRef.current = openChatDialog;
  }, [openChatDialog]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const initLive2D = async () => {
      const { loadOml2d } = await import('oh-my-live2d');
      // 创建状态变量来跟踪消息类型，true 表示显示 wordTheDay，false 表示显示自定义 message
      let showWordTheDay = true;
      let instance: any = null;
      instance = await loadOml2d({
        dockedPosition: 'right',
        menus: {
          disable: false,
          items: [
            {
              id: 'sleep',
              icon: 'icon-rest',
              title: '睡觉（隐藏）',
              onClick: () => {
                instance?.stageSlideOut();
              }
            },
            {
              id: 'chat',
              icon: 'icon-about',
              title: '聊天',
              onClick: () => {
                setOpenChatDialog(true);
              }
            }
          ]
        },
        models: [
          {
            path: '/models/hiyori/hiyori_pro_t11.model3.json',

            // 1. 放大模型 (根据你的需求调整，比如 0.2 -> 0.25 或 0.3)
            scale: 0.20,

            // 2. 调整位置 (X轴, Y轴)
            // 模型变大后，通常需要把 Y 轴往下移一点，留出头顶空间
            position: [-150, 100],

            // 3. 放大画布区域
            // 画布必须比模型大，不然模型会被切掉，且气泡没地方放
            stageStyle: {
              width: 300,
              height: 450
            }
          }
        ],

        // 4. 【关键】自定义气泡样式
        tips: {
          welcomeTips: {
            message: {
              morning: '早上好，点击我左侧聊天按钮可以和我聊天开启新的一天吧~',
              noon: '现在是午餐时间！点击我左侧聊天按钮可以和我聊聊天哦～',
              afternoon: '下午好，点击我左侧聊天按钮可以和我对话哦～',
              dusk: "傍晚了，工作一天幸苦啦~点击我左侧聊天按钮和我聊聊天吧~",
              night: '晚上好，点击我左侧聊天按钮可以和我对话哦～',
              lateNight: '点击我左侧聊天按钮可以和我对话哦～ 已经这么晚了呀，早点休息吧，晚安~',
              weeHours: '点击我左侧聊天按钮可以和我对话哦～这么晚还不睡吗？当心熬夜秃头哦！',
            }
          },
          style: {
            position: 'absolute',
            top: '100px',  // 越大越往下
            left: '0%',   // 水平靠左
            transform: 'translateX(-50%)', // 修正居中偏移

            // 样式微调
            width: '200px', // 限制气泡宽度，防止太宽
            textAlign: 'center',
            zIndex: 9999,   // 确保气泡在最上层，不会被模型遮挡
          },
          // 空闲时显示的文案，增加主动说话内容和缩短间隔
          idleTips: {
            // 自定义提示语列表
            message: [
              '点击右下角的聊天按钮可以和我对话哦～',
            ],
            wordTheDay(wordTheDayData) {
              // 如果聊天对话框已经打开，直接返回 wordTheDay 内容
              if (openChatDialogRef.current) {
                return ``;
              }

              // 保存当前状态
              const currentShowWordTheDay = showWordTheDay;
              // 切换状态，为下一次调用做准备
              showWordTheDay = !showWordTheDay;
              // 根据当前状态返回不同的消息
              return currentShowWordTheDay ? `${wordTheDayData.hitokoto}` : '点击我左侧的聊天按钮可以和我对话哦～';
            },
            interval: 10000, // 缩短间隔时间到5秒
          }
        }
      });
      // 设置 Live2D 实例到 Store
      setInstance(instance);
      // 挂载到window上，方便在浏览器控制台调试
      window.oml2d = instance;
      console.log('✅ Live2D 初始化完成');
    };

    initLive2D();
  }, []); // 依赖项为空，只执行一次

  return null; // 这里不需要返回 UI，UI 可以写在别的地方
}