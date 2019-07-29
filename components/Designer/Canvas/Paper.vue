<template>
  <div class="panzoom-container relative w-full h-full">
    <div class="border border-grey-100"
      :style="{ width, height }"
      style="position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);">
      <canvas class="paper-canvas"
        :id="$attrs.name || ''"
        style="width: 100%; height: 100%;"></canvas>
    </div>
  </div>
</template>

<script>
import panzoom from 'panzoom'

export default {
  props: ['width', 'height'],
  data(){
    return {
      isHoldingSpace: false,
      isCanvasMounted: false,
      stageCursor: 'initial',
      stageContainer: null,
      panzoomController: null,
      canvasSection: null,
      scale: 1.0,
      paper: null,
      isPanning: false
    }
  },
  mounted(){
    paper.install(window)
    this.paper = paper.setup(document.getElementById(this.$attrs.name))
    this.paper.view.onMouseDown = (e) => this.$emit('mouseDown', e)
    this.paper.view.onMouseDrag = (e) => this.$emit('mouseDrag', e)
    this.paper.view.onMouseUp = (e) => this.$emit('mouseUp', e)

    document.firstElementChild.style.zoom = "reset"
    this.stageContainer = document.querySelector('.panzoom-container')
    this.canvasSection = document.querySelector('.canvas-section')
    this.stageContainer.tabIndex = 1
    this.stageContainer.focus()

    this.panzoomController = panzoom(this.stageContainer)
    this.panzoomController.pause()

    this.canvasSection.addEventListener('keypress', (evt) => {
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
        this.panzoomController.resume()
        this.zoomTo(0.1)
        return
      }
      if (evt.ctrlKey && (evt.which == 109 || evt.which == 189)) {
        evt.preventDefault()
        this.panzoomController.resume()
        this.zoomTo(-0.1)
        return
      }
      if (evt.ctrlKey && (evt.which == 48 || evt.which == 96)) {
        evt.preventDefault()
        this.panzoomController.resume()
        this.zoomTo(-0.1)
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
  methods: {
    zoomTo(scale){
      this.scale = this.scale + scale
    },
    prepareToDraw(shape){
      this.isPreparingToDraw = true
      this.stageCursor = 'crosshair'
    },
    selectLayer(layer) {
      // Deselect all layers
      this.paper.project.layers.forEach((l) => {
        l.selected = false
      })
      // Select the given layer
      layer.selected = true
    },
    draw(object){
      this.paper.project.layers.push(object)
    },
    layers(){
      if(!this.paper) return []
      return this.paper.project.layers
    },
    addLayer(child){
      return new Layer(child)
    }
  },
  watch: {
    stageCursor(newCursor){
      if(!this.stageContainer) return
      this.canvasSection .style.cursor = newCursor
    },
    scale(newScale){
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
