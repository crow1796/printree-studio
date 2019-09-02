<template>
  <div class="w-full top-0 left-0 h-full bg-white z-50 items-center justify-center flex"
    :class="{ 'absolute': !fullscreen, 'fixed': fullscreen }">
    <div class="flex flex-col justify-center items-center">
      <svg class="lds-blocks" width="80px"  height="80px"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="background: none;"><rect x="19" y="19" width="20" height="20" fill="#e1274e">
        <animate attributeName="fill" values="#fdb813;#e1274e;#e1274e" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0s" calcMode="discrete"></animate>
      </rect><rect x="40" y="19" width="20" height="20" fill="#e1274e">
        <animate attributeName="fill" values="#fdb813;#e1274e;#e1274e" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.125s" calcMode="discrete"></animate>
      </rect><rect x="61" y="19" width="20" height="20" fill="#e1274e">
        <animate attributeName="fill" values="#fdb813;#e1274e;#e1274e" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.25s" calcMode="discrete"></animate>
      </rect><rect x="19" y="40" width="20" height="20" fill="#e1274e">
        <animate attributeName="fill" values="#fdb813;#e1274e;#e1274e" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.875s" calcMode="discrete"></animate>
      </rect><rect x="61" y="40" width="20" height="20" fill="#e1274e">
        <animate attributeName="fill" values="#fdb813;#e1274e;#e1274e" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.375s" calcMode="discrete"></animate>
      </rect><rect x="19" y="61" width="20" height="20" fill="#e1274e">
        <animate attributeName="fill" values="#fdb813;#e1274e;#e1274e" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.75s" calcMode="discrete"></animate>
      </rect><rect x="40" y="61" width="20" height="20" fill="#e1274e">
        <animate attributeName="fill" values="#fdb813;#e1274e;#e1274e" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.625s" calcMode="discrete"></animate>
      </rect><rect x="61" y="61" width="20" height="20" fill="#e1274e">
        <animate attributeName="fill" values="#fdb813;#e1274e;#e1274e" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.5s" calcMode="discrete"></animate>
      </rect></svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fullscreen: {
      type: Boolean
    }
  }
}
</script>
