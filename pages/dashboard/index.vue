<template>
  
</template>

<script>
export default {
  layout: 'user_dashboard',
  middleware: ({redirect}) => {
    redirect('/dashboard/collections')
  }
}
</script>