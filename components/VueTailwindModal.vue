<template>
    <div class="fixed inset-0 z-50 overflow-auto bg-smoke-light flex"
        v-if="isShown"
        @click="hide">
        <transition name="slide"
            enter-active-class="slideInDown"
            leave-active-class="slideOutUp">
            <div class="relative bg-white m-auto flex-col flex rounded shadow" @click.stop v-if="isContentShown"
                :class="contentClass"
                :style="{ 'width': width }">
                <slot/>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        contentClass: {
            default: 'p-4'
        },
        width: {
            default: '50%'
        }
    },
    data(){
        return {
            isShown: false,
            isContentShown: false
        }
    },
    methods: {
        show(){
            this.isShown = true
            setTimeout(() => {
                this.isContentShown = true
            }, 300)
        },
        hide(){
            this.isContentShown = false
            setTimeout(() => {
                this.isShown = false
            }, 300)
        }
    }
}
</script>

