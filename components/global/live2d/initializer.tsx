"use client";

import { useEffect } from 'react';
import { useLive2D } from '@/context/live2d'; // 引入刚才创建的 store

declare global {
  interface Window {
    oml2d: any;
  }
}

export default function Live2d() {
  // 从 Store 中获取设置方法
  const { setInstance } = useLive2D();

  useEffect(() => {
    const initLive2D = async () => {
      const { loadOml2d } = await import('oh-my-live2d');

      const instance = await loadOml2d({
        dockedPosition: 'right',
        menus: {
          disable: false,
          items: [
            {
              id: 'chat',
              icon: 'icon-about',
              title: '聊天',
              onClick: () => {
                // 发送自定义事件打开聊天对话框
                window.dispatchEvent(new CustomEvent('openChatDialog'));
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
          // 空闲时显示的文案，wordTheDay表示每日一言
          idleTips: {
            wordTheDay(wordTheDayData) {
              return `${wordTheDayData.hitokoto}`;
            },
            interval: 10000,
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