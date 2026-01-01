import { create } from "zustand"

// 1. 定义基础实例类型（不直接导入库）
type BaseInstance = any

// 2. 获取库的基础类型 - 使用类型导入（仅用于类型检查，不会导致实际导入）
// import type { loadOml2d } from "oh-my-live2d"
// type BaseInstance = Awaited<ReturnType<typeof loadOml2d>>

// 2. 【关键修复】手动补全缺失的类型定义
// 我们把 BaseInstance 和我们自定义的结构合并在一起
type ExtendedInstance = BaseInstance & {
    tips: {
        notification: (text: string, duration?: number, priority?: number) => void
        hide: () => void
        show: () => void
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

// 3. 定义 State
type Live2DState = {
    instance: ExtendedInstance | null
    isReady: boolean
}

// 4. 定义 Actions
type Live2DActions = {
    setInstance: (instance: any) => void // 这里入口可以用 any 方便传入，内部存的时候会兼容
    say: (text: string, duration?: number, priority?: number) => void
    playMotion: (groupName: string, index?: number) => void
    setParam: (paramId: string, value: number, duration?: number) => void
}

const useLive2DStore = create<Live2DState & Live2DActions>((set, get) => ({
    instance: null,
    isReady: false,

    // 这里接收的时候用 any 也没关系，因为我们已经知道它的结构了
    setInstance: (instance) => set({ instance: instance as ExtendedInstance, isReady: true }),

    say: (text, duration = 3000, priority = 3) => {
        const { instance } = get()
        // ✅ 现在 tips 不会报错了，而且有代码提示
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
            // ✅ coreModel 也有了提示
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
    }
}))

export function useLive2D() {
    return useLive2DStore()
}