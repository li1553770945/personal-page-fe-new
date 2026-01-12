interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

// 简单的全局toast实现，使用浏览器原生通知样式
export function useToast() {
  const toast = ({ title, description, variant = 'default' }: ToastOptions) => {
    // 创建 toast 元素
    const toastEl = document.createElement('div');
    toastEl.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md animate-in slide-in-from-top-5 ${
      variant === 'destructive' 
        ? 'bg-red-500 text-white' 
        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border'
    }`;
    
    toastEl.innerHTML = `
      <div class="font-semibold">${title}</div>
      ${description ? `<div class="text-sm mt-1 opacity-90">${description}</div>` : ''}
    `;
    
    document.body.appendChild(toastEl);
    
    // 5秒后移除
    setTimeout(() => {
      toastEl.classList.add('animate-out', 'slide-out-to-right-full');
      setTimeout(() => {
        document.body.removeChild(toastEl);
      }, 300);
    }, 5000);
  };

  return { toast };
}
