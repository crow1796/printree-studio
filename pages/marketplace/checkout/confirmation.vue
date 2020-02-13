<template>
  <div class="container mx-auto">
    <BreadCrumbs :items="[{
      title: 'Shipping',
      link: '/marketplace/checkout/shipping'
    }, {
      title: 'Payment Method',
      link: '/marketplace/checkout/payment-method'
    }, {
      title: 'Confirmation',
      link: '/marketplace/checkout/confirmation'
    }]"/>
  </div>
</template>

<script>
import BreadCrumbs from '@/components/BreadCrumbs'

export default {
  layout: 'marketplace',
  components: {
    BreadCrumbs
  }
}
</script>