<template>
  <div class="container mx-auto">
    <BreadCrumbs home-link="/marketplace" :items="[{
      title: 'Shipping Address',
      link: '/marketplace/checkout/shipping-address',
      active: true
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