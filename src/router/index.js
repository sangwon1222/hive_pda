import { createRouter, createWebHistory } from 'vue-router'

// const SignIn = () =>
//   import(/* webpackChunkName: "SignIn" */ '../views/auth/SignIn.vue')
// 추가 PDA (이상원)
// PDA 홈화면
const Update = () => import('../views/Update.vue')
const Pdahome = () =>
  import(/*webpackChunkName: "Pdahome"*/ '../views/pdaHome/index.vue')

const Pdamain = () =>
  import(/*webpackChunkName: "Pdamain"*/ '../views/pdaHome/main/index.vue')

//*** 입고
const PdaReceiving = () =>
  import(
    /*webpackChunkName: "PdaReceiving"*/ '../views/pdaHome/receiving/receive.vue'
  )
//*** 출고
const PdaShipping = () =>
  import(
    /*webpackChunkName: "PdaShipping"*/ '../views/pdaHome/shipping/shipping.vue'
  )
const PdaShippingRegist = () =>
  import(
    /*webpackChunkName: "PdaShippingRegist"*/ '../views/pdaHome/shipping/regist.vue'
  )
//*** 재고
const PdaStockRegist = () =>
  import(
    /*webpackChunkName: "PdaStockRegist"*/ '../views/pdaHome/stock/regist.vue'
  )

const routes = [
  /**
   * 라우터에 없는 페이지 진입시, 뒤로가기
   */
  {
    path: '/:pathMatch(.*)*',
    redirect: '/pda',
  },

  {
    path: '/auth/signin',
    name: 'SignIn',
    meta: {
      authRequired: false,
      allows: 'admin',
      title: 'pdahome',
      layout: 'ClearLayout',
    },
    component: Pdahome,
  },

  /**
   * 업데이트 내역 페이지
   */
  {
    path: '/update',
    name: 'Update',
    meta: { authRequired: false, layout: 'ClearLayout' },
    component: Update,
  },

  /**
   * PDA 로그인 페이지
   */
  {
    path: '/',
    name: 'Pdahome',
    component: Pdahome,
    meta: {
      authRequired: false,
      layout: 'ClearLayout',
    },
  },

  /**
   * PDA 메인페이지
   */
  {
    path: '/pda',
    name: 'Pdahome',
    component: Pdahome,
    meta: {
      authRequired: false,
      layout: 'ClearLayout',
    },
  },

  /**
   * PDA 메인페이지
   */
  {
    path: '/pda/main',
    name: 'Pdamain',
    component: Pdamain,
    meta: {
      authRequired: true,
      layout: 'PdaLayout',
      requiredApi: ['warehouseList'],
    },
  },

  /**
   * 입고
   */
  {
    path: '/pda/receive',
    name: 'PdaReceiving',
    meta: {
      authRequired: true,
      layout: 'PdaLayout',
      requiredApi: ['warehouseList'],
    },
    component: PdaReceiving,
  },

  /**
   * 피킹- 출고지시 검색 페이지
   */
  {
    path: '/pda/shipping',
    name: 'PdaShipping',
    meta: {
      authRequired: true,
      layout: 'PdaLayout',
      requiredApi: ['warehouseList'],
    },
    component: PdaShipping,
  },

  /**
   * 피킹- 피킹페이지
   */
  {
    path: '/pda/shipping/:code/:id',
    name: 'PdaShippingRegist',
    meta: {
      authRequired: true,
      layout: 'PdaLayout',
      requiredApi: ['warehouseList'],
    },
    component: PdaShippingRegist,
  },
  /**
   * 재고- 재고이동페이지
   */
  {
    path: '/pda/stock/regist',
    name: 'PdaStockRegist',
    meta: {
      authRequired: true,
      layout: 'PdaLayout',
      requiredApi: ['warehouseList'],
    },
    component: PdaStockRegist,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authRequired = to.meta.authRequired
  if (authRequired) {
    const loggedIn = JSON.parse(localStorage.getItem('loggedIn'))
    const warehouseList = JSON.parse(localStorage.getItem('warehouseList'))
    if (loggedIn && warehouseList && warehouseList.length) {
      next()
    } else {
      localStorage.clear()
      next({ name: 'Pdahome' })
    }
  } else {
    next() // 페이지 전환
  }
})

export default router
