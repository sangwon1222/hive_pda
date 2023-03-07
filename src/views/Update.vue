<template>
  <div class="w-3/4 mx-auto mt-40">
    <h1 class="text-xl bold">🚧 업데이트 내역</h1>

    <dl>
      <dt class="mt-20 mb-10">
        <h2 class="text-lg tracking-wide">v0.1.13</h2>
      </dt>
      <dd>
        <ul class="space-y-10">
          <li>[ 입고 ]</li>
          <li>- 적치시, 팝업 안뜨고 바로 저장하는 기능</li>
          <li>- 수량에 "-" 입력했을 때, 남은 수량 초기화</li>
        </ul>
        <ul class="space-y-10">
          <li>[ 출고 ]</li>
          <li>- 피킹시, 팝업 안뜨고 바로 저장하는 기능</li>
          <li>- 적은 수량 피킹 불가</li>
          <li>- 무조건 (지시수량 = 피킹수량)이 되었을때 자동 피킹되는 기능</li>
        </ul>
        <ul class="space-y-10">
          <li>[ 재고 ]</li>
          <li>- 재고 이동시, 팝업 안뜨고 바로 저장하는 기능</li>
        </ul>
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'home_update',
}
</script>
