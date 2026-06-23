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
          },

          {
          text: '📁 加密算法',
          collapsed: true, 
          items: [
            {
              text: '🔽 国密算法',
              collapsed: false, // 展开里面的三级菜单
              items: [
                { text: 'SM2', link: '/ctf/SM2' },
                { text: 'SM3', link: '/ctf/SM3' },
                { text: 'SM4', link: '/ctf/SM4' },
                { text: 'SM9', link: '/ctf/SM9' },
                { text: 'ZUC', link: '/ctf/ZUC' }
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
                { text: 'GPIO', link: '/embed/GPIO' },
                { text: '通信协议', link: '/embed/Stm32-通信协议' },
                { text: 'ADC', link: '/embed/ADC通道' },
                { text: '定时器', link: '/embed/定时器' },
                { text: '中断', link: '/embed/中断' },
              ]
            },

            {
              text: '🔽 Linux',
              collapsed: false, // 展开里面的三级菜单
              items: [
                { text: '字符设备', link: '/embed' },
                { text: '块设备', link: '/embed' }
              ]
            },

            {
              text: '🔽 嵌入式八股文',
              collapsed: false, // 展开里面的三级菜单
              items: [
                { text: '运算符', link: '/embed/运算符' },
                { text: '关键字', link: '/embed/关键字' },
                { text: '函数', link: '/embed/函数' },
                { text: '预处理', link: '/embed/预处理' },
                { text: '指针和数组', link: '/embed/指针和数组' },
                { text: '字符串函数', link: '/embed/字符串函数' },
                { text: '操作系统', link: '/embed/操作系统' },
                { text: '网络编程', link: '/embed/网络编程' },
                { text: '内存', link: '/embed/内存篇' },
                { text: '通信协议', link: '/embed/通信协议' },
                { text: '硬件', link: '/embed/硬件' }
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
            },

            {
              text: '🔽 论文笔记',
              collapsed: false, // 展开里面的三级菜单
              items: [
                { text: '基于llm的智能体安全', link: '/ai/llm-Agent' },
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