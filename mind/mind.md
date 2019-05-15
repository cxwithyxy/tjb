## 备忘

------

#### 关于抢红包的

| 项              | 值                                                           |
| --------------- | :----------------------------------------------------------- |
| 点击马上抢      | document.querySelectorAll("body > div.rax-scrollview > div > div:nth-child(5) > div > div > div > div:nth-child(2) > div > div:nth-child(3)")[0].click() |
| 点击支付500积分 | document.querySelectorAll("body > div:nth-child(14) > div > div > div:nth-child(3) > div:nth-child(2)")[0].click() |
| 抢不到点击确认  | document.querySelectorAll("body > div:nth-child(14) > div > div > div:nth-child(3) > div")[0].click() |
| 直接红包请求    | https://wgo.mmstat.com/taojinbi17.core_hongbao_qiang.core_hongbao_qiang?gmkey=CLK&gokey=%26jsver%3Daplus_wap%26lver%3D8.10.4%26pver%3D0.6.6%26cache%3Dbc3a053%26_slog%3D0&cna=uzk0FY0DkjwCAduIX16tpk3Q&spm-cnt=a217e.9891748.0.0.345c07y407y4wn&logtype=2 |
|抢红包请求源码位置  | 第 30918 行  |

---
#### 关于金币任务

| 项                 | 值                                                           |
| ------------------ | ------------------------------------------------------------ |
| 任务页面           | https://m.tb.cn/h.e0ui9mz                                    |
| 任务页面嵌了iframe | document.querySelectorAll("iframe")[0]                       |
| 店铺链接获取       | document.querySelectorAll("a[href*=shop]")                   |
| 成就页面           | https://market.m.taobao.com/apps/market/tjb/achievement.html |
| 领取按钮会新建窗口 | window.open = console.log                                    |
| 点击第一个领取按钮 | document.querySelectorAll("body > div > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) > span")[0].click() |

------

关于庄园

| 项                       | 值                                                           |
| ------------------------ | ------------------------------------------------------------ |
| 每日签到                 | window.Biz.emit("sign")                                      |
| 界面可能会被自动往下滚动 | window.scrollTo(0, 0)                                        |
| 帮人浇水                 | window.Biz.emit("interact:water")                            |
| 叫人来浇你水             | window.Biz.emit("interact:helpWater")                        |
| 偷人家的菜               | window.Biz.emit("stealVege")                                 |
| 收自己的菜               | window.Biz.emit("harvestVege")                               |
| 继续加载好友列表         | document.querySelectorAll(".card-footer")[0].click()<br />可以死循环，知道报错就知道已经加载完了 |
| 获得好友列表的div        | document.querySelectorAll(".card-item")                      |
| 所有好友操作的按钮       | document.querySelectorAll(".card-item .content .item-action .action .btn") |

