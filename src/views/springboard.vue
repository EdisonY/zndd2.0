<template>
    <iframe :src="base + targ"  frameborder="0" scrolling="auto"></iframe>
</template>

<script>
export default {
    name: 'springboard',
    data(){
        return{
            base:'http://localhost:9528/',
            targ:''
        }
    },
    created () {
        var self = this
        // setInterval(() => {
        //     self.targ = localStorage.getItem('line')
        // }, 2000);
    }
    
}
</script>

<style lang="scss" scoped>
iframe{width:100vw;height: 100vh;position: relative;}
</style>
