import statusRenderer from '@/components/renderer/statusRenderer'
import { useQuantityUnit } from '@/composables'

const agGridHeaders = {
  //***입고
  pdaReceiveData: [
    {
      headerName: '상품 코드',
      field: 'itemCode',
      width: 120,
    },
    {
      headerName: '상품 바코드',
      field: 'itemBarcode',
      width: 130,
    },
    {
      headerName: '유통 기한',
      field: 'expirationDate',
      width: 100,
      valueFormatter: params => {
        return params?.data?.expirationDate.substring(2)
      },
    },
    {
      headerName: 'Lot No',
      field: 'lotNo',
      width: 80,
    },
    {
      headerName: '미적치 수량',
      field: 'remainingQty',
      width: 120,
      valueFormatter: useQuantityUnit,
    },
  ],
  //***피킹
  pdaShippingPickingData: [
    {
      headerName: 'NO',
      field: 'num',
      width: 60,
      valueGetter: 'node.rowIndex + 1',
    },
    {
      headerName: '출고요청일',
      field: 'createdAt',
      width: 110,
      valueFormatter: params => {
        return params?.data?.createdAt.substring(2)
      },
    },
    {
      headerName: '상태',
      field: 'pickingStatusCode',
      width: 100,
      cellRendererFramework: statusRenderer,
      cellRendererParams: params => {
        return {
          code: params.data?.pickingStatusCode,
        }
      },
    },
    {
      headerName: '출고지시번호',
      field: 'shippingLotsCode',
      width: 130,
    },
    {
      headerName: '상품SKU',
      field: 'itemSku',
      width: 100,
    },
    {
      headerName: '지시 수량',
      field: 'totalOrderedQty',
      valueFormatter: useQuantityUnit,
      width: 110,
    },
  ],
  pdaPickingDetailData: [
    {
      headerName: '로케이션',
      field: 'locationCode',
      width: 90,
    },
    {
      headerName: '상품코드',
      field: 'itemCode',
      width: 120,
    },
    {
      headerName: '상품바코드',
      field: 'itemBarcode',
      width: 120,
    },
    {
      headerName: '지시 수량',
      field: 'orderedQty',
      width: 100,
      valueFormatter: useQuantityUnit,
    },
    {
      headerName: '피킹 수량',
      field: 'pickedQty',
      width: 100,
      valueFormatter: useQuantityUnit,
    },
  ],
  //***재고
  pdaStockData: [
    {
      headerName: '유통 기한',
      field: 'expirationDate',
      width: 140,
      valueFormatter: params => {
        return params?.data?.expirationDate.substring(2)
      },
    },
    {
      headerName: '상품바코드',
      field: 'itemBarcode',
      width: 200,
    },
  ],
}

export default agGridHeaders
