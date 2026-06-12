<template>
  <div>
    <sui-image
      v-for="(src, index) in list"
      :key="`${src}-${index}`"
      :src="src"
      cut="1080"
      :list="list"
      :lazy="true"
    />
  </div>
</template>

<script>
import SuiImage from "@/components/s-ui/media/Image";
export default {
  components: {
    SuiImage,
  },
  props: {
    list: {
      type: Array,
    },
  },
};
</script>

<style>
</style>