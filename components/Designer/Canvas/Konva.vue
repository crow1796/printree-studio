<template>
  <v-stage :config="configKonva" ref="designCanvas"
        @mousedown="handleStageMouseDown">
    <v-layer>
      <v-group>
        <v-rect :config="innerCanvasConfig"/>
        <component v-for="obj in canvasObjects" :config="obj" :is="obj.is" :key="obj.id"/>
        <v-transformer ref="transformer"/>
      </v-group>
    </v-layer>
  </v-stage>
</template>

<script>
export default {
  data(){
    return {
      isHoldingSpace: false,
      isCanvasMounted: false,
      stageCursor: 'initial',
      innerCanvasConfig: {
        x: (1000 / 2) - 400, //TODO: This must be served by a server
        y: (1000 / 2) - 500, //TODO: This must be served by a server
        width: 800, //TODO: This must be served by a server
        height: 1000, //TODO: This must be served by a server
        fill: 'white',
        stroke: '#f1f1f1'
      },
      configKonva: {
        width: 1000,
        height: 1000
      },
      canvasObjects: [
        {
          x: ((1000 / 2) - 400) + 100,
          y: ((1000 / 2) - 500) + 100,
          radius: 70,
          fill: "red",
          draggable: true,
          name: 'obj1',
          is: 'v-circle'
        },
        {
          x: ((1000 / 2) - 400) + 300,
          y: ((1000 / 2) - 500) + 300,
          radius: 70,
          fill: "red",
          draggable: true,
          name: 'obj2',
          is: 'v-circle'
        }
      ],
      stageChildrenThumbnails: {},
      selectedObjectName: ''
    }
  },
  mounted(){
    document.firstElementChild.style.zoom = "reset"
    this.stage = this.$refs.designCanvas.getStage()
    this.stage.scale({
      x: .8,
      y: .8
    })

    if(this.$refs.designCanvas) {
      let children = this.stage.getChildren()
      this.isCanvasMounted = true
      _.map(children, (child) => {
        child.toImage({
          callback: (i) => {
            this.stageChildrenThumbnails[child._id] = i.src
          },
          quality: 0
        })
      })
    }

    let stageContainer = this.stage.container()
    stageContainer.tabIndex = 1;
    stageContainer.focus();

    stageContainer.addEventListener('keypress', (evt) => {
      if (evt.which == 32) {
        this.isHoldingSpace = true
        this.stageCursor = 'grab'
        return
      }
      if (evt.ctrlKey && evt.which == 43) {
        return
      }
      this.isHoldingSpace = false
    })

    stageContainer.addEventListener('mousedown', (e) => {
      if(this.isHoldingSpace){
        this.stage.startDrag()
        return
      }
    })

    stageContainer.addEventListener('keyup', (evt) => {
      if (!evt.ctrlKey && evt.which == 32) {
        this.isHoldingSpace = false
        this.stageCursor = 'initial'
        return
      }
      if(evt.which == 27){
        this.selectedObjectName = ''
        this.updateTransformer()
        return
      }
    })
  },
  methods: {
    prepareToDraw(shape){
      this.isPreparingToDraw = true
      this.stageCursor = 'crosshair'
    },
    handleStageMouseDown(e) {
      if(this.isHoldingSpace) return
      // clicked on stage - cler selection
      if (e.target === e.target.getStage()) {
        this.selectedObjectName = ''
        this.updateTransformer()
        return
      }

      // clicked on transformer - do nothing
      const clickedOnTransformer =
        e.target.getParent().className === 'Transformer'
      if (clickedOnTransformer) {
        return
      }

      // find clicked rect by its name
      const name = e.target.name()
      const object = this.canvasObjects.find(r => r.name === name)
      this.selectedObjectName = ''
      if (object) this.selectedObjectName = name
      this.updateTransformer()
    },
    updateTransformer() {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getStage()
      const stage = transformerNode.getStage()

      const selectedNode = stage.findOne('.' + this.selectedObjectName)
      // do nothing if selected node is already attached
      if (selectedNode === transformerNode.node()) {
        return
      }

      if (selectedNode) {
        // attach to another node
        transformerNode.attachTo(selectedNode)
      } else {
        // remove transformer
        transformerNode.detach()
      }
      transformerNode.getLayer().batchDraw()
    }
  },
  watch: {
    stageCursor(newCursor){
      this.stage.container().style.cursor = newCursor
    }
  }
}
</script>

