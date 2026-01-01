"use client"
import { useLive2D } from "@/context/live2d"

export default function ControlPanel() {
  // 只需要解构出你想要的方法
  const { isReady, playMotion, setParam, say } = useLive2D()

  if (!isReady) return <div>模型加载中...</div>

  return (
    <div className="flex gap-4 p-4">
      <button 
        className="btn-primary"
        onClick={() => {
           playMotion('Tap@Body') // 不需要知道底层逻辑，直接叫名字
           say('不要戳我啦！')
        }}
      >
        戳一戳
      </button>
    </div>
  )
}