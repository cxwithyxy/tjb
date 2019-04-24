# Electron 做爬虫的学习笔记

------

## 离屏渲染

在做爬虫时，往往需要多个窗口同时操作，而 **new** 了一堆 **BrowserWindow** ，会另电脑卡顿之外，烦人的窗口显得密密麻麻。

而这个时候可以调用 **BrowserWindow**  实例中的 **hide** 函数，但是，直接 **hide** 了之后界面就不再渲染了。因为 **Electron** 默认是不会绘制和渲染可视区域外的窗口的。这个时候界面中的 **css** 动画或者 **js** 动画，都是不会动的。当目标网页因而“冻结”的时候，你的爬虫就爬不动了，连“下一页”按钮都没有渲染出来呢（总所周知，现在大多数网页都是采用前后端分离的方案）。

因此又想 **hide** 了窗口，又想让窗口里面的内容保持运行。这个时候就需要注意一个叫 **offscreen** 的东西了

详细看 **BrowserWindow** 的构造函数使用说明，里面提及到 **webPreferences** 中有个 **offscreen** 的属性

> offscreen Boolean (optional) - 是否绘制和渲染可视区域外的窗口. 默认值为 false. 更多详情, 请参见 [offscreen rendering tutorial](<https://electronjs.org/docs/tutorial/offscreen-rendering>) 

在实例化 **BrowserWindow** 的时候，传入 **offscreen: true**，之后就可以随意调用实例的 **hide** 函数，此时这个窗口隐藏后也能够保证里面的网页正常运行而不会暂停了。