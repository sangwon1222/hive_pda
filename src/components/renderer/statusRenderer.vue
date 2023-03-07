<template>
  <div class="flex items-center gap-8">
    <span :class="computedClasses">{{ label }}</span>
    <a-icon-button
      v-if="params.value === 1000102 && !auth.is3pl"
      icon-name="Cargo"
      @icon-click="onStatusArrival"
    />
  </div>
</template>

<script>
import { computed, reactive, toRefs, inject } from 'vue'
import AIconButton from '@/components/atoms/aIconButton'

export default {
  name: 'statusRenderer',
  components: {
    AIconButton,
  },
  props: {
    params: {
      type: Object,
    },
  },

  setup(props) {
    const store = inject('store')
    const state = reactive({
      code: props.params.value,
      computedClasses: computed(() => {
        const data = statusCodeList[state.code]
          ? `status-${statusCodeList[state.code]?.color}`
          : ''
        return [data, 'status', `status-${statusCodeList[state.code]?.color}`]
      }),
      label: computed(() => {
        const data = statusCodeList[state.code]
          ? statusCodeList[state.code]?.label
          : ''
        return data
      }),
      auth: computed(() => store.getters['Auth/authority']),
    })

    const statusCodeList = {
      100401: {
        label: 'ACTIVE',
        color: 100,
      },
      100402: {
        label: 'INACTIVE',
        color: 100,
      },
      150101: {
        label: '활성화',
        color: 100,
      },
      150102: {
        label: '비활성화',
        color: 100,
      },
      150201: {
        label: '물리',
        color: 100,
      },
      150202: {
        label: '논리',
        color: 100,
      },
      150301: {
        label: '피킹',
        color: 100,
      },
      150302: {
        label: '보관',
        color: 100,
      },
      150303: {
        label: '보충',
        color: 100,
      },
      150401: {
        label: '팔레트랙',
        color: 100,
      },
      150402: {
        label: '선반랙',
        color: 100,
      },
      200101: {
        label: '차량',
        color: 100,
      },
      200102: {
        label: '택배',
        color: 100,
      },
      200103: {
        label: '차량+택배',
        color: 100,
      },
      200901: {
        label: 'ACTIVE',
        color: 100,
      },
      200902: {
        label: 'INACTIVE',
        color: 100,
      },
      300201: {
        label: '활성화',
        color: 100,
      },
      300202: {
        label: '비활성화',
        color: 100,
      },
      300203: {
        label: '탈퇴',
        color: 100,
      },
      300301: {
        label: 'ACTIVE',
        color: 100,
      },
      300302: {
        label: 'INACTIVE',
        color: 100,
      },
      300401: {
        label: '활성화',
        color: 100,
      },
      300402: {
        label: '비활성화',
        color: 100,
      },
      300501: {
        label: '활성화',
        color: 100,
      },
      300502: {
        label: '비활성화',
        color: 100,
      },
      300503: {
        label: '탈퇴',
        color: 100,
      },
      310101: {
        label: '출고요청',
        color: 100,
      },
      310102: {
        label: '출고작업중',
        color: 300,
      },
      310103: {
        label: '출고요청취소',
        color: 800,
      },
      310104: {
        label: '출고완료',
        color: 700,
      },
      310501: {
        label: '작업중',
        color: 100,
      },
      310507: {
        label: '출고 완료',
        color: 100,
      },
      310508: {
        label: '출고 취소',
        color: 100,
      },
      310601: {
        label: 'SINGLE',
        color: 100,
      },
      310602: {
        label: 'MULTI',
        color: 100,
      },
      310603: {
        label: 'WALLAVU',
        color: 100,
      },
      310604: {
        label: 'SABANGNET',
        color: 100,
      },
      // 출고-피킹 100=미작업, 400=> 작업중 , 600=> 보충지시, 700->피킹완료
      310701: {
        label: '미작업',
        color: 100,
      },
      310702: {
        label: '작업중',
        color: 400,
      },
      310703: {
        label: '보충지시',
        color: 400,
      },
      310704: {
        label: '피킹완료',
        color: 600,
      },
      // 출고-피킹
      400101: {
        label: '활성화',
        color: 100,
      },
      400102: {
        label: '비활성화',
        color: 100,
      },
      400201: {
        label: '활성화',
        color: 100,
      },
      400202: {
        label: '비활성화',
        color: 100,
      },
      500101: {
        label: 'ACTIVE',
        color: 100,
      },
      500102: {
        label: 'INACTIVE',
        color: 100,
      },
      700201: {
        label: '활성화',
        color: 100,
      },
      700202: {
        label: '비활성화',
        color: 100,
      },
      700203: {
        label: '삭제',
        color: 100,
      },
      777701: {
        label: 'CREATE',
        color: 100,
      },
      777702: {
        label: 'UPDATE',
        color: 100,
      },
      777703: {
        label: 'DELETE',
        color: 100,
      },
      777704: {
        label: 'NONE',
        color: 100,
      },
      800101: {
        label: '전체보유',
        color: 100,
      },
      800102: {
        label: '부분부족',
        color: 100,
      },
      800103: {
        label: '재고없음',
        color: 100,
      },
      900101: {
        label: '발주 대기',
        color: 100,
      },
      900102: {
        label: '발주 취소',
        color: 200,
      },
      900103: {
        label: '발주 완료',
        color: 300,
      },
      900104: {
        label: '발주서 발행',
        color: 400,
      },
      900105: {
        label: '삭제',
        color: 500,
      },
      1000101: {
        label: '입고증완료대기',
        color: 100,
      },
      1000102: {
        label: '입고예정',
        color: 100,
      },
      1000103: {
        label: '상품도착',
        color: 200,
      },
      1000104: {
        label: '입고가검수완료',
        color: 100,
      },
      1000105: {
        label: '검수완료',
        color: 400,
      },
      1000106: {
        label: '입고완료',
        color: 700,
      },
      1000107: {
        label: '입고적치대기',
        color: 100,
      },
      1000108: {
        label: '입고취소',
        color: 800,
      },
      1000109: {
        label: '검수중',
        color: 300,
      },
      1000110: {
        label: '입고지변경',
        color: 100,
      },
      1000301: {
        label: '상품 도착',
        color: 100,
      },
      1000302: {
        label: '입고 검수',
        color: 100,
      },
      1000303: {
        label: '입고 확정',
        color: 100,
      },
      1000304: {
        label: '입고 적치',
        color: 600,
      },
      1000305: {
        label: '입고 완료',
        color: 700,
      },
      1000306: {
        label: '입고 취소',
        color: 500,
      },
      1000701: {
        label: '정상입고',
        color: 100,
      },
      1000702: {
        label: '부분입고',
        color: 100,
      },
      1700101: {
        label: '검수대기',
        color: 100,
      },
      1700102: {
        label: '검수완료',
        color: 100,
      },
      1700103: {
        label: '취소',
        color: 100,
      },
      1700104: {
        label: '검수중',
        color: 100,
      },
      1700105: {
        label: '검수확정',
        color: 100,
      },
      2000601: {
        label: 'COMMON',
        color: 100,
      },
      2000602: {
        label: 'CHINA',
        color: 100,
      },
      2000603: {
        label: 'GLOBAL',
        color: 100,
      },
      2000701: {
        label: 'stock_transfer',
        color: 100,
      },
      2000702: {
        label: 'shipping_supplement',
        color: 100,
      },
      2100101: {
        label: '보관대기',
        color: 100,
      },
      2100102: {
        label: '부분보관',
        color: 100,
      },
      2100103: {
        label: '보관완료',
        color: 100,
      },
      2100104: {
        label: '취소',
        color: 100,
      },
      2100201: {
        label: '보관대기',
        color: 100,
      },
      2100202: {
        label: '보관완료',
        color: 100,
      },
      2100203: {
        label: '취소',
        color: 100,
      },
      3000001: {
        label: '미작업',
        color: 100,
      },
      3000002: {
        label: '완료',
        color: 100,
      },
      3000101: {
        label: '패킹미작업',
        color: 100,
      },
      3000102: {
        label: '패킹완료',
        color: 100,
      },
      3000201: {
        label: '미작업',
        color: 100,
      },
      3000202: {
        label: '작업중',
        color: 100,
      },
      3000203: {
        label: '완료',
        color: 100,
      },
      // ShippingOrder
      3100301: {
        label: 'OB',
        color: 600,
      },
      3100302: {
        label: 'OC',
        color: 600,
      },
      // ShippingOrder
      3100401: {
        label: '대기',
        color: 100,
      },
      3100402: {
        label: '피킹 작업중',
        color: 100,
      },
      3100403: {
        label: '보충 지시',
        color: 100,
      },
      3100404: {
        label: '피킹 완료',
        color: 100,
      },

      3100405: {
        label: '재고 보충 완료',
        color: 100,
      },
      3100406: {
        label: '재고 보충 취소',
        color: 100,
      },
      3100407: {
        label: '요청 취소',
        color: 100,
      },
      3300201: {
        label: '일반',
        color: 800,
      },
      3300202: {
        label: '당일',
        color: 100,
      },
      4000101: {
        label: 'ACTIVE',
        color: 100,
      },
      4000102: {
        label: 'INACTIVE',
        color: 100,
      },
      4000301: {
        label: '잔디',
        color: 100,
      },
      4000302: {
        label: 'TEAMS',
        color: 100,
      },
    }

    const onStatusArrival = () => {
      props.params.context.onStatusArrival(props.params) // mAgGrid에서 context를 설정해서 데이터를 던져주도록.
    }

    return {
      ...toRefs(state),
      onStatusArrival,
    }
  },
}
</script>

<style lang="scss" scoped></style>
