// src/lib/fetcher.ts
import instance from './requests'; // 你的 axios 实例

// 这个 fetcher 接收 url 作为参数，然后调用 axios
export const fetcher = (url: string) => instance.get(url).then(res => res.data);