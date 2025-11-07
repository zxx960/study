# 教学案例集合 / Interactive Learning Hub

一个温暖友好的教学案例集合网站，展示各种前端技术的交互式示例。

A warm and friendly collection of interactive learning examples showcasing various frontend technologies.

## 特性 / Features

- 🎨 **温暖手绘风格**：柔和的配色和圆润的设计，营造友好的学习氛围
- 📚 **案例集合**：多个前端技术教学案例，持续更新中
- 🎯 **交互式学习**：每个案例都可以实时预览和交互
- 📱 **响应式设计**：完美适配各种设备
- ✨ **流畅动画**：精心设计的过渡动画，提升用户体验

## 当前案例 / Current Cases

### 1. 太阳系运行动画
- 使用 Three.js 创建的 3D 太阳系模拟
- 包含太阳和八大行星
- 支持鼠标交互控制
- 查看：`/cases/solar-system/`

## 使用方法 / Usage

### 快速开始
1. 直接在浏览器中打开 `index.html` 文件
2. 点击任意案例卡片进入案例详情
3. 在案例页面中体验交互效果

### 本地服务器（推荐）
使用本地服务器可以获得更好的体验：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx http-server

# 使用 PHP
php -S localhost:8000
```

然后在浏览器中访问 `http://localhost:8000`

## 技术栈 / Tech Stack

- **HTML5** - 页面结构
- **CSS3** - 样式设计（温暖手绘风格）
- **JavaScript** - 交互逻辑和动画
- **Three.js** - 3D 图形库（用于太阳系案例）

## 项目结构 / Project Structure

```
study/
├── index.html                      # 首页（案例集合）
├── README.md                       # 项目说明文档
├── cases/                          # 案例文件夹
│   └── solar-system/              # 太阳系动画案例
│       └── index.html             # 案例页面
└── assets/                         # 资源文件夹
    ├── images/                    # 图片资源
    └── css/                       # 共用样式（可选）
```

## 添加新案例 / Adding New Cases

想要添加新的教学案例？按照以下步骤：

1. 在 `cases/` 文件夹中创建新的案例文件夹
2. 在该文件夹中创建 `index.html`
3. 在主页 `index.html` 中添加新的案例卡片
4. 更新此 README 文件

## 浏览器兼容性 / Browser Compatibility

- Chrome / Edge (推荐 Recommended)
- Firefox
- Safari
- Opera

支持现代浏览器即可，部分案例可能需要 WebGL 支持。

## 许可证 / License

MIT License

## 贡献 / Contributing

欢迎提交 Issue 和 Pull Request！

## 作者 / Author

Created with ❤️ for Learning
