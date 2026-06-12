<template>
  <LayoutPC v-if="$store.state.nav.layoutMode === 'PC'" />
  <LayoutMobile v-else />
</template>

<script>
import LayoutPC from './ShortcutV2/LayoutPC.vue'
import LayoutMobile from './ShortcutV2/LayoutMobile.vue'

export default {
  name: 'ShortcutV2',
  components: {
    LayoutPC,
    LayoutMobile,
  },
}
</script>

<style lang="scss" scoped></style>