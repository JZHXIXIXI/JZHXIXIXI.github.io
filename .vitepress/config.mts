import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3'

export default defineConfig({
  title: "JZH的学习日志",
  description: "CTF | 嵌入式 | Agent学习笔记",
  
  themeConfig: {
    // 1. 顶部导航栏：可以一键切换大板块
    nav: [
      { text: '首页', link: '/' },
      { text: 'CTF密码学', link: '/1' },
      { text: '嵌入式开发', link: '/2' },
      { text: 'Agent学习笔记', link: '/ai/openclaw_src_cli' }
    ],

    // 2. 左侧侧边栏：让每个板块下面都可以无限细分小专题
    sidebar: [
      {
        text: '🚩 CTF 攻防防线',
        collapsed: false, // 是否默认展开
        items: [
          { text: 'CTF PWN', link: '/1' }
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
        text: '🧠 AI 与 Agent',
        collapsed: false,
        items: [
          {
          text: '📁 Agent学习笔记',
          collapsed: true, 
          items: [
            
            // 🌟 2. 嵌套在里面的二级分组 “openclaw”
            {
              text: '🔽 openclaw',
              collapsed: false, // 展开里面的三级菜单
              items: [
                { text: 'src学习', link: '/ai/openclaw_src_cli' },
                { text: 'LLM 增量微调实战', link: '/5' }
              ]
            }

              ]
          }

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