# tjb

通过对手机网页版淘宝的爬虫实践，让我慢慢完善了[ElectronPageTentacle](https://github.com/cxwithyxy/ElectronPageTentacle) 。这是一个自用的爬虫框架吧，之后再试试爬亚马逊吧。



## 目前实现的功能

1. 自动登录淘宝
2. 金币庄园的自动收菜
3. 金币庄园的自动施肥
4. 金币庄园的日常店铺签到任务
5. 618猫猫的店铺的50次签到



## 学到了啥

1. Electronjs 中的模拟触摸事件的实现
2. Electronjs 中的模拟鼠标事件的实现
3. Electronjs 中的 cookies 的持久化（就是让浏览器关闭后还保持 session ）
4. 自己搞了个爬虫框架 ElectronPageTentacle
5. Electronjs 打包中的各种坑，看看那长长的 package.json



## 如何防爬虫

1. 图形验证码，这个无解，反正我是不想搞什么图形验证码识别的了
2. 通过 JSbridge 来防止一些应该在客户端中打开的页面被其他浏览器打开