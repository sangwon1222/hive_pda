const dayjs = require('dayjs')

/**
 * * 재사용성을 위한 함수들
 */
const useLocaleString = params => {
  if (!params.value) return
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(params.value)
}

const useReverseLocaleString = string => {
  if (!string) return
  return string.replace('₩', '').replaceAll(',', '')
}

const useQuantityUnit = number => {
  if (!number.value) return
  return new Intl.NumberFormat().format(number.value) + ' EA'
}
const useLowerFirstLetter = string => {
  if (!string) return
  return string.charAt(0).toLowerCase() + string.slice(1)
}
const useCapitalizeFirstLetter = string => {
  if (!string) return
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const useReverseUseQuantityUnit = string => {
  if (!string) return
  return Number(string.replace(' EA', '').replaceAll(',', ''))
}

const usePercentUnit = number => {
  if (!number) return
  return String(number) + ' %'
}

const useReversePercentUnit = string => {
  if (!string) return
  return Number(string.replace(' %', ''))
}

// * 발주상품취합
const useConsolidate = allProduct => {
  let newAllProduct = []
  for (const [index, product] of allProduct.entries()) {
    // 새로운 배열에 있는 값과 비교한 후 계산해서 푸시
    if (index) {
      let isSame = false
      for (const item of newAllProduct) {
        // 새로운 배열에 동일한 상품 담겨있으면 수량, 금액 누적
        const isSameBarcode = product.itemBarcode === item.itemBarcode
        const isSameProductName = product.itemName === item.itemName
        const isSameExpirationDate =
          product.expirationDate === item.expirationDate
        const isSameofferingRate = product.offeringRate === item.offeringRate

        if (
          isSameBarcode &&
          isSameProductName &&
          isSameExpirationDate &&
          isSameofferingRate
        ) {
          isSame = true
          item.qty = +item.qty + +product.qty
          item.amount = +item.amount + +product.amount
        }
      }
      if (!isSame) {
        newAllProduct.push(product)
      }
    }
    // 첫번째 데이터는 그냥 넣기
    if (!index) {
      newAllProduct.push(product)
    }
  }
  return newAllProduct
}

// * 바이어별 발주수량, 발주금액 총합계
const useTotalQtyAmount = rowData => {
  return rowData.reduce(
    (acc, { qty, amount }) => {
      return {
        totalQty: +acc.totalQty + +qty,
        totalAmount: +acc.totalAmount + +amount,
      }
    },
    { totalQty: 0, totalAmount: 0 },
  )
}

// * 검색버튼 클릭시 파라미터들 검색하기 좋게 정리.
const useReadyToSearch = searchParams => {
  const newValue = {}
  for (const item of Object.entries(searchParams)) {
    if (item[1] || item[1] === false) {
      newValue[item[0]] = item[1]
    }
  }
  return newValue
}

/**
 * '20211010' -> '2021-10-10' 변환
 * @param {*} str
 * @returns
 */
const useStringToDateFormat = str => {
  const isObject = typeof str === 'object'
  if (isObject && !str?.value) return
  if (!isObject && !str) return

  let splitedStr = ''
  if (isObject) {
    splitedStr = str.value.replaceAll('-', '').split('')
  }
  if (!isObject) {
    splitedStr = str.replaceAll('-', '').split('')
  }
  splitedStr.splice(4, 0, '-')
  splitedStr.splice(7, 0, '-')
  return splitedStr.join('')
}

/**
 * infinity scroll ag-grid api call method
 * @param {*} gridApi
 * @param {*} Api
 * @param {*} searchParams
 */
const useSetInfinifyGridData = async ({ gridApi, searchParams }, Api) => {
  gridApi.showLoadingOverlay()
  const blockSize = 100
  await gridApi.setDatasource({
    async getRows(params) {
      try {
        const { data } = await Api({
          page: parseInt(params.startRow / blockSize) + 1,
          size: blockSize,
          ...searchParams,
        })
        const length = data?.content.length
        const lastRow = length < blockSize ? params.startRow + length : -1
        if (gridApi.destroyCalled) return

        await params.successCallback(data?.content, lastRow)
        params.context.onTotalCount(data?.pageable?.total ?? 0)
        data?.pageable?.total
          ? gridApi.hideOverlay()
          : gridApi.showNoRowsOverlay()
      } catch (e) {
        await params.successCallback([], 0)
        params.context.onTotalCount(0)
        gridApi.showNoRowsOverlay()
      }
    },
  })
}

/**
 * location code
 * A01-01-01 형식으로 바꿔주는 format 9 / 7
 * AAA01-01-01 형식으로 바꿔주는 format 11 / 9
 */
const formatLocCode = code => {
  code = code.replaceAll('-', '')
  code = code
    .toUpperCase()
    .replace(/(^[A-Z0-9]{3,5})([0-9]{2})([0-9]{2})/, '$1-$2-$3')
    .replace('--', '-')
  return code
}
function convertDateFormatToYYYYMMDD(date) {
  const newDate = dayjs(date).format('YYYY-MM-DD')
  return newDate
}

const useValidOnlyNumber = value => {
  const regExp = /^[0-9]*$/
  return regExp.test(value)
}
const useValidOnlyString = value => {
  const regExp = /^[a-zA-Z]*$/
  return regExp.test(value)
}
const useValidOnlyNumberWithComma = value => {
  const regExp = /^[0-9,]*$/
  return regExp.test(value)
}

// 숫자, 영문 정규식 return Boolean
const useValidOnlyNumberWithEng = value => {
  const checkInput = /^[a-zA-Z0-9]*$/
  return checkInput.test(value)
}

/**
 * 컬럼클릭시 정렬검색될 searchParams 리턴
 * @param {*} state
 * @returns
 */
const useSortedSearchParams = state => {
  const columnState = state.columnApi.getColumnState()
  const column = columnState.filter(column => column.sort)[0]

  column
    ? (state.searchParams.sortBy = `${column.colId}-${column.sort}`)
    : delete state.searchParams.sortBy
  return state.searchParams
}

/**
 * 리스트에서 총합계 구하기
 * @param {} arr - 총합계를 구할 배열, [{}] 의 형식
 * @param {*} column - 총합계 속성명, ex: totlaQty
 * @returns
 */
const useSumTotalQty = (arr, column) => {
  return arr.reduce((acc, cur) => {
    return acc + +cur[column]
  }, 0)
}

const getRowStyle = params => {
  let color = ''
  params.node.selected && (color = '#A9C5FF') // 공통
  params?.data?.statusCode === 3100404 && (color = '#bcbcbc') // 피킹상태-완료, 완료 항목
  params?.data?.remainingQty === 0 && (color = '#bcbcbc') // 재고가 0일때, 완료 항목
  return { background: color }
}

const formatPopupText = (text, state) => {
  state.popupText = text
    .replaceAll('(', "<span class='text-hive-teal-600'>")
    .replaceAll(')', '</span>')
  state.refModal && state.refModal.open()
}

const overlay = type => {
  let text = ''
  type === 'loading' && (text = '데이터를 불러오는 중입니다.')
  type === 'no-row' && (text = '조회된 데이터가 없습니다.')

  if (text)
    return `
    <div class='flex items-center w-full h-full font-bold'>
      <span class='m-auto '>${text}</span>
    </div>
    `
}

export {
  useSumTotalQty,
  useStringToDateFormat,
  useLocaleString,
  useReverseLocaleString,
  useLowerFirstLetter,
  useCapitalizeFirstLetter,
  useConsolidate,
  useTotalQtyAmount,
  useQuantityUnit,
  useReverseUseQuantityUnit,
  usePercentUnit,
  useReversePercentUnit,
  useReadyToSearch,
  useSetInfinifyGridData,
  formatLocCode,
  useValidOnlyNumber,
  useValidOnlyNumberWithComma,
  convertDateFormatToYYYYMMDD,
  useValidOnlyNumberWithEng,
  useSortedSearchParams,
  useValidOnlyString,
  getRowStyle,
  formatPopupText,
  overlay,
}
