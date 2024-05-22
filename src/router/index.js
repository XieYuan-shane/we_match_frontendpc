import {createRouter,createWebHashHistory} from "vue-router"

const routes = [
	{//登录界面
		path:'/',
		name:'login',
		component:()=>import('@/page/login/login.vue')
	},
	{
		path:'/index',
		name:'index',
		component:()=>import('@/page/index/index.vue'),
		redirect:'/daily-recom',
		// 二级路由
		children:[
	
			{//每日推荐
				path:'/daily-recom',
				name:'daily-recom',
				component:()=>import('@/page/daily-recom/index.vue')
			},
			{//上传每日推荐
				path:'/daily-recom-upload',
				name:'daily-recom-upload',
				component:()=>import('@/page/daily-recom/upload.vue')
			},
			{//导航设置
				path:'/nav-settings',
				name:'nav-settings',
				component:()=>import('@/page/nav-settings/index.vue')
			},
			{//推荐文章
				path:'/reco-article',
				name:'reco-article',
				component:()=>import('@/page/reco-article/index.vue')
			},
			{//选择文章
				path:'/reco-article-upload',
				name:'reco-article-upload',
				component:()=>import('@/page/reco-article/upload.vue')
			},
			{//文章管理
				path:'/article-manag',
				name:'article-manag',
				component:()=>import('@/page/article-manag/index.vue')
			},
			{//用户管理
				path:'/user-manag',
				name:'user-manag',
				component:()=>import('@/page/user-manag/index.vue')
			},
			// {//后台设置
			// 	path:'/back-setting',
			// 	name:'back-setting',
			// 	component:()=>import('@/page/back-setting/index.vue')
			// }
		]
	}
]

const router = createRouter({
  // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes
})

export default router