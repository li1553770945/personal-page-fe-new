/**
 * 消息解析器 - 用于处理前端的感情控制块解析
 * 格式: <<emotion>> 例如: <<wave>>, <<joy>>, <<sad>>
 */

export interface ParsedMessageResult {
  // 可以直接渲染的文本部分
  displayText: string;
  // 检测到的完整的emotion标签（如果有）
  emotions: string[];
  // 待处理的缓存文本（用于下一条消息的处理）
  remainingBuffer: string;
}

/**
 * 消息解析器类 - 维护状态以处理跨消息块的不完整控制块
 */
export class MessageParser {
  private buffer: string = ''; // 缓存的待处理文本

  /**
   * 解析消息内容并提取感情控制块
   * @param messageChunk 新增的消息片段
   * @returns 解析结果，包含可显示的文本和检测到的emotion
   */
  parse(messageChunk: string): ParsedMessageResult {
    // 将新的消息块追加到缓存
    this.buffer += messageChunk;

    const emotions: string[] = [];
    let displayText = '';
    let i = 0;

    while (i < this.buffer.length) {
      // 查找开始标记 <<
      const openIndex = this.buffer.indexOf('<<', i);

      if (openIndex === -1) {
        // 没有找到 <<，整个剩余部分都是可显示的文本
        displayText += this.buffer.substring(i);
        this.buffer = '';
        break;
      }

      if (openIndex > i) {
        // << 之前有文本，先加入显示文本
        displayText += this.buffer.substring(i, openIndex);
      }

      // 寻找对应的关闭标记 >>
      const closeIndex = this.buffer.indexOf('>>', openIndex + 2);

      if (closeIndex === -1) {
        // 没有找到 >>，说明这可能是不完整的控制块
        // 检查 << 后面的长度是否超过合理范围（最多10个字符）
        const afterOpen = this.buffer.substring(openIndex + 2);
        
        if (afterOpen.length >= 10) {
          // 长度超过10字符，说明这不是一个有效的控制块，把 << 当作普通文本处理
          displayText += '<<';
          i = openIndex + 2;
        } else {
          // 长度在合理范围内，保留到缓存中，等待下一个消息块
          this.buffer = this.buffer.substring(openIndex);
          break;
        }
      } else {
        // 找到了完整的 << ... >>
        const emotionTag = this.buffer.substring(openIndex + 2, closeIndex).trim();
        
        // 检查emotion标签是否有效（不为空）
        if (emotionTag.length > 0 && emotionTag.length <= 10) {
          emotions.push(emotionTag);
          // 不将emotion标签加入displayText，直接跳过
          i = closeIndex + 2;
        } else {
          // 无效的emotion标签，把 << 当作普通文本处理
          displayText += '<<';
          i = openIndex + 2;
        }
      }
    }

    // 更新buffer为剩余的未处理部分
    if (i < this.buffer.length) {
      this.buffer = this.buffer.substring(i);
    } else {
      this.buffer = '';
    }

    return {
      displayText,
      emotions,
      remainingBuffer: this.buffer
    };
  }

  /**
   * 获取当前的缓存状态（用于调试或强制清空）
   */
  getBuffer(): string {
    return this.buffer;
  }

  /**
   * 强制清空缓存
   */
  clear(): void {
    this.buffer = '';
  }

  /**
   * 完成消息处理 - 处理缓存中剩余的文本
   * 当消息流结束时调用，用于处理不完整的控制块
   */
  finalize(): string {
    const remaining = this.buffer;
    this.buffer = '';
    return remaining;
  }
}

/**
 * 便捷函数 - 一次性解析整个消息（适合于已完整接收的消息）
 */
export function parseMessageOnce(fullMessage: string): ParsedMessageResult {
  const parser = new MessageParser();
  const result = parser.parse(fullMessage);
  // 将任何剩余的缓存部分加回到displayText中
  result.displayText += result.remainingBuffer;
  result.remainingBuffer = '';
  return result;
}
