import { Oml2dProperties, Oml2dMethods, Oml2dEvents } from "oh-my-live2d"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware" // 1. 引入 persist
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
    slideIn: () => void
    slideOut: () => void
}


export const useLive2D = create<Live2DState & Live2DActions>()(
    persist(
        (set, get) => ({
            instance: null, // 初始为空
            isReady: false,
            openChatDialog: false,
            isStageVisible: true, // 默认 true，如果有缓存会覆盖这个值

            setInstance: (instance) => {
                set({ instance: instance as Live2DInstance, isReady: true })
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

            slideIn: () => {
                const { instance, isStageVisible, openChatDialog } = get()
                // 只有当状态为 hidden 时才执行
                if (!instance || isStageVisible) return
                instance.stageSlideIn()
                set({ isStageVisible: true })
            },

            slideOut: () => {
                const { instance, isStageVisible } = get()
                // 只有当状态为 visible 时才执行
                if (instance && isStageVisible) {
                    instance.stageSlideOut()
                    set({ isStageVisible: false })
                }
            }
        }),
        {
            name: 'live2d-storage', // localStorage 中的 key 名称
            storage: createJSONStorage(() => localStorage), // 指定使用 localStorage
            partialize: (state) => ({
                isStageVisible: state.isStageVisible
            }),
        }
    )
)
