import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../locales/en.json';
import zhTranslations from '../locales/zh.json';

// 从独立的 JSON 文件导入翻译内容
const resources = {
  en: {
    translation: enTranslations
  },
  zh: {
    translation: zhTranslations
  }
};

// 服务器端和客户端初始渲染使用相同的默认语言
// 客户端会在水合后通过useEffect应用本地存储的语言设置
i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    lng: 'zh', // 初始渲染使用默认语言
    fallbackLng: 'zh',
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already does escaping
    },
    // 监听语言变化事件，保存到本地存储
    react: {
      bindI18n: 'languageChanged'
    }
  });

// 监听语言变化事件，保存到本地存储
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', lng);
  }
});

export default i18n;