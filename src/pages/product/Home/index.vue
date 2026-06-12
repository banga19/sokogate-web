<template>
  <LayoutPC v-if="$store.state.nav.layoutMode === 'PC'" />
  <LayoutMobile v-else />
</template>

<script>
import LayoutPC from './LayoutPC.vue'
import LayoutMobile from './LayoutMobile.vue'

export default {
  name: 'ProductHome',
  components: {
    LayoutPC,
    LayoutMobile
  }
}
</script>