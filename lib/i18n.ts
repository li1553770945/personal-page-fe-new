import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip: move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "nav.projects": "Projects",
      "nav.experience": "Experience",
      "nav.skills": "Skills",
      "nav.awards": "Awards",
      "nav.blog": "Blog",
      "nav.resume": "Resume",
      "nav.contact": "Contact",
      "nav.menu": "Menu",
      "nav.navigation": "Navigation",
      "hero.badge": "Backend · Distributed Systems · AI Agent",
      "hero.title": "PeaceSheep",
      "hero.description": "用克制的布局做大胆的视觉：深色基底 + 暗金强调 + 轻动效。",
      "hero.viewProjects": "View Projects",
      "hero.readBlog": "Read Blog",
      "projects.title": "Projects",
      "projects.content": "放你最硬核的一段：项目名/背景 + 2~3 条量化成果。",
      "experience.title": "Experience",
      "experience.content": "公司/岗位/方向 + 你最能打的一条成果（先写 1 条就行）。",
      "skills.title": "Skills",
      "skills.content": "Go / Rust / K8s / Redis / MQ",
      "awards.title": "Awards",
      "awards.content": "ICPC / 竞赛 / 亮点",
      "blog.title": "Blog",
      "blog.content": "这里以后放最近文章列表。"
    }
  },
  zh: {
    translation: {
      "nav.projects": "项目",
      "nav.experience": "经验",
      "nav.skills": "技能",
      "nav.awards": "奖项",
      "nav.blog": "博客",
      "nav.resume": "简历",
      "nav.contact": "联系",
      "nav.menu": "菜单",
      "nav.navigation": "导航",
      "hero.badge": "后端 · 分布式系统 · AI 代理",
      "hero.title": "PeaceSheep",
      "hero.description": "用克制的布局做大胆的视觉：深色基底 + 暗金强调 + 轻动效。",
      "hero.viewProjects": "查看项目",
      "hero.readBlog": "读博客",
      "projects.title": "项目",
      "projects.content": "放你最硬核的一段：项目名/背景 + 2~3 条量化成果。",
      "experience.title": "经验",
      "experience.content": "公司/岗位/方向 + 你最能打的一条成果（先写 1 条就行）。",
      "skills.title": "技能",
      "skills.content": "Go / Rust / K8s / Redis / MQ",
      "awards.title": "奖项",
      "awards.content": "ICPC / 竞赛 / 亮点",
      "blog.title": "博客",
      "blog.content": "这里以后放最近文章列表。"
    }
  }
};

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    lng: 'zh', // language to use, more info here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already does escaping
    }
  });

export default i18n;