import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3'

export default defineConfig({
  title: "JZH的学习日志",
  description: "CTF | 嵌入式 | Agent学习笔记",
  
  themeConfig: {
    // 1. 顶部导航栏：可以一键切换大板块
    nav: [
      { text: '首页', link: '/' },
      { text: 'CTF攻防学习笔记', link: '/ctf/introduce' },
      { text: '嵌入式学习笔记', link: '/embed/introduce' },
      { text: 'Agent学习笔记', link: '/ai/introduce' }
    ],

    // 2. 左侧侧边栏：让每个板块下面都可以无限细分小专题
    sidebar: [
      {
        text: '🚩 CTF攻防之路',
        collapsed: false, // 是否默认展开
        items: [
          {
          text: '📁 PWN学习笔记',
          collapsed: true, 
          items: [
            {
              text: '🔽 题解',
              collapsed: false, // 展开里面的三级菜单
              items: [
                { text: '题解1', link: '/ctf/' },
                { text: '题解2', link: '/ctf/' }
              ]
            }

              ]
          }
        ]
      },
      {
        text: '🤖 嵌入式学习笔记',
        collapsed: false,
        items: [
          {
          text: '📁 嵌入式学习笔记',
          collapsed: true, 
          items: [
            {
              text: '🔽 Stm32',
              collapsed: false, // 展开里面的三级菜单
              items: [
                { text: 'GPIO', link: '/embed' },
                { text: '通信协议', link: '/embed' }
              ]
            },

            {
              text: '🔽 Linux',
              collapsed: false, // 展开里面的三级菜单
              items: [
                { text: '字符设备', link: '/embed' },
                { text: '块设备', link: '/embed' }
              ]
            }
              ]
          }
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
            {
              text: '🔽 openclaw',
              collapsed: false, // 展开里面的三级菜单
              items: [
                { text: 'src学习', link: '/ai/openclaw_src_cli' },
                { text: 'hhh', link: '/ai/' }
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