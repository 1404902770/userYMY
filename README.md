# cli-3 => 查看更多:
Vue官网地址See [Configuration Reference](https://cn.vuejs.org/)
vue.config.js相关配置See [Configuration Reference](https://cli.vuejs.org/zh/config/)

## 安装
npm install -g @vue/cli

## 检查安装是否成功 如有版本号表示成功
npm vue --version 或 npm vue -V

## 在指定文件(或者想要的盘:)建立你的项目
npm vue create 项目名称

## 安装axios
npm install axios

## 初始化项目
npm install

### 启动项目
npm run serve -默认启动方式- 可更改package.json中的启动方式

### 项目打包
npm run build -默认打包方式- 可更改package.json中的打包方式
如遇到白屏问题请执行以下
npm install http-server -g
http-server

### 运行测试
npm run test

### 整理和修复文件
npm run lint

## ui图形化配置界面
npm vue ui

## 写在cli
npm uninstall vue-cli -g

## md5 加密
npm install --save js-md5

## 项目目录结构说明
├─ .gitignore git => 屏蔽提交文件 - 前提是在安装cli3的时候下载了git的配置，如没下载，可以手动下载
├─ node_modules => node的相关配置
├─ public => 通过执行 npm run build 产生
└─| src 主要我们要修改的地方
  |─assets  => 静态文件
  |─components => 存放组件(可服用类型)
  |─views => 我们正常写页面的地方
  |─App.vue => App主组件
  |─main.js => 入口JS
  |─router.js => 路由文件
  └─store.js => vueX store 文件
├─ .browserslistrc => 浏览器列表
├─ .eslintrc => 用来管理和检测js代码风格的工具 See [Configuration Reference](https://eslint.org/docs/user-guide/configuring)
├─ .gitignore => 屏蔽上传文件编写文件
├─  babel.config.js => 自定义babel的地方
├─  package-lock.json => 程序包锁定-查看项目所欲的配置依赖版本
├─  package.json => 当我们创建一个node项目，意味着创建一个module模块，这个模块的描述文件
├─  postcss.config => 添加浏览器私缀-也是现在新型浏览器支持某些新API，而其它浏览器不支持的证明
├─  README.md => 也就是本文件-写日志的地方-这个就不多BB了
└─  vue.config => 这个就很重要了-我们想要对该项目的相关配置都在这里-注意~！！(如果安装时选择自定义配置时)-是不会有该文件的-自己手动添加