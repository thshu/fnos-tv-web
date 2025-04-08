<template>
  <div ref="artRef"></div>
</template>

<script>
var instance = null;
import Artplayer from 'artplayer';

export default {
  data() {
    return {
      // instance: null,
    };
  },
  props: {
    option: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    instance = new Artplayer({
      ...this.option,
      container: this.$refs.artRef,
    }, function onReady(art) {
      this.play()
    },);
    this.$nextTick(() => {
      this.$emit('get-instance', instance);
    });
  },
  beforeUnmount() {
    if (instance && instance.destroy) {
      instance.destroy(false);
    }
  },
};
</script>