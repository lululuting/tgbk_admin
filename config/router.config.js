
export default [
  {
    path: '/login',
    name: 'login',
    component: '../layouts/UserLayout',
    routes: [
      { 
        path :'/login',
        component:"./login"
      },
    ]
  },

  {
    path: '/articleDetails',
    name: 'articleDetails',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: './articleEdit',
        component: './articleEdit/index.jsx',
      }
    ]
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/articleManage',
            authority: ['admin'],
          },
          {
            path: '/articleManage',
            name: '文章管理',
            icon: 'file-text',
            component: './articleManage/index.jsx',
            authority: ['admin'],
          },
          // {
          //   path: '/articleManage/articleEdit',
          //   name: '文章',
          //   icon: 'file-text',
          //   component: './articleEdit/index.jsx',
          //   authority: ['admin'],
          //   hideInMenu: true,
          // },
          {
            path: '/bannerManage',
            name: '广告管理',
            icon: 'picture',
            component: './bannerManage/index.jsx',
            authority: ['admin'],
          },
          // 2020.12.11，前台已有功能，所以废弃个人中心和问题反馈
          // {
          //   path: '/userCenter',
          //   name: '个人中心',
          //   icon: 'user',
          //   component: './userCenter',
          //   authority: ['admin'],
          // },
          // {
          //   path: '/feedback',
          //   name: '问题反馈',
          //   icon: 'message',
          //   component: './feedback',
          //   authority: ['admin'],
          // },
          
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
]