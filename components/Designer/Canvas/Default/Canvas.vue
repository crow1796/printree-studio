<template>
  <div class="flex flex-grow w-full h-full justify-center overflow-hidden bg-gray-200 relative">
    <vue-dropzone
      class="h-full border-0 flex items-center justify-center"
      :class="{'-uploading': isGlobalUploading}"
      ref="globalDropzone"
      id="global-dropzone"
      :style="{ border: 0 }"
      :options="{
            url: `${apiUrl}/upload-art`,
              thumbnailWidth: 150,
              maxFiles: 1,
              acceptedFiles: 'image/svg+xml, image/png, image/jpeg, image/bmp', dictDefaultMessage: 'Click here or drop file here to upload.',
              }"
      @vdropzone-success="assetAdded"
      @vdropzone-sending="globalAssetSending"
    />
    <VueTailwindDrawer ref="artsModal" width="40%">
      <div class="flex p-4 h-full flex-col w-full">
        <div class="flex w-1/3 flex-col w-full">
          <div class="uppercase font-bold text-gray-600 pb-2 px-1">Upload an Image</div>
          <div class="flex h-full w-full my-1">
            <div class="relative h-full w-full border border-dashed">
              <vue-dropzone
                class="h-full border-0 flex items-center justify-center"
                ref="myVueDropzone"
                id="dropzone"
                :style="{ border: 0 }"
                :options="{
            url: `${apiUrl}/upload-art`,
              thumbnailWidth: 150,
              maxFiles: 1,
              acceptedFiles: 'image/svg+xml, image/png, image/jpeg, image/bmp', dictDefaultMessage: 'Click here or drop file here to upload.',
              }"
                @vdropzone-success="assetAdded"
                @vdropzone-sending="assetSending"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col w-2/3 w-full mt-4">
          <div class="uppercase font-bold text-gray-600 pb-2 px-1">Choose an Asset</div>
          <div class="overflow-auto">
            <ArtsList @selected="useAsset
                
              " />
          </div>
        </div>
      </div>
    </VueTailwindDrawer>
    <div class="outline-none select-none relative w-full h-full text-center">
      <div class="panzoom-container flex flex-grow w-full h-full justify-center overflow-hidden">
        <div class="canvas-section outline-none select-none relative w-full h-full text-center">
          <DesignerActions>
            <TopActions
              @action-clicked="topActionClicked"
              :width="width"
              :height="height"
              :activeObject="activeObject"
            />

            <LeftActions @action-clicked="leftActionClicked" />
          </DesignerActions>

          <div class="z-1 inline-block product-section outline-none relative w-auto h-auto">
            <div class="relative w-auto h-full">
              <div
                class="printable-area absolute bg-white"
                :style="{ width: `${width}px`, height: `${height}px`, backgroundColor }"
              >
                <div class="h-full w-full z-10 relative">
                  <drr
                    v-for="(obj, index) in objects"
                    :key="obj._id"
                    :enabled="!isHoldingSpace"
                    :aspectRatio="obj.editorData.aspectRatio"
                    :w="obj.bounds.width || 50"
                    :maxW="obj.type === 'svg' ? -1 : obj.bounds.maxWidth"
                    :maxH="obj.type === 'svg' ? -1 : obj.bounds.maxHeight"
                    :h="obj.bounds.height || 50"
                    :x="obj.bounds.left || 0"
                    :y="obj.bounds.top || 0"
                    :angle="obj.bounds.angle || 0"
                    @select="activated(obj)"
                    @deselect="deactivated(obj)"
                    @dragstop="transformStop($event, obj)"
                    @resizestop="transformStop($event, obj)"
                    @rotatestop="transformStop($event, obj)"
                    @drag="transforming($event, obj)"
                    @resize="transforming($event, obj)"
                    @rotate="transforming($event, obj)"
                    :selected="obj.editorData.isActive"
                    :hasActiveContent="obj.editorData.hasActiveContent"
                    @content-active="activateContent(obj)"
                    :resizable="obj.editorData.isResizable"
                    :style="{ zIndex: (index + 1) }"
                    :ref="`obj_${obj.id}_drr`"
                  >
                    <div
                      class="flex flex-wrap w-full h-full relative z-1 leading-none"
                      v-if="obj.type == 'text'"
                      :style="{
                        ...obj.style,
                        fontSize: `${obj.style.fontSize}px`
                      }"
                      @click.stop
                    >
                      <pre
                        class="w-auto h-auto outline-none focus:outline-none"
                        :ref="`textContainer_${obj.id}`"
                        :id="`textContainer_${obj.id}`"
                        :style="{ fontFamily: obj.style.fontFamily }"
                        @input="changeText"
                        @blur="deactivateContentOf(obj, $event)"
                        @keydown.enter.prevent.stop="deactivateContentOf(obj, $event)"
                        @keypress.enter.prevent.stop="deactivateContentOf(obj, $event)"
                        @keyup.enter.prevent.stop="deactivateContentOf(obj, $event)"
                      >{{ obj.value || '' }}</pre>
                    </div>
                    <div
                      class="flex w-full h-full items-center justify-center"
                      v-if="obj.type == 'image' || obj.type == 'svg'"
                    >
                      <img width="100%" :src="obj.value" />
                    </div>
                    <div
                      v-if="obj.editorData.isActive"
                      class="absolute flex rounded-full bg-white w-6 h-6 items-center justify-center border"
                      :style="{ fontSize: '.7em', top: '-10px', right: '-10px', zIndex: 1 }"
                      @click="removeObject(obj)"
                    >
                      <font-awesome-icon :icon="['fas', 'times']" class="text-red-600" />
                    </div>
                  </drr>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
import panzoom from "panzoom";
import ArtsList from "@/components/Designer/ArtsList";
import VueTailwindDrawer from "@/components/VueTailwindDrawer";
import LeftActions from "@/components/Designer/Canvas/Actions/Left";
import TopActions from "@/components/Designer/Canvas/Actions/Top";
import DesignerActions from "@/components/Designer/Canvas/Actions/index";
import { scaleDown } from "~/plugins/scaler";
import { mapGetters } from "vuex";

export default {
  props: {
    width: {
      required: true,
    },
    height: {
      required: true,
    },
    backgroundColor: {
      required: true,
    },
    value: {
      required: true,
    },
  },
  components: {
    VueTailwindDrawer,
    ArtsList,
    LeftActions,
    TopActions,
    DesignerActions,
  },
  data() {
    return {
      isGlobalUploading: false,
      apiUrl: process.env.apiUrl,
      activeObject: null,
      activeObjectIndex: 0,
      objects: this.value,
      isHoldingSpace: false,
      stageCursor: "initial",
      stageContainer: null,
      canvasScale: 1.0,
      canvasSection: null,
      panzoomController: null,
      isPanning: false,
      arrowKeysTimeout: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this._registerCanvasEvents();
    });
    let lastTarget = null;
    const isFile = (evt) => {
      var dt = evt.dataTransfer;

      for (var i = 0; i < dt.types.length; i++) {
        if (dt.types[i] === "Files") {
          return true;
        }
      }
      return false;
    };

    window.addEventListener("dragenter", (e) => {
      if (isFile(e) && !this.$refs.artsModal?.isShown) {
        lastTarget = e.target;
        if (this.$refs.globalDropzone)
          this.$refs.globalDropzone.$el.classList.add("-uploading");
      }
    });

    window.addEventListener("dragleave", (e) => {
      e.preventDefault();
      if (e.target === this.$refs.globalDropzone?.$el) {
        this.$refs.globalDropzone.$el.classList.remove("-uploading");
      }
    });

    window.addEventListener("dragover", function (e) {
      e.preventDefault();
    });

    window.addEventListener("drop", (e) => {
      e.preventDefault();
      this.$refs.globalDropzone.$el.style.visibility = "hidden";
      this.$refs.globalDropzone.$el.style.opacity = 0;
    });
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
      user: "user",
    }),
  },
  methods: {
    leftActionClicked({ action, args }) {
      switch (action) {
        case "add_text":
          this.addObject("text", "Your Text Here", "Your Text Here");
          break;
        case "add_art":
          this.showDrawer("artsModal");
          break;
        case "layers":
          this.toggleDrawer("layersDrawer");
          break;
        case "duplicate":
          this.duplicate();
          break;
        case "move_position":
          this.moveObjectPosition(args);
          break;
        case "zoom_in":
          this.zoomTo(0.1);
          break;
        case "zoom_out":
          this.zoomTo(-0.1);
          break;
      }
    },
    topActionClicked({ action, args }) {
      switch (action) {
        case "font_family_changed":
          this.changeFontFamily(args);
          break;
        case "toggle_font_weight":
          this.toggleFontWeight(args);
          break;
        case "toggle_font_style":
          this.toggleFontStyle(args);
          break;
        case "toggle_text_decoration":
          this.toggleTextDecoration(args);
          break;
        case "font_size_changed":
          this.changeFontSize(args);
          break;
        case "align_object":
          this.alignObject(args[0], args[1]);
          break;
        case "set_color":
          this.setColorTo(args);
          break;
      }
    },
    _registerCanvasKeyEvents() {
      document.addEventListener("keydown", (evt) => {
        if (this._objectIsEditing()) return;
        // Left
        if (evt.code == "ArrowLeft" && this.activeObject) {
          this._updateActiveObjectProps(
            "bounds.left",
            this.activeObject.bounds.left - 1
          );
          this.isMoving = true;
          return;
        }
        // Up
        if (evt.code == "ArrowUp" && this.activeObject) {
          this._updateActiveObjectProps(
            "bounds.top",
            this.activeObject.bounds.top - 1
          );
          this.isMoving = true;
          return;
        }
        // Right
        if (evt.code == "ArrowRight" && this.activeObject) {
          this._updateActiveObjectProps(
            "bounds.left",
            this.activeObject.bounds.left + 1
          );
          this.isMoving = true;
          return;
        }
        // Down
        if (evt.code == "ArrowDown" && this.activeObject) {
          this._updateActiveObjectProps(
            "bounds.top",
            this.activeObject.bounds.top + 1
          );
          this.isMoving = true;
          return;
        }
      });

      document.addEventListener("keyup", (evt) => {
        if (
          _.includes(
            ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"],
            evt.code
          ) &&
          this.activeObject
        ) {
          clearTimeout(this.arrowKeysTimeout);
          this.arrowKeysTimeout = setTimeout(() => {
            this.$nextTick(() => {
              this.isMoving = false;
            });
          }, 1000);
          return;
        }

        if (evt.code == "Delete") {
          if (!this.activeObject) return;
          if (this._objectIsEditing()) return;
          this.removeObject(this.activeObject);
          return;
        }
      });
    },
    _objectIsEditing() {
      if (this.activeObject?.type === "text") {
        const field = this.$refs[`textContainer_${this.activeObject.id}`][0];

        if (field?.contentEditable === "true") return true;
      }
      return false;
    },
    activated(obj) {
      this.activeObject = obj;
      this.activeObjectIndex = _.findIndex(this.objects, { id: obj.id });
      _.map(this.objects, (ob) => {
        this._updateActiveObjectProps("editorData.isActive", false, ob);
      });
      this._updateActiveObjectProps("editorData.isActive", true);
    },
    _updateActiveObjectProps(path, value, ob = null) {
      if (!ob) ob = this.activeObject;
      ob = _.set(ob, path, value);
      this.$store.commit("designer/OBJECT_PROPERTIES", {
        id: ob.id,
        path: path,
        value: value,
      });
    },
    deactivated() {
      if (!this.activeObject) return;
      this._updateActiveObjectProps("editorData.isActive", false);
    },
    transforming({ x, y, w, h, angle }, obj) {
      // let gridX = (this.width / 2) - (w / 2)
      // let gridY = (this.height / 2) - (h / 2)
      // this.highlightRuler.vertical = (gridX == x) || ((x - (w / 2)) == gridX) || ((x + (w / 2)) == gridX)
      // this.highlightRuler.horizontal = (gridY == y) || ((y - (h / 2)) == gridY) || ((y + (h / 2)) == gridY)
      this.isMoving = true;
    },
    transformStop({ x, y, w, h, angle }, obj) {
      this._updateActiveObjectProps("bounds.left", x);
      this._updateActiveObjectProps("bounds.x", x - w / 2);
      this._updateActiveObjectProps("bounds.top", y);
      this._updateActiveObjectProps("bounds.y", y - h / 2);
      this._updateActiveObjectProps("bounds.width", w);
      this._updateActiveObjectProps("bounds.height", h);
      this._updateActiveObjectProps("bounds.angle", angle);
      this.$store.dispatch(
        "designer/copyPropsToAllVariantsFrom",
        this.activeObject
      );
      this.isMoving = false;
    },
    setColorTo(color) {
      this._updateActiveObjectProps("style.color", color.code);
    },
    changeText(e) {
      this._updateActiveObjectProps("name", e.target.innerText);
      this._updateActiveObjectProps("value", e.target.innerText);
      this._updateActiveObjectProps(
        "bounds.width",
        this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth
      );
      this._updateActiveObjectProps(
        "bounds.height",
        this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight
      );
      this.$store.dispatch(
        "designer/copyPropsToAllVariantsFrom",
        this.activeObject
      );
    },
    showDrawer(modal) {
      this.$refs[modal].show();
    },
    globalAssetSending(e, xhr) {
      this.isGlobalUploading = true;
      this.assetSending(e, xhr);
    },
    assetSending(e, xhr) {
      xhr.setRequestHeader("Authorization", this.$auth.getToken("local"));
    },
    acceptFiles(file, done) {
      var reader = new FileReader();
      reader.onload = function (entry) {
        var image = new Image();
        image.src = entry.target.result;
        image.onload = function () {
          if (this.width < 1000 || this.height < 1000)
            return done("Must be at least 1000x1000.");
          done();
        };
      };

      reader.readAsDataURL(file);
    },
    assetAdded(file, res) {
      let type = "image";
      let value = res.data.imageKitLocation;
      let width = file.width;
      let height = file.height;
      if (file.type == "image/svg+xml") {
        type = "svg";
        let el = document.createElement("img");
        el.src = file.dataURL;
        el.style.position = "absolute";
        el.style.visibility = "hidden";
        el.style.display = "block";
        document.body.appendChild(el);
        document.body.removeChild(el);
        width = el.width;
        height = el.height;
        el = null;
      }
      this.addObject(type, value, file.name, {
        bounds: {
          width: scaleDown(width),
          height: scaleDown(height),
          maxWidth: width,
          maxHeight: height,
        },
      });
      this.$store.commit("designer/ADD_ASSET", res.data);
      this.$refs.artsModal.hide();
      this.isGlobalUploading = false;
      this.$refs.globalDropzone.removeAllFiles();
    },
    async useAsset(asset) {
      const ext = asset.imageKitLocation
        .split(/[#?]/)[0]
        .split(".")
        .pop()
        .trim();
      const img = new Image();
      img.src = ext === "svg" ? asset.location : asset.imageKitLocation;
      const imgData = await new Promise((resolve, reject) => {
        img.onload = function () {
          resolve(this);
        };
      });
      if (ext === "svg") {
        const container = document.createElement("div");
        container.style.visibility = "hidden";
        container.style.opacity = "0";
        container.appendChild(imgData);
        document.body.appendChild(container);

        imgData.width = container.offsetWidth;
        imgData.height = container.offsetHeight;

        document.body.removeChild(container);
      }

      this.addObject(
        ext === "svg" ? "svg" : "image",
        ext === "svg" ? asset.location : asset.imageKitLocation,
        "",
        {
          bounds: {
            left: scaleDown(imgData.width) / 2,
            x: 0,
            top: scaleDown(imgData.height) / 2,
            y: 0,
            width: scaleDown(imgData.width),
            height: scaleDown(imgData.height),
            maxWidth: imgData.width,
            maxHeight: imgData.height,
          },
        }
      );
      this.$refs.artsModal.hide();
    },
    async addObject(type, value = "", name = null, props = {}) {
      let newObject = await this.$store.dispatch("designer/addObject", {
        type,
        value,
      });
      newObject = JSON.parse(JSON.stringify({ ...newObject, ...props }));
      newObject.name = name;
      if (type == "image") {
        let i = new Image();
        i.onload = () => {
          let ratio = 0;
          if (i.width > this.width) {
            ratio = this.width / i.width;
            newObject.bounds.width *= ratio;
            newObject.bounds.height *= ratio;
          }
          if (newObject.bounds.height > this.height) {
            ratio = this.height / i.height;
            newObject.bounds.width *= ratio;
            newObject.bounds.height *= ratio;
          }
          newObject.bounds.left = newObject.bounds.width / 2 || 20;
          newObject.bounds.top = newObject.bounds.height / 2 || 20;
          this.objects.push(newObject);
          this.activated(newObject);
          this.$store.dispatch(
            "designer/copyPropsToAllVariantsFrom",
            newObject
          );
        };
        i.src = value;
        return;
      }
      if (type == "text") {
        let el = document.createElement("div");
        el.innerHTML = value;
        el.style.visibility = "hidden";
        el.style.opacity = "0";
        el.style.display = "inline-block";
        el.style.fontFamily = newObject.style.fontFamily;
        el.style.fontSize = `${newObject.style.fontSize}px`;
        document.body.appendChild(el);
        newObject.bounds.width = el.offsetWidth;
        newObject.bounds.height = el.offsetHeight;
        let ratio = 0;
        if (el.offsetWidth > this.width) {
          ratio = this.width / el.offsetWidth;
          newObject.bounds.width = el.offsetWidth * ratio;
          newObject.bounds.height = el.offsetHeight * ratio;
        }
        if (newObject.bounds.height > this.height) {
          ratio = this.height / el.offsetHeight;
          newObject.bounds.width = el.offsetWidth * ratio;
          newObject.bounds.height = el.offsetHeight * ratio;
        }

        newObject.bounds.left = newObject.bounds.width / 2 || 20;
        newObject.bounds.top = newObject.bounds.height / 2 || 20;

        document.body.removeChild(el);
        el = null;
      }
      this.objects.push(newObject);
      this.activated(newObject);
      this.$store.dispatch("designer/copyPropsToAllVariantsFrom", newObject);
    },
    async removeObject(obj) {
      const index = _.findIndex(this.objects, { id: obj.id });
      console.log(obj.id, [...objects])
      this.objects.splice(index, 1);
      await this.$store.dispatch("designer/removeObject", obj);
      this.deactivateContentOf(obj);
    },
    toggleFontWeight(fontWeight) {
      this._updateActiveObjectProps("style.fontWeight", fontWeight);
      this.$nextTick(() => {
        this._updateActiveObjectProps(
          "bounds.width",
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth
        );
        this._updateActiveObjectProps(
          "bounds.height",
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight
        );
        this.$store.dispatch(
          "designer/copyPropsToAllVariantsFrom",
          this.activeObject
        );
      });
    },
    toggleFontStyle(fontStyle) {
      this._updateActiveObjectProps("style.fontStyle", fontStyle);
      this.$nextTick(() => {
        this._updateActiveObjectProps(
          "bounds.width",
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth
        );
        this._updateActiveObjectProps(
          "bounds.height",
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight
        );
        this.$store.dispatch(
          "designer/copyPropsToAllVariantsFrom",
          this.activeObject
        );
      });
    },
    hasTextDecoration(decoration) {
      return _.includes(this.activeObject.style.textDecoration, decoration);
    },
    toggleTextDecoration(decoration) {
      let newDecoration = this.activeObject.style.textDecoration;
      newDecoration = this.hasTextDecoration(decoration)
        ? newDecoration.replace(decoration, "")
        : newDecoration + ` ${decoration}`;
      newDecoration = newDecoration.trim();
      this._updateActiveObjectProps(
        "style.textDecoration",
        JSON.parse(JSON.stringify(newDecoration))
      );
      this.$nextTick(() => {
        this._updateActiveObjectProps(
          "bounds.width",
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth
        );
        this._updateActiveObjectProps(
          "bounds.height",
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight
        );
        this.$store.dispatch(
          "designer/copyPropsToAllVariantsFrom",
          this.activeObject
        );
      });
    },
    changeFontFamily(font) {
      this._updateActiveObjectProps("style.fontFamily", font.value);
      this.$nextTick(() => {
        this._updateActiveObjectProps(
          "bounds.width",
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth
        );
        this._updateActiveObjectProps(
          "bounds.height",
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight
        );
        this.$store.dispatch(
          "designer/copyPropsToAllVariantsFrom",
          this.activeObject
        );
      });
    },
    changeFontSize(fontSize) {
      clearTimeout(this.fontSizeTimeout);

      this.activeObject.bounds.width = this.$refs[
        `textContainer_${this.activeObject.id}`
      ][0].offsetWidth;
      this.activeObject.bounds.height = this.$refs[
        `textContainer_${this.activeObject.id}`
      ][0].offsetHeight;
      let tmpObj = JSON.parse(JSON.stringify(this.activeObject));

      this.fontSizeTimeout = setTimeout(() => {
        this._updateActiveObjectProps("style.fontSize", fontSize.value, tmpObj);
        this._updateActiveObjectProps(
          "bounds.width",
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth,
          tmpObj
        );
        this._updateActiveObjectProps(
          "bounds.height",
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight,
          tmpObj
        );
        this.$store.dispatch("designer/copyPropsToAllVariantsFrom", tmpObj);
      }, 800);
    },
    alignObject(pos, val) {
      if (!this.activeObject) return;
      this._updateActiveObjectProps(`bounds.${pos}`, val);
      this.$store.dispatch(
        "designer/copyPropsToAllVariantsFrom",
        this.activeObject
      );
    },
    async moveObjectPosition(pos) {
      let newIndex = 0;
      switch (pos) {
        case "front":
          newIndex = this.objects.length - 1;
          break;
        case "forward":
          newIndex =
            this.activeObjectIndex < this.objects.length - 1
              ? this.activeObjectIndex + 1
              : this.activeObjectIndex;
          break;
        case "backward":
          newIndex =
            this.activeObjectIndex > 0
              ? this.activeObjectIndex - 1
              : this.activeObjectIndex;
          break;
        case "back":
          newIndex = 0;
          break;
      }
      let obj = this.activeObject;
      if (!obj) return;
      const newObjects = await this.$store.dispatch(
        "designer/moveObjectPosition",
        {
          obj: obj,
          newIndex,
        }
      );
      this.objects = JSON.parse(JSON.stringify(newObjects));
    },
    async duplicate() {
      if (!this.activeObject) return;
      let newObject = await this.$store.dispatch(
        "designer/duplicate",
        JSON.parse(JSON.stringify(this.activeObject))
      );
      this.objects.push(newObject);
      this.activated(newObject);
      this.$store.dispatch("designer/copyPropsToAllVariantsFrom", newObject);
    },
    _registerCanvasEvents() {
      document.firstElementChild.style.zoom = "reset";
      this.stageContainer = document.querySelector(".panzoom-container");
      this.canvasSection = document.querySelector(".canvas-section");
      this.canvasSection.tabIndex = 1;
      this.canvasSection.focus();

      this.panzoomController = panzoom(
        document.querySelector(".product-section"),
        {
          beforeWheel(e) {
            let shouldIgnore = !e.altKey;
            return shouldIgnore;
          },
          onDoubleClick(e) {
            return false;
          },
        }
      );
      this.moveTo(-(this.width / 2), 0);
      this.panzoomController.pause();

      this.canvasSection.addEventListener("dblclick", (evt) => {
        this.panzoomController.pause();
      });

      this.canvasSection.addEventListener("keypress", (evt) => {
        if (evt.code == "Space") {
          this.isHoldingSpace = true;
          this.stageCursor = "grab";
          return;
        }
        this.isHoldingSpace = false;
      });

      this.canvasSection.addEventListener("mousemove", (e) => {
        if (this.isHoldingSpace) {
          this.isPanning = true;
          this.panzoomController.resume();
          return;
        }
      });

      this.canvasSection.addEventListener("keydown", (evt) => {
        if (evt.ctrlKey && (evt.code == "Equal" || evt.code == "NumpadAdd")) {
          evt.preventDefault();
          this.zoomTo(0.1);
          return;
        }
        if (
          evt.ctrlKey &&
          (evt.code == "Minus" || evt.code == "NumpadSubtract")
        ) {
          evt.preventDefault();
          this.zoomTo(-0.1);
          return;
        }
        if (evt.ctrlKey && (evt.code == "Digit0" || evt.code == "Numpad0")) {
          evt.preventDefault();
          this.zoomTo("reset");
          return;
        }
        if (evt.ctrlKey && evt.code == "KeyB") {
          evt.preventDefault();
          if (this.activeObject.type != "text") return;
          this.toggleFontWeight(
            this.activeObject.style.fontWeight == "bold" ? "normal" : "bold"
          );
          return;
        }
        if (evt.ctrlKey && evt.code == "KeyI") {
          evt.preventDefault();
          if (this.activeObject.type != "text") return;
          this.toggleFontStyle(
            this.activeObject.style.fontStyle == "italic" ? "normal" : "italic"
          );
          return;
        }
        if (evt.ctrlKey && evt.code == "KeyU") {
          evt.preventDefault();
          if (this.activeObject.type != "text") return;
          this.toggleTextDecoration("underline");
          return;
        }
        if (evt.ctrlKey && evt.code == "KeyL") {
          evt.preventDefault();
          if (this.activeObject.type != "text") return;
          this.toggleTextDecoration("line-through");
          return;
        }
      });

      this.canvasSection.addEventListener("keyup", (evt) => {
        if (evt.code == "Space") {
          this.isHoldingSpace = false;
          this.stageCursor = "initial";
          this.isPanning = false;
          this.panzoomController.pause();
          return;
        }
      });

      this._registerCanvasKeyEvents();
    },
    zoomTo(scale) {
      if (scale == "reset") {
        this.canvasScale = 1;
        return;
      }
      this.canvasScale += scale;
    },
    pause() {
      this.panzoomController.pause();
    },
    resume() {
      this.panzoomController.resume();
    },
    moveTo(a, b) {
      this.panzoomController.moveTo(a, b);
    },
    activateContent(obj) {
      this.activated(obj);
      if (obj.type == "text") {
        this.$refs[`textContainer_${obj.id}`][0].contentEditable = true;
        this.$refs[`textContainer_${obj.id}`][0].innerText = obj.value;
        this.$refs[`textContainer_${obj.id}`][0].focus();
      }
    },
    async deactivateContentOf(obj, e) {
      this.$refs[`textContainer_${obj.id}`][0].blur();
      this.$refs[`obj_${obj.id}_drr`][0].$emit("content-inactive");
      this.$refs[`obj_${obj.id}_drr`][0].$emit("deselect");
    },
  },
  watch: {
    stageCursor(newCursor) {
      if (!this.stageContainer) return;
      this.canvasSection.style.cursor = newCursor;
    },
    canvasScale(newScale) {
      if (!this.stageContainer) return;
      let transform = this.panzoomController.getTransform();
      let deltaX = transform.x;
      let deltaY = transform.y;
      let oldScale = transform.scale;
      let offsetX = 0.1 + deltaX;
      let offsetY = 0.1 + deltaY;
      this.panzoomController.zoomAbs(offsetX, offsetY, newScale);
    },
    objects: {
      deep: true,
      handler(to) {
        this.$emit("input", to);
      },
    },
  },
};
</script>