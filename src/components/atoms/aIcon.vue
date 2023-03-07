<template>
  <div class="icon-wrap">
    <component :is="computedName" :class="computedClasses" @click="iconClick" />
  </div>
</template>

<script>
import Logout from '@/assets/svg/icon-logout.svg'
import LnbSimply from '@/assets/svg/icon-lnb-simply.svg'
import LnbFold from '@/assets/svg/icon-lnb-fold.svg'
import GlobalTabItemClose from '@/assets/svg/icon-global-tab-item-close.svg'
import GlobalTabItemAdd from '@/assets/svg/icon-global-tab-item-add.svg'
import LogoGroup from '@/assets/svg/logo.svg'
import Receiving from '@/assets/svg/icon-lnb-receiving.svg'
import Shipping from '@/assets/svg/icon-lnb-shipping.svg'
import Return from '@/assets/svg/icon-lnb-return.svg'
import Stock from '@/assets/svg/icon-lnb-stock.svg'
import Report from '@/assets/svg/icon-lnb-report.svg'
import Mdm from '@/assets/svg/icon-lnb-mdm.svg'
import Manual from '@/assets/svg/icon-lnb-manual.svg'
import ko from '@/assets/svg/icon-kr.svg'
import en from '@/assets/svg/icon-en.svg'
import cn from '@/assets/svg/icon-cn.svg'
import ChevronDownUser from '@/assets/svg/icon-user-chevron-down.svg'
import Logo from '@/assets/svg/icon-logo.svg'
import YesbeeText from '@/assets/svg/icon-yesbee-text.svg'
import Hamburger from '@/assets/svg/icon-hamburger.svg'
import Search from '@/assets/svg/icon-search.svg'
import Barcode from '@/assets/svg/icon-barcode.svg'
import Print from '@/assets/svg/icon-print.svg'
import Calendar from '@/assets/svg/icon-calendar.svg'
import Download from '@/assets/svg/icon-download.svg'
import Order from '@/assets/svg/icon-order.svg'
import Refresh from '@/assets/svg/icon-refresh.svg'
import Cargo from '@/assets/svg/icon-cargo.svg'
import Won from '@/assets/svg/icon-won.svg'
import Dollar from '@/assets/svg/icon-dollar.svg'
import Yuan from '@/assets/svg/icon-yuan.svg'
import Percent from '@/assets/svg/icon-percent.svg'
import Plus from '@/assets/svg/icon-plus.svg'
import Add from '@/assets/svg/icon-add.svg'
import AddItem from '@/assets/svg/icon-add-item.svg'
import AddBlue from '@/assets/svg/icon-add-blue.svg'

import Pdf from '@/assets/svg/icon-pdf.svg'
import Excel from '@/assets/svg/icon-excel.svg'
import Warn from '@/assets/svg/icon-warn.svg'
import Tooltip from '@/assets/svg/icon-tooltip.svg'
import LeftArrow from '@/assets/svg/icon-left-arrow.svg'
import RadioOn from '@/assets/svg/button-radio-on.svg'
import RadioOff from '@/assets/svg/button-radio-off.svg'
import CheckOn from '@/assets/svg/button-check-on.svg'
import CheckOff from '@/assets/svg/button-check-off.svg'
import ChevronDown from '@/assets/svg/chevron-down.svg'
import ChevronDownDisabled from '@/assets/svg/chevron-down-disabled.svg'
import Delete from '@/assets/svg/icon-delete-on.svg'
import DeleteDisabled from '@/assets/svg/icon-delete-off.svg'
import Spinner from '@/assets/svg/icon-spinner.svg'
import Seperator from '@/assets/svg/icon-seperator.svg'
import SeperatorDark from '@/assets/svg/icon-seperator-dark.svg'
import ChevronDownSearchBox from '@/assets/svg/icon-chevron-down-searchbox.svg'
import AscArrow from '@/assets/svg/icon-asc-arrow.svg'
import DescArrow from '@/assets/svg/icon-desc-arrow.svg'

import Pdalogo from '@/assets/svg/pda-logo.svg'
import PdaHeaderIcon from '@/assets/svg/pda-header-icon.svg'
import BarcodeIcon from '@/assets/svg/barcode-icon.svg'
import KeyboardIcon from '@/assets/svg/keyboard.svg'

import { computed, reactive, toRefs } from 'vue'

export default {
  name: 'aIcon',
  components: {
    Logout,
    LnbSimply,
    LnbFold,
    GlobalTabItemAdd,
    GlobalTabItemClose,
    LogoGroup,
    Receiving,
    Shipping,
    Return,
    Stock,
    Report,
    Mdm,
    Manual,
    ko,
    en,
    cn,
    ChevronDownUser,
    Logo,
    YesbeeText,
    Hamburger,
    Add,
    AddItem,
    ChevronDownSearchBox,
    SeperatorDark,
    Seperator,
    Spinner,
    Delete,
    DeleteDisabled,
    ChevronDownDisabled,
    KeyboardIcon,
    ChevronDown,
    Search,
    Barcode,
    Print,
    Calendar,
    Download,
    Order,
    Refresh,
    Cargo,
    Won,
    Dollar,
    Yuan,
    Percent,
    Plus,
    Warn,
    Tooltip,
    LeftArrow,
    RadioOn,
    RadioOff,
    CheckOn,
    CheckOff,
    Pdf,
    Excel,
    AscArrow,
    DescArrow,
    AddBlue,
    Pdalogo,
    PdaHeaderIcon,
    BarcodeIcon,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      count: 0,
    })
    const iconClick = () => {
      if (props.name) emit('click')
    }
    const computedClasses = computed(() => {
      const isClickable =
        ['Search', 'Refresh', 'LeftArrow'].includes(props.name) &&
        !props.disabled
          ? 'cursor-pointer transform hover:scale-125 duration-300 '
          : ''
      return [isClickable]
    })

    /**
     *
     * @type {ComputedRef<unknown>}
     * text와 함께 사용되지 않는 svg는 currentColor를 주고 css로 컨트롤하기 곤란하다.
     * 왜 곤란하냐.. icon 하나만 사용되는 경우에는 class에서 disabled인지 아닌지를 판단해서
     * 해당하는 class를 넣어주는 로직이 매번 들어가줘야 하기 때문에.
     * 그렇다고 a-icon 컴포넌트의 style에서 처리를 하자니 다른 a-icon 컴포넌트들이 영향을 받을테고.
     * 그래서 배경색도 텍스트도 없는 아이콘만 사용될 경우는 iconName뒤에 'Disabled'를 붙여서
     * disabled 상태의 별도의 아이콘을 불러서 사용한다.
     */
    const computedName = computed(() => {
      if (
        props.disabled &&
        (props.name === 'ChevronDown' || props.name === 'Delete')
      ) {
        return `${props.name}Disabled`
      }
      return props.name
    })

    return {
      ...toRefs(state),
      // nameWithCurrency,
      computedClasses,
      computedName,
      iconClick,
    }
  },
}
</script>

<style lang="scss" scoped>
.icon-wrap {
  @apply flex justify-center items-center;
}
</style>
