# nodejs-manage-web

#### <a href="http://boss.dev.jr-zbj.com/#/home" target="_blank">新版 BOSS 管理系统</a>

#### 技术源

- `nodejs-manage-web` 基于 `vue3.x` 、`Typescript`、`vite`、`Element plus`、`eggjs`

- 框架源 `vue-next-admin`

#### 本地开发

```typescript
本地服务：npm run serve
开启服务：npm run start

网页端口：11000
服务端口：21000
```

#### 线上命令

##### 1、打包服务

```typescript
[开发]：npm run "build:dev"
[测试]：npm run "build:test"
[UAT]：npm run "build:uat"
[生产]：npm run "build:prod"
```

##### 2、启动服务

```typescript
[开发]：npm run dev
[测试]：npm run test
[UAT]：npm run uat
[生产]：npm run prod

停止服务：npm run stop
```

### 项目说明

#### 服务端

##### 1、eggjs 服务端代理

- 中间件

  - 登录权限拦截器 [auth]
  - 日志拦截器 [httpLogger]
  - 接口提交限制 [ratelimit]
  - 页面 GET 请求 [connectHistory]
  - 错误处理 [errorHandler]

- 插件
  - 静态资源 [static]
  - redis [egg-redis]
  - apollo [@gaoding/egg-apollo-client]
  - session 存储在 redis [egg-session-redis]
  - 请求追踪 [egg-apigw-tracer]

##### 2、apollo 配置中心

- [http://apollo-portal.bjjk-public:8070/signin](http://apollo-portal.bjjk-public:8070/signin)

##### 3、k8s 接入

- Dockerfile

```dockerfile
# 设置基础镜像,如果本地没有该镜像，会从Docker.io服务器pull镜像
FROM harbor.test.jr-zbj.com/runtime/nodev16:v1

# 这个是容器中的文件目录
RUN mkdir -p /opt/app

# 设置工作目录
WORKDIR /opt/app

# 拷贝package.json文件到工作目录
# !!重要：package.json需要单独添加。
# Docker在构建镜像的时候，是一层一层构建的，仅当这一层有变化时，重新构建对应的层。
# 如果package.json和源代码一起添加到镜像，则每次修改源码都需要重新安装npm模块，这样木有必要。
# 所以，正确的顺序是: 添加package.json；安装npm模块；添加源代码。
# COPY package.json /opt/app/package.json

# 安装npm依赖(使用淘宝的镜像源)
# 如果使用的境外服务器，无需使用淘宝的镜像源，即改为`RUN npm i`。
# RUN npm i --production --registry=http://nexus.jr-zbj.com/repository/npm-public/

# RUN yarn config set registry http://nexus.jr-zbj.com/repository/npm-public/ && yarn

# 拷贝所有源代码到工作目
COPY . /opt/app

# 暴露容器端口
EXPOSE 3110

# 启动服务
CMD npm start $NODE_ENV
```

#### 客户端

##### 1、vite 配置

> vite 的环境配置文件 使用 VITE\_ 前缀才可以访问

- vite.config.ts

  - server 本地开发配置
  - build 打包生产配置
  - optimizeDeps 优化配置
  - define 注入全局变量配置

- 读取配置文件
  - .env 通用配置
  - .env.development 本地配置
  - .env.dev 开发环境配置
  - .env.test 测试环境配置
  - .env.uat uat 环境配置
  - .env.production 生产环境配置

##### 2、Typescript

- tsconfig.json 环境配置

##### 3、Vue^3.2.45

- 组合式 API `script lang="ts" setup 语法糖`
- 指令 `directive`
- 注入 `provide/inject`
- 组合式函数 - 代替混入 minix
- pinia 全局状态管理
- vue-router

### 动态路由模板

```typescript
export const homeRoutes: Array<RouteRecordRaw> = [
	{
		path: '/home',
		name: `home`,
		component: () => import('/@/views/home.vue'),
		meta: {
			title: '首页',
			isHide: false,
			isKeepAlive: true,
			isAffix: true,
			icon: 'iconfont icon-shouye',
		},
	},
];

export const dynamicRoutes: Array<any> = [
	{
		path: '/',
		name: '/',
		component: () => import('/@/layout/index.vue'),
		redirect: '/home',
		meta: {
			isKeepAlive: true,
		},
		children: [
			...homeRoutes,

			{
				path: '/link',
				name: `layoutLinkView`,
				component: () => import('/@/layout/routerView/link.vue'),
				meta: {
					isLink: 'http://www.baidu.com',
					isIframe: false,
					title: '外部链接',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					icon: 'iconfont icon-shouye',
				},
			},

			{
				path: '/jfmanage',
				name: `jfmanage`,
				redirect: '/jfmanage/home',
				component: () => import('/@/views/routerView/parent.vue'),
				meta: {
					title: '综合管理',
					isNotMenuShow: true,
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					icon: 'iconfont icon-shouye',
				},
				children: [
					{
						path: '/jfmanage/home',
						name: `jfmanage-home`,
						component: () => import('/@/views/jfmanage/index.vue'),
						meta: {
							title: '综合首页',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							icon: 'iconfont icon-shouye',
						},
					},
					{
						path: '/jfmanage/permission',
						name: `jfmanage-permission`,
						component: () => import('/@/layout/routerView/parent.vue'),
						redirect: '/jfmanage/permission/operator',
						meta: {
							title: '权限管理',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							icon: 'iconfont icon-shouye',
						},
						children: ((c) => [
							{
								path: '/jfmanage/permission/operator',
								name: `jfmanage-${c}-operator`,
								component: () => import('/@/views/jfmanage/permission/operator.vue'),
								meta: {
									title: '操作员管理',
									isHide: false,
									isKeepAlive: true,
									isAffix: false,
									icon: 'iconfont icon-shouye',
								},
							},
						])('permission'),
					},

					{
						path: '/jfmanage/system',
						name: `jfmanage-system`,
						component: () => import('/@/layout/routerView/parent.vue'),
						redirect: '/jfmanage/system/menu',
						meta: {
							title: '系统管理',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							icon: 'iconfont icon-shouye',
						},
						children: ((c) => [
							{
								path: '/jfmanage/system/menu',
								name: `jfmanage-${c}-menu`,
								component: () => import('/@/layout/routerView/parent.vue'),
								redirect: '/jfmanage/system/menu/list',
								meta: {
									title: '菜单管理',
									isHide: false,
									isKeepAlive: true,
									isAffix: false,
									icon: 'iconfont icon-shouye',
								},
								children: ((d) => [
									{
										path: '/jfmanage/system/menu/list',
										name: `jfmanage-${c}-${d}-list`,
										component: () => import('/@/views/jfmanage/permission/operator.vue'),
										meta: {
											title: '菜单列表',
											isHide: false,
											isKeepAlive: true,
											isAffix: false,
											icon: 'iconfont icon-shouye',
										},
									},

									{
										path: '/jfmanage/system/menu/operator',
										name: `jfmanage-${c}-${d}-operator`,
										component: () => import('/@/views/jfmanage/permission/operator.vue'),
										meta: {
											title: '菜单权限',
											isHide: false,
											isKeepAlive: true,
											isAffix: false,
											icon: 'iconfont icon-shouye',
										},
									},
								])('menu'),
							},
						])('system'),
					},
				],
			},
		],
	},
];
```
