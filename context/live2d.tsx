import { Oml2dProperties, Oml2dMethods, Oml2dEvents } from "oh-my-live2d"
import { create } from "zustand"
type ExtendedInstance = Oml2dProperties & Oml2dMethods & Oml2dEvents & {
    tips: {
        notification: (text: string, duration?: number, priority?: number) => void
    }
    models: {
        model: {
            internalModel: {
                motionManager: {
                    startMotion: (group: string, index: number, priority: number) => Promise<boolean>
                    expressionManager?: {
                        setExpression: (id: string) => void
                    }
                }
                coreModel: {
                    setParameterValueById: (id: string, value: number) => void
                    getParameterValueById: (id: string) => number
                    _parameterIds: string[]
                }
            }
            expression: (id: string) => void
        }
    }
}

export type Live2DInstance = ExtendedInstance

type Live2DState = {
    instance: ExtendedInstance | null // 这里建议初始设为 null
    isReady: boolean
    openChatDialog: boolean
    isStageVisible: boolean
}

type Live2DActions = {
    setInstance: (instance: Live2DInstance) => void
    setOpenChatDialog: (chatDialogShow: boolean) => void
    say: (text: string, duration?: number, priority?: number) => void
    playMotion: (groupName: string, index?: number) => void
    setParam: (paramId: string, value: number, duration?: number) => void
    setExpression: (expressionId: string) => void
    slideIn: () => void
    slideOut: () => void
}


export const useLive2D = create<Live2DState & Live2DActions>()(
    (set, get) => ({
        instance: null, // 初始为空
        isReady: false,
        openChatDialog: false,
        isStageVisible: true, // 默认 true，如果有缓存会覆盖这个值

        setInstance: (instance) => {
            set({ instance: instance as Live2DInstance, isReady: true })
            instance.onStageSlideIn(() => {
                set({ isStageVisible: true });
            });
            instance.onStageSlideOut(() => {
                set({ isStageVisible: false });
            });
        },

        setOpenChatDialog: (chatDialogShow) => set({ openChatDialog: chatDialogShow }),

        say: (text, duration = 3000, priority = 3) => {
            const { instance } = get()
            if (instance && instance.tips) {
                instance.tips.notification(text, duration, priority)
            }
        },

        playMotion: (groupName, index = 0) => {
            const { instance } = get()
            // ✅ models 也不报错了，且知道是一个数组
            const model = instance?.models?.model
            const internal = model?.internalModel

            if (internal?.motionManager) {
                internal.motionManager.startMotion(groupName, index, 3)
                console.log(`Live2D 播放动作: ${groupName}`)
            } else {
                console.warn("Live2D 动作管理器未就绪")
            }
        },

        setParam: (paramId, value, duration = 0) => {
            const { instance } = get()
            const core = instance?.models?.model?.internalModel?.coreModel

            if (core) {
                core.setParameterValueById(paramId, value)
                const idIndex = core._parameterIds.indexOf(paramId)

                if (idIndex === -1) {
                    console.warn(`⚠️ 当前模型不存在参数: ${paramId}，已跳过。`)
                    return // 直接退出，防止报错
                }
                if (duration > 0) {
                    setTimeout(() => {
                        core.setParameterValueById(paramId, 0)
                    }, duration)
                }
            }
        },
        setExpression: (expressionId) => {
            const { instance } = get()
            const model = instance?.models?.model
            const internal = model?.internalModel

            if (!model || !internal?.motionManager) {
                console.warn("Live2D 模型未就绪")
                return
            }

            // 设置表情
            model.expression(expressionId)
            console.log(`Live2D 设置表情: ${expressionId}`)

        },

        slideIn: () => {
            const { instance, isStageVisible } = get();
            // 核心逻辑: 如果已经在显示了 (isStageVisible为true)，直接中断，不执行任何操作
            if (!instance || isStageVisible) {
                console.log("Live2D 已在舞台，忽略 slideIn");
                return;
            }

            console.log("执行 slideIn");
            instance.statusBarClose();
            instance.stageSlideIn();
            // 状态更新交给上面的 onStageSlideIn 回调，或者在这里立即更新也可以

            set({ isStageVisible: true });
        },

        slideOut: () => {
            const { instance, isStageVisible } = get();
            // 核心逻辑: 如果已经隐藏了 (isStageVisible为false)，直接中断
            if (!instance || !isStageVisible) {
                console.log("Live2D 已隐藏，忽略 slideOut");
                return;
            }

            console.log("执行 slideOut");
            instance.stageSlideOut();
            set({ isStageVisible: false });
        }
    })
)
