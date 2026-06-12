<template>
    <el-container>
        <Shortcut />
        <el-header height class="header-box">
            <Header />
        </el-header>
        <el-main>
            <router-view />
        </el-main>
        <el-footer height>
            <Footer />
        </el-footer>
        <back-to-top />
    </el-container>
</template>

<script>
import Shortcut from '@/layout/shortcut.vue'
import Header from '@/layout/header.vue'
import Footer from '@/layout/footer.vue'
import BackToTop from '@/components/s-ui/list/BackToTop'

export default {
    components: {
        Shortcut,
        Header,
        Footer,
    },
}
</script>

<style scoped>
.aside {
    height: 100vh;
    background: #23262f;
}
.el-header {
    padding: 0;
}
.header-box {
    position: sticky;
    top: -50px;
    z-index: 11;
    background-color: #fff;
}
.el-main {
    min-height: 50vh;
    padding: 0;
    overflow: inherit;
}
.el-footer {
    min-height: 30vh;
    background: #232323;
}
</style>