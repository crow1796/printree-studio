<template>
  <figure
    class="zoom"
    style="background-image: none"
  >
    <progressive-img :src="img" />
  </figure>
</template>

<script>
export default {
  props: {
    img: {
      required: true
    }
  },
  mounted() {
    this.$el.addEventListener('mouseover', (e) => {
      this.$el.children[0].style.visibility = 'hidden'
      if(this.$el.style.backgroundImage === 'none') this.$el.style.backgroundImage = `url(${this.img})`
    })
    this.$el.addEventListener('mousemove', this.zoom)
    this.$el.addEventListener('mouseout', (e) => {
      this.$el.children[0].style.visibility = 'visible'
      this.$el.style.backgroundImage = 'none'
    })
  },
  methods: {
    zoom(e) {
      let zoomer = e.currentTarget
      let offsetX = e.offsetX
        ? (offsetX = e.offsetX)
        : e.touches ? (offsetX = e.touches[0].pageX) : (offsetX = e.offsetX)
      let offsetY = e.offsetY
        ? (offsetY = e.offsetY)
        : e.touches ? (offsetX = e.touches[0].pageX) : (offsetY = e.offsetY)
      let x = (offsetX / zoomer.offsetWidth) * 100
      let y = (offsetY / zoomer.offsetHeight) * 100
      zoomer.style.backgroundPosition = x + '% ' + y + '%'
    }
  }
}
</script>

<style lang="scss" scoped>
  figure.zoom {
    display: flex;
    background-position: 50% 50%;
    position: relative;
    overflow: hidden;
    cursor: zoom-in;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-repeat: no-repeat;

    & img:hover {
      opacity: 0;
    }

    img {
      object-fit: contain;
      transition: opacity 0.5s;
      display: block;
      width: 50%;
    }

  }
</style>