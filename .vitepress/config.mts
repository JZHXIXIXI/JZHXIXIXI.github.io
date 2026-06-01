import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3'

export default defineConfig({
  title: "我的学习日志",
  description: "CTF | 嵌入式 | AI 技术沉淀",
  
  themeConfig: {
    // 1. 顶部导航栏：可以一键切换大板块
    nav: [
      { text: '首页', link: '/' },
      { text: 'CTF密码学', link: '/1' },
      { text: '嵌入式开发', link: '/2' },
      { text: 'AI与人工智能', link: '/3' }
    ],

    // 2. 左侧侧边栏：让每个板块下面都可以无限细分小专题
    sidebar: [
      {
        text: '🚩 CTF 攻防防线',
        collapsed: false, // 是否默认展开
        items: [
          { text: '近世代数与群论基础', link: '/1' }
        ]
      },
      {
        text: '🤖 嵌入式与车载安全',
        collapsed: false,
        items: [
          { text: '树莓派与 Linux 基础', link: '/2' }
        ]
      },
      {
        text: '🧠 AI 与大模型协议',
        collapsed: false,
        items: [
          { text: 'ONNX 模型推理与部署', link: '/3' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ]
  },

  markdown: {
    config: (md) => {
      md.use(mathjax3)
    }
  }
})