<template>
    <div>
        <view3d></view3d>
        <menu-bar/>
        <bottom-bar/>
        <model-list/>
    </div>
</template>

<script>
    import MenuBar from "./MenuBar.vue";
    import BottomBar from "@/view/BottomBar";
    import View3d from "@/view/View3d";
    import ModelList from "@/view/componts/ModelList";


    export default {
        name: "App",
        data() {
            return {}
        },
        components: {
            ModelList,
            BottomBar,
            View3d,
            MenuBar
        }
    }
</script>

<style scoped>

</style>
