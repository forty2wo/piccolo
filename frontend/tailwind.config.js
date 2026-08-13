/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a1a1a',
          light: '#6b6b6b',
          muted: '#999999',
        },
        border: '#e5e5e5',
        surface: '#fafafa',
        accent: '#8b7355',
        'accent-gold': '#c9a962',
        'accent-gold-dark': '#b8954d',
        // 暖色系（Piccola 主基调）
        'warm-paper': '#F7F3ED',  // 主背景：纸感米色
        'warm-cream': '#EFE9DE',  // 次级区块：奶油色
        'warm-ivory': '#FBF8F2',  // 卡片底：象牙白
        'warm-line':  '#E8E0D2',  // 分割线：暖灰
        'warm-text':  '#3a3530',  // 主文字：暖黑
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Arial', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
