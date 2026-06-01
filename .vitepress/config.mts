import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3'

export default defineConfig({
  // 你的网站标题
  title: "我的学习日志",
  description: "记录学习笔记的地方",
  
  themeConfig: {
    // 网站右上角的导航栏链接
    nav: [
      { text: '首页', link: '/' },
      { text: '我的笔记', link: '/my-first-note' }
    ],
    // 左侧的菜单栏
    sidebar: [
      {
        text: '密码学与数学',
        items: [
          { text: '群论基础笔记', link: '/my-first-note' }
        ]
      }
    ],
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ]
  },

  // 核心配置：激活数学公式渲染
  markdown: {
    config: (md) => {
      md.use(mathjax3)
    }
  }
})