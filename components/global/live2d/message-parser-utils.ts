/**
 * 消息解析工具函数扩展集
 * 提供额外的辅助功能和高级用法
 */

/**
 * emotion 标签验证器
 * 检查emotion标签是否有效
 */
export class EmotionValidator {
  private validEmotions: Set<string>;

  constructor(validEmotions?: string[]) {
    // 默认支持的emotion列表（与 getMotionStrategy 同步）
    this.validEmotions = new Set(
      validEmotions || [
        'joy', 'happy',
        'sad', 'sorry',
        'think', 'idea',
        'shock', 'surprise',
        'shy',
        'idle',
        'wave',
        'normal'
      ]
    );
  }

  /**
   * 验证emotion标签是否有效
   */
  isValid(emotion: string): boolean {
    return this.validEmotions.has(emotion.toLowerCase());
  }

  /**
   * 添加自定义emotion标签
   */
  addEmotions(emotions: string[]): void {
    emotions.forEach(e => this.validEmotions.add(e.toLowerCase()));
  }

  /**
   * 获取所有有效的emotion标签
   */
  getAllEmotions(): string[] {
    return Array.from(this.validEmotions);
  }
}

/**
 * 消息预处理器 - 用于清理和验证消息
 */
export class MessagePreprocessor {
  /**
   * 提取所有emotion标签（不改变消息）
   */
  static extractEmotions(message: string): string[] {
    const emotionRegex = /<<([^<>]+?)>>/g;
    const emotions: string[] = [];
    let match;

    while ((match = emotionRegex.exec(message)) !== null) {
      const emotion = match[1].trim();
      if (emotion.length > 0 && emotion.length <= 10) {
        emotions.push(emotion);
      }
    }

    return emotions;
  }

  /**
   * 移除所有emotion标签，返回纯文本
   */
  static stripEmotions(message: string): string {
    return message.replace(/<<([^<>]+?)>>/g, '').trim();
  }

  /**
   * 验证消息格式是否有效
   */
  static isValidFormat(message: string): boolean {
    // 检查是否有未配对的 << 或 >>
    const openCount = (message.match(/<<(?![<])/g) || []).length;
    const closeCount = (message.match(/>>(?![>])/g) || []).length;

    return openCount === closeCount;
  }

  /**
   * 获取消息统计信息
   */
  static getStats(message: string): {
    totalLength: number;
    textLength: number;
    emotionCount: number;
    emotions: string[];
  } {
    const emotions = this.extractEmotions(message);
    const cleanText = this.stripEmotions(message);

    return {
      totalLength: message.length,
      textLength: cleanText.length,
      emotionCount: emotions.length,
      emotions: emotions
    };
  }
}

/**
 * 消息格式化器 - 用于生成格式化的emotion消息
 */
export class MessageFormatter {
  /**
   * 创建带emotion的消息
   */
  static createMessage(text: string, emotions: string[] = [], position: 'end' | 'start' = 'end'): string {
    const emotionTags = emotions.map(e => `<<${e}>>`).join('');

    if (position === 'end') {
      return text + emotionTags;
    } else {
      return emotionTags + text;
    }
  }

  /**
   * 在消息中的指定位置插入emotion标签
   */
  static insertEmotionAt(text: string, emotion: string, position: number): string {
    const tag = `<<${emotion}>>`;
    if (position < 0 || position > text.length) {
      return text + tag;
    }
    return text.slice(0, position) + tag + text.slice(position);
  }

  /**
   * 替换消息中的emotion标签
   */
  static replaceEmotions(text: string, replacements: Record<string, string>): string {
    let result = text;

    for (const [oldEmotion, newEmotion] of Object.entries(replacements)) {
      result = result.replace(
        new RegExp(`<<${oldEmotion}>>`, 'g'),
        `<<${newEmotion}>>`
      );
    }

    return result;
  }

  /**
   * 转义特殊字符以防止emotion标签被意外解析
   */
  static escape(text: string): string {
    // 如果文本中有 << 或 >>，进行转义
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /**
   * 解除转义
   */
  static unescape(text: string): string {
    return text.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }
}

/**
 * 消息历史分析器 - 用于分析emotion使用情况
 */
export class EmotionAnalyzer {
  private emotionStats: Map<string, number> = new Map();
  private totalMessages: number = 0;

  /**
   * 添加消息进行分析
   */
  analyzeMessage(message: string): void {
    const emotions = MessagePreprocessor.extractEmotions(message);
    emotions.forEach(emotion => {
      this.emotionStats.set(emotion, (this.emotionStats.get(emotion) || 0) + 1);
    });
    this.totalMessages++;
  }

  /**
   * 获取emotion使用频率排序
   */
  getFrequency(): Array<{ emotion: string; count: number; percentage: number }> {
    const frequencies = Array.from(this.emotionStats.entries())
      .map(([emotion, count]) => ({
        emotion,
        count,
        percentage: (count / this.totalMessages) * 100
      }))
      .sort((a, b) => b.count - a.count);

    return frequencies;
  }

  /**
   * 获取最常用的emotion
   */
  getMostFrequent(n: number = 5): string[] {
    return this.getFrequency()
      .slice(0, n)
      .map(item => item.emotion);
  }

  /**
   * 重置统计
   */
  reset(): void {
    this.emotionStats.clear();
    this.totalMessages = 0;
  }

  /**
   * 获取统计摘要
   */
  getSummary(): {
    totalMessages: number;
    uniqueEmotions: number;
    totalEmotions: number;
    mostFrequent: string[];
  } {
    const totalEmotions = Array.from(this.emotionStats.values()).reduce((a, b) => a + b, 0);

    return {
      totalMessages: this.totalMessages,
      uniqueEmotions: this.emotionStats.size,
      totalEmotions: totalEmotions,
      mostFrequent: this.getMostFrequent(3)
    };
  }
}

/**
 * 消息缓冲区 - 用于处理高频的消息更新
 */
export class MessageBuffer {
  private buffer: string[] = [];
  private flushCallback: (messages: string[]) => void;
  private flushInterval: number;
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(flushCallback: (messages: string[]) => void, flushInterval: number = 50) {
    this.flushCallback = flushCallback;
    this.flushInterval = flushInterval;
  }

  /**
   * 添加消息到缓冲区
   */
  add(message: string): void {
    this.buffer.push(message);

    // 清除之前的定时器
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // 设置新的定时器
    this.timeoutId = setTimeout(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * 立即刷新缓冲区
   */
  flush(): void {
    if (this.buffer.length > 0) {
      this.flushCallback(this.buffer);
      this.buffer = [];
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * 清空缓冲区
   */
  clear(): void {
    this.buffer = [];
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * 获取缓冲区内容
   */
  getContent(): string[] {
    return [...this.buffer];
  }
}

/**
 * 安全的emotion处理函数
 * 处理emotion标签中的特殊字符
 */
export function sanitizeEmotionTag(tag: string): string {
  // 只允许字母、数字、下划线、中文
  return tag.replace(/[^a-zA-Z0-9_\u4E00-\u9FA5]/g, '').slice(0, 10);
}

/**
 * 批量处理消息中的emotion
 */
export function batchProcessEmotions(
  messages: string[],
  processor: (emotion: string) => void
): void {
  const allEmotions = new Set<string>();

  messages.forEach(msg => {
    MessagePreprocessor.extractEmotions(msg).forEach(e => allEmotions.add(e));
  });

  allEmotions.forEach(processor);
}

/**
 * 创建emotion映射器
 * 用于将emotion映射到自定义的处理函数
 */
export class EmotionMapper {
  private mappings: Map<string, () => void> = new Map();

  /**
   * 注册emotion处理器
   */
  register(emotion: string, handler: () => void): void {
    this.mappings.set(emotion.toLowerCase(), handler);
  }

  /**
   * 处理emotion
   */
  handle(emotion: string): void {
    const handler = this.mappings.get(emotion.toLowerCase());
    if (handler) {
      handler();
    }
  }

  /**
   * 批量处理emotion列表
   */
  handleBatch(emotions: string[]): void {
    emotions.forEach(e => this.handle(e));
  }

  /**
   * 检查emotion是否已注册
   */
  has(emotion: string): boolean {
    return this.mappings.has(emotion.toLowerCase());
  }

  /**
   * 清除所有映射
   */
  clear(): void {
    this.mappings.clear();
  }
}
