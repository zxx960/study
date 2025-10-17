# 太阳系运行动画 / Solar System Animation

一个使用 Three.js 创建的交互式 3D 太阳系运行动画，包含太阳和八大行星。

An interactive 3D solar system animation created with Three.js, featuring the Sun and eight planets.

## 特性 / Features

- ⭐ **完整的太阳系**：包含太阳和所有八大行星（水星、金星、地球、火星、木星、土星、天王星、海王星）
- 🌍 **真实运行轨迹**：每个行星都有自己的轨道、公转速度和自转速度
- 💫 **星空背景**：10,000 颗星星构成的深空背景
- 🪐 **土星光环**：特别为土星添加了标志性的光环
- 🖱️ **交互控制**：
  - 鼠标拖动可旋转视角
  - 鼠标滚轮可缩放距离
- 📱 **响应式设计**：自适应不同屏幕尺寸

## 使用方法 / Usage

1. 直接在浏览器中打开 `index.html` 文件
2. 使用鼠标拖动旋转视角
3. 使用鼠标滚轮缩放距离

或者使用本地服务器：

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

- **Three.js** (r128) - 3D 图形库
- **HTML5** - 页面结构
- **CSS3** - 样式设计
- **JavaScript** - 动画逻辑

## 项目结构 / Project Structure

```
solar-system-threejs/
├── index.html          # 主文件，包含所有代码
└── README.md          # 项目说明文档
```

## 行星参数 / Planet Parameters

| 行星 / Planet | 半径 / Radius | 轨道半径 / Orbit | 公转速度 / Revolution | 自转速度 / Rotation |
|--------------|--------------|-----------------|---------------------|-------------------|
| 水星 Mercury   | 3.5          | 60              | 0.04                | 0.01              |
| 金星 Venus     | 8            | 85              | 0.015               | 0.005             |
| 地球 Earth     | 8.5          | 110             | 0.01                | 0.02              |
| 火星 Mars      | 5            | 140             | 0.008               | 0.018             |
| 木星 Jupiter   | 20           | 200             | 0.002               | 0.04              |
| 土星 Saturn    | 17           | 260             | 0.0009              | 0.038             |
| 天王星 Uranus  | 12           | 320             | 0.0004              | 0.03              |
| 海王星 Neptune | 11           | 370             | 0.0001              | 0.032             |

*注：参数为相对值，仅用于视觉效果，非真实比例*

## 浏览器兼容性 / Browser Compatibility

- Chrome / Edge (推荐 Recommended)
- Firefox
- Safari
- Opera

需要支持 WebGL 的现代浏览器。

## 许可证 / License

MIT License

## 作者 / Author

Created with ❤️ using Three.js
