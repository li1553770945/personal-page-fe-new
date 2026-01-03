export function getMotionStrategy(tag: string): { group: string; index: number; expression: string } {
  // 去掉尖括号并转小写
  const standardizedTag = tag.toLowerCase().replaceAll('<', '').replaceAll('>', '');

  switch (standardizedTag) {
    case "joy":
    case "happy":
      // 现在的 expression 直接写 "joy"，对应 model3.json 里的 Name
      return { group: "Flick", index: 0, expression: "joy" }; 
    
    case "sad":
    case "sorry":
      return { group: "FlickDown", index: 0, expression: "sad" };
    
    case "think":
    case "idea":
      return { group: "Tap", index: 1, expression: "think" };
    
    case "shock":
    case "surprise":
      return { group: "Flick@Body", index: 0, expression: "shock" };
      
    case "shy":
      // 害羞的时候也可以用开心的表情(joy)，或者你有专门的 shy.exp3.json
      return { group: "Tap@Body", index: 0, expression: "joy" };

    case "idle":
    default:
      // 这里的 "normal" 需要你在 model3.json 里也注册一个 normal.exp3.json
      // 如果不想创建文件，也可以传 undefined 或者 "joy" 作为默认
      return { group: "Idle", index: 0, expression: "normal" }; 
  }
}