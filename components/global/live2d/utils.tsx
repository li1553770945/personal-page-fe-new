
export function getMotionStrategy(tag: string): { group: string; index: number } {
  // 将 tag 转为小写以防万一
  const standardizedTag = tag.toLowerCase().replaceAll('<', '').replaceAll('>', '');
  console.log(`LLM情绪: ${standardizedTag}`)

  switch (standardizedTag) {
    case "joy":
    case "happy":
      // 对应 m03: 元气动作
      return { group: "Flick", index: 0 };
    
    case "sad":
    case "sorry":
      // 对应 m04: 低头/失落
      return { group: "FlickDown", index: 0 };
    
    case "wave":
    case "hello":
      // 对应 m07: 打招呼
      // Tap 组有两个动作，m07 通常是第一个
      return { group: "Tap", index: 0 };

    case "think":
    case "idea":
      // 对应 m08: 思考 (Tap 组的第二个动作)
      // 或者用 m06 (FlickUp) 表示灵感
      return { group: "Tap", index: 1 };
    
    case "shy":
    case "modest":
      // 对应 m09: 害羞
      return { group: "Tap@Body", index: 0 };
    
    case "shock":
    case "surprise":
      // 对应 m10: 惊讶
      return { group: "Flick@Body", index: 0 };

    case "idle":
    default:
      // 默认返回 Idle 组，让 Live2D 随机播放 (index: -1 通常代表随机，具体看你的播放器实现)
      // 或者指定 m01 (index 0)
      return { group: "Idle", index: 0 };
  }
}