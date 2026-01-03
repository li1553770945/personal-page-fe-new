"use client";

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLive2D, Live2DInstance } from '@/context/live2d'; // 引入刚才创建的 store
import "@/public/live2d/chat.js"
declare global {
  interface Window {
    oml2d: any;
  }
}


export default function Live2d() {

  // 这里只需要 setInstance，其他操作通过 getState 或 store 内部处理
  const { setInstance, setOpenChatDialog, openChatDialog } = useLive2D();
  const { t } = useTranslation();

  const openChatDialogRef = useRef(openChatDialog);
  const tRef = useRef(t);
  const initializedRef = useRef(false);

  useEffect(() => {
    openChatDialogRef.current = openChatDialog;
  }, [openChatDialog]);

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initLive2D = async () => {
      const { loadOml2d } = await import('oh-my-live2d');
      let showWordTheDay = true;

      const instance = await loadOml2d({
        dockedPosition: 'right',
        menus: {
          disable: false,
          items: [
            {
              id: 'sleep',
              icon: 'icon-rest',
              title: t('live2d.menu.sleep'),
              onClick: () => {
                //  先显示提示气泡
                instance.tipsMessage(tRef.current('live2d.messages.sleep'), 3000, 5);
                setTimeout(() => {
                  // 使用 Zustand 的 getState() 获取最新的 action
                  // 这样会同时更新 React 状态 + localStorage + 执行动画
                  useLive2D.getState().slideOut();
                }, 3000);
              }
            },
            {
              id: 'chat',
              icon: 'icon-chat',
              title: t('live2d.menu.chat'),
              onClick: () => {
                setOpenChatDialog(true);
              }
            }
          ],
        },
        models: [
          {
            path: '/models/hiyori/hiyori_pro_t11.model3.json',
            scale: 0.20,
            position: [-150, 100],
            stageStyle: {
              width: 300,
              height: 450
            }
          }
        ],
        tips: {
          welcomeTips: {
            duration: 1,
            priority: -1,
          },
          style: {
            position: 'absolute',
            top: '100px',
            left: '0%',
            transform: 'translateX(-50%)',
            width: '200px',
            textAlign: 'center',
            zIndex: 9999,
          },
          idleTips: {
            message: [
              t('live2d.messages.idle.tip'),
            ],
            wordTheDay(wordTheDayData) {
              if (openChatDialogRef.current) return ``;
              const currentShowWordTheDay = showWordTheDay;
              showWordTheDay = !showWordTheDay;
              return currentShowWordTheDay ? `${wordTheDayData.hitokoto}` : tRef.current('live2d.messages.idle.tip');
            },
            interval: 10000,
          }
        }
      });
      instance.onStageSlideIn(() => {
        instance.tipsMessage(getWelcomeMessage(tRef.current, !openChatDialogRef.current), 3000, 10);
      })
      setInstance(instance as Live2DInstance);
      window.oml2d = instance;
      console.log('✅ Live2D 初始化完成');
    };


    initLive2D();



  }, []); // 依赖项为空

  return null;
}

export const getWelcomeMessage = (t: (key: string) => string, showAIChatTip: boolean) => {
  const hour = new Date().getHours();
  const messages = {
    morning: t('live2d.messages.welcome.morning'),   // 6-11
    noon: t('live2d.messages.welcome.noon'),         // 11-13
    afternoon: t('live2d.messages.welcome.afternoon'), // 13-17
    dusk: t('live2d.messages.welcome.dusk'),         // 17-19
    night: t('live2d.messages.welcome.night'),       // 19-22
    lateNight: t('live2d.messages.welcome.lateNight'), // 22-24
    weeHours: t('live2d.messages.welcome.weeHours'),   // 0-6
  };

  const messagesWithChatTip = {
    morning: t('live2d.messages.welcome.morning_chat_tip'),   // 6-11
    noon: t('live2d.messages.welcome.noon_chat_tip'),         // 11-13
    afternoon: t('live2d.messages.welcome.afternoon_chat_tip'), // 13-17
    dusk: t('live2d.messages.welcome.dusk_chat_tip'),         // 17-19
    night: t('live2d.messages.welcome.night_chat_tip'),       // 19-22
    lateNight: t('live2d.messages.welcome.lateNight_chat_tip'), // 22-24
    weeHours: t('live2d.messages.welcome.weeHours_chat_tip'),   // 0-6
  };

  if (hour >= 6 && hour < 11) return showAIChatTip ? messagesWithChatTip.morning : messages.morning;
  if (hour >= 11 && hour < 13) return showAIChatTip ? messagesWithChatTip.noon : messages.noon;
  if (hour >= 13 && hour < 17) return showAIChatTip ? messagesWithChatTip.afternoon : messages.afternoon;
  if (hour >= 17 && hour < 19) return showAIChatTip ? messagesWithChatTip.dusk : messages.dusk;
  if (hour >= 19 && hour < 22) return showAIChatTip ? messagesWithChatTip.night : messages.night;
  if (hour >= 22 || hour < 24) return showAIChatTip ? messagesWithChatTip.lateNight : messages.lateNight;
  return showAIChatTip ? messagesWithChatTip.weeHours : messages.weeHours;
};