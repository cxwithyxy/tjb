# Electron 做爬虫的学习笔记

------

## 离屏渲染

在做爬虫时，往往需要多个窗口同时操作，而 **new** 了一堆 **BrowserWindow** ，会另电脑卡顿之外，烦人的窗口显得密密麻麻。

而这个时候可以调用 **BrowserWindow**  实例中的 **hide** 函数，但是，直接 **hide** 了之后界面就不再渲染了。因为 **Electron** 默认是不会绘制和渲染可视区域外的窗口的。这个时候界面中的 **css** 动画或者 **js** 动画，都是不会动的。当目标网页因而“冻结”的时候，你的爬虫就爬不动了，连“下一页”按钮都没有渲染出来呢（总所周知，现在大多数网页都是采用前后端分离的方案）。

因此又想 **hide** 了窗口，又想让窗口里面的内容保持运行。这个时候就需要注意一个叫 **offscreen** 的东西了

详细看 **BrowserWindow** 的构造函数使用说明，里面提及到 **webPreferences** 中有个 **offscreen** 的属性

> offscreen Boolean (optional) - 是否绘制和渲染可视区域外的窗口. 默认值为 false. 更多详情, 请参见 [offscreen rendering tutorial](<https://electronjs.org/docs/tutorial/offscreen-rendering>) 

在实例化 **BrowserWindow** 的时候，传入 **offscreen: true**，之后就可以随意调用实例的 **hide** 函数，此时这个窗口隐藏后也能够保证里面的网页正常运行而不会暂停了。



## 机器人检测

有些网站并不是采用图形验证码来防止机器人，而是通过类似国外网站常用的 **用户只需勾选“我不是机器人（I'm not a robt）”**。对于爬虫来说，比图形验证码要好处理得多了。

在 **Electron** 中，默认窗口网页是有 **nodejs** 上下文的，导致无法通过机器人检测。启动 **sandbox** 模式，就可以对其网页禁用包括 **nodejs** 在内的 **Electron** 特性。

> - `sandbox` Boolean (可选)-如果设置该参数, 沙箱的渲染器将与窗口关联, 使它与Chromium OS-level 的沙箱兼容, 并禁用 Node. js 引擎。 它与 `nodeIntegration` 的选项不同，且预加载脚本的 API 也有限制. [更多详情](https://electronjs.org/docs/api/sandbox-option). **注意:**改选项目前是为实验性质，可能会在 Electron 未来的版本中移除。



## 主线程和渲染进程的通讯

渲染进程，通常就是指的是被爬的网页在 **Electron** 中打开的窗口上下文

一般都是通过 **ipcMain** 和 **ipcRenderer** 进行通讯。不过在 **sandbox** 模式下，需要通过 **preload** 加载一个 **js** 文件，在这个 **js** 文件中，才能调用 **require** 加载 **ipcRenderer** 。

对于爬虫来说，上述方法显得有点累赘。通过 **WebContents** 的 **executeJavaScript** 让渲染进程执行原生 **js** 代码，就显得方便多了，要注意的是 **executeJavaScript** 可以返回 **字符串**、 **数字**、 **Promise** ，但别的复杂对象就无法返回了。

而目前我测试出来了的是，如果你是 **await** **executeJavaScript** ，其执行的 **js** 代码，一旦报错了，就一直卡在 **await** 中了，为了避免这个坑，要尽可能通过 **try catch** 包裹要执行的 **js** 代码



## 保持登陆状态

常常会遇到需要登陆才能获取的数据，在爬虫中也是一个坑，而 **Electron** 作为浏览器，当其关闭的时候，**session** 就会释放。下一次启动爬虫的时候，又要登陆。 

解决这个问题之前，我们要好好想想网页开发中的 **session** 底层是怎么实现。**php** （其他语言也是一样）是如何与浏览器交互实现 **session** 的呢？

#### 大致原理

服务器端，通过保存一个东西，可能是这样的：

| key      | value         |
| -------- | ------------- |
| eyhsjduy | 用户 A 的数据 |
| nchdyejq | 用户 B 的数据 |
| laostgnb | 用户 C 的数据 |

然后服务器告知用户 A 的浏览器说，你存一个这样的 **cookie** 吧：

| key          | value    |
| ------------ | -------- |
| user_session | eyhsjduy |

在浏览器关闭之前，每次访问这个网站，都会提交这个 **cookie** ，因而服务器就知道这个是用户 A 了

而这个 **cookie** 是没有超时时间的，对于浏览器来说，所有没有超时时间的 **cookie** 都是不写入硬盘的，这就导致了下次打来浏览器就没有这个 **cookie** 了

#### 解决方案

所以，通过 **Electron** 的 **session** 类 读取 **cookie** ，在通过 **fs** 之类的文件操作保存到本地（持久化操作），下次打开时再读取并设置 **cookie** 即可。



## 模拟触摸事件