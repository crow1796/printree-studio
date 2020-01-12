<template>
   <div class="panzoom-container flex flex-grow w-full h-full justify-center overflow-hidden">
    <div class="canvas-section outline-none select-none relative w-full h-full text-center">
      <slot/>
    </div>
  </div>
</template>

<script>
import panzoom from 'panzoom'

export default {
  props: {
    isEnabled: {
      type: Boolean,
      default: true
    }
  },
  mounted(){
    this._registerCanvasEvents()
  },
  data(){
    return {
      isHoldingSpace: false,
      stageCursor: 'initial',
      stageContainer: null,
      canvasScale: 1.0,
      canvasSection: null,
      panzoomController: null,
      isHoldingSpace: false,
      isPanning: false,
    }
  },
  methods: {
    _registerCanvasEvents(){
      document.firstElementChild.style.zoom = "reset"
      this.stageContainer = document.querySelector('.panzoom-container')
      this.canvasSection = document.querySelector('.canvas-section')
      this.canvasSection.tabIndex = 1
      this.canvasSection.focus()

      this.panzoomController = panzoom(document.querySelector('.product-section'), {
        beforeWheel(e){
          let shouldIgnore = !e.altKey
          return shouldIgnore
        },
        onDoubleClick(e) {
          return false
        }
      })
      this.panzoomController.pause()

      this.canvasSection.addEventListener('dblclick', (evt) => {
        this.panzoomController.pause()
      })

      this.canvasSection.addEventListener('keypress', (evt) => {
        if(!this.isEnabled) return false;
        if (evt.which == 32) {
          this.isHoldingSpace = true
          this.stageCursor = 'grab'
          return
        }
        this.isHoldingSpace = false
      })

      this.canvasSection.addEventListener('mousemove', (e) => {
        if(this.isHoldingSpace){
          this.isPanning = true
          this.panzoomController.resume()
          return
        }
      })

      this.canvasSection.addEventListener('keydown', (evt) => {
        if (evt.ctrlKey && (evt.which == 107 || evt.which == 187)) {
          evt.preventDefault()
          this.zoomTo(0.1)
          return
        }
        if (evt.ctrlKey && (evt.which == 109 || evt.which == 189)) {
          evt.preventDefault()
          this.zoomTo(-0.1)
          return
        }
        if (evt.ctrlKey && (evt.which == 48 || evt.which == 96)) {
          evt.preventDefault()
          this.zoomTo('reset')
          return
        }
        if (evt.ctrlKey && evt.which == 66) {
          evt.preventDefault()
          if(this.activeObject.type != 'text') return
          this.toggleFontWeight(this.activeObject.style.fontWeight == 'bold' ? 'normal' : 'bold')
          return
        }
        if (evt.ctrlKey && evt.which == 73) {
          evt.preventDefault()
          if(this.activeObject.type != 'text') return
          this.toggleFontStyle(this.activeObject.style.fontStyle == 'italic' ? 'normal' : 'italic')
          return
        }
        if (evt.ctrlKey && evt.which == 85) {
          evt.preventDefault()
          if(this.activeObject.type != 'text') return
          this.toggleTextDecoration('underline')
          return
        }
        if (evt.ctrlKey && evt.which == 75) {
          evt.preventDefault()
          if(this.activeObject.type != 'text') return
          this.toggleTextDecoration('line-through')
          return
        }
      })

      this.canvasSection.addEventListener('keyup', (evt) => {
        if (evt.which == 32) {
          this.isHoldingSpace = false
          this.stageCursor = 'initial'
          this.isPanning = false
          this.panzoomController.pause()
          return
        }
      })
    },
    zoomTo(scale){
      if(scale == 'reset') return this.panzoomController.zoomAbs(0, 0, 1);
      this.canvasScale += scale
    },
    pause(){
      this.panzoomController.pause()
    },
    resume(){
      this.panzoomController.resume()
    },
    moveTo(a, b){
      this.panzoomController.moveTo()
    }
  },
  watch: {
    stageCursor(newCursor){
      if(!this.stageContainer) return
      this.canvasSection .style.cursor = newCursor
    },
    canvasScale(newScale){
      if(!this.stageContainer) return
      let transform = this.panzoomController.getTransform()
      let deltaX = transform.x
      let deltaY = transform.y
      let oldScale = transform.scale
      let offsetX = 0.1 + deltaX
      let offsetY = 0.1 + deltaY
      this.panzoomController.zoomAbs(offsetX, offsetY, newScale)
    }
  }
}
</script>