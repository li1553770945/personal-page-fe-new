"use client";

import { useEffect, useRef } from 'react';
declare global {
  interface Window {
    oml2d: any;
  }
}
export default function Live2d() {
    // 因为是异步导入，我们先定义一个类型引用，或者使用 any
    const oml2dRef = useRef<any>(null);

    useEffect(() => {
        // 定义一个异步加载函数
        const initLive2D = async () => {
            // 关键点：在浏览器环境下动态导入
            const { loadOml2d } = await import('oh-my-live2d');

            oml2dRef.current = loadOml2d({
                dockedPosition: 'right',
                models: [{
                    // ⚠️ 注意：路径要一直指向 runtime 文件夹里的 .model3.json 文件
                    path: '/models/hiyori/hiyori_pro_t11.model3.json',

                    // Hiyori 是 Cubism 4 的高清模型，通常会显示得非常大
                    // 建议把 scale 调小一点，比如 0.1 或 0.15
                    scale: 0.15,

                    // 如果位置偏了，调整这个 [x, y]
                    position: [-50, 0],

                    // Hiyori 的动作很多，可以开启这个选项让它闲置时自动播放动作
                    stageStyle: {
                        width: 250,
                        height: 250
                    }
                }
                ],
            });
        };

        initLive2D();

        // 可选：如果组件卸载，可以考虑清理实例
        // return () => { oml2dRef.current?.destroy(); };
    }, []);

    return null;
}