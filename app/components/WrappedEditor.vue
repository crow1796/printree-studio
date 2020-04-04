<template>
  <div>
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <div class="flex flex-wrap my-2">
        <button class="justify-center h-8 w-8 flex-shrink items-center focus:outline-none m-1 outline-none flex border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
          type="button"
          :class="{ 'bg-gray-200': isActive.bold() }"
          @click="commands.bold">
          <font-awesome-icon class="text-xs" :icon="['fas', 'bold']"/>
        </button>
        <button class="justify-center h-8 w-8 flex-shrink items-center focus:outline-none m-1 outline-none flex border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
          type="button"
          :class="{ 'bg-gray-200': isActive.italic() }"
          @click="commands.italic">
          <font-awesome-icon class="text-xs" :icon="['fas', 'italic']"/>
        </button>
        <button class="justify-center h-8 w-8 flex-shrink items-center focus:outline-none m-1 outline-none flex border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
          type="button"
          :class="{ 'bg-gray-200': isActive.strike() }"
          @click="commands.strike">
          <font-awesome-icon class="text-xs" :icon="['fas', 'strikethrough']"/>
        </button>
        <button class="justify-center h-8 w-8 flex-shrink items-center focus:outline-none m-1 outline-none flex border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
          type="button"
          :class="{ 'bg-gray-200': isActive.underline() }"
          @click="commands.underline">
          <font-awesome-icon class="text-xs" :icon="['fas', 'underline']"/>
        </button>
        <button class="justify-center h-8 w-8 flex-shrink items-center focus:outline-none m-1 outline-none flex border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
          type="button"
          :class="{ 'bg-gray-200': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })">
          H1
        </button>
        <button class="justify-center h-8 w-8 flex-shrink items-center focus:outline-none m-1 outline-none flex border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
          type="button"
          :class="{ 'bg-gray-200': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })">
          H2
        </button>
        <button class="justify-center h-8 w-8 flex-shrink items-center focus:outline-none m-1 outline-none flex border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
          type="button"
          :class="{ 'bg-gray-200': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })">
          H3
        </button>
        <button class="justify-center h-8 w-8 flex-shrink items-center focus:outline-none m-1 outline-none flex border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
          type="button"
          :class="{ 'bg-gray-200': isActive.bullet_list() }"
          @click="commands.bullet_list">
          <font-awesome-icon class="text-xs" :icon="['fas', 'list-ul']"/>
        </button>
        <button class="justify-center h-8 w-8 flex-shrink items-center focus:outline-none m-1 outline-none flex border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
          type="button"
          :class="{ 'bg-gray-200': isActive.ordered_list() }"
          @click="commands.ordered_list">
          <font-awesome-icon class="text-xs" :icon="['fas', 'list-ol']"/>
        </button>
        <button class="justify-center h-8 w-8 flex-shrink items-center focus:outline-none m-1 outline-none flex border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
          type="button"
          :class="{ 'bg-gray-200': isActive.blockquote() }"
          @click="commands.blockquote">
          <font-awesome-icon class="text-xs" :icon="['fas', 'quote-right']"/>
        </button>
        <button class="justify-center h-8 w-8 flex-shrink items-center focus:outline-none m-1 outline-none flex border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
          type="button"
          @click="commands.horizontal_rule">
          <font-awesome-icon class="text-xs" :icon="['fas', 'minus']"/>
        </button>
        <button class="justify-center h-8 w-8 flex-shrink items-center focus:outline-none m-1 outline-none flex border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
          type="button"
          @click="commands.undo">
          <font-awesome-icon class="text-xs" :icon="['fas', 'undo']"/>
        </button>
        <button class="justify-center h-8 w-8 flex-shrink items-center focus:outline-none m-1 outline-none flex border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
          type="button"
          @click="commands.redo">
          <font-awesome-icon class="text-xs" :icon="['fas', 'redo']"/>
        </button>
      </div>
    </editor-menu-bar>
    <editor-content class="editor__content border rounded h-64 overflow-auto break-words p-2" :editor="editor"/>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions'

export default {
  components: {
    EditorContent,
    EditorMenuBar
  },
  props: ['value'],
  data(){
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
        ],
        content: this.value,
        onUpdate: this.contentUpdate
      })
    }
  },
  methods: {
    contentUpdate(e){
      this.$emit('input', e.getHTML())
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>
